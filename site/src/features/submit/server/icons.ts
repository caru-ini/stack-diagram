import type { StackItem } from "@/lib/db/schema.ts";

import type { Meta } from "./meta.ts";
import { pngSize } from "./png.ts";
import { readAtMost } from "./read.ts";

// Curated sets only: a wider GitHub prefix would let anyone host any image here.
export const ICON_PREFIXES = [
  "https://svgl.app/library/",
  "https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/",
  "https://raw.githubusercontent.com/devicons/devicon/master/icons/",
  "https://raw.githubusercontent.com/kubernetes/community/",
  "https://raw.githubusercontent.com/cncf/artwork/",
] as const;

export const MAX_ICON_FETCHES = 24;
const ICON_TIMEOUT = 5000;
const MAX_ICON_BYTES = 64 * 1024;
// svgl marks run up to 2.9:1 (Cloudflare's cloud is 2.2); every svgl logo past 3:1 is a wordmark.
const WIDE_ASPECT = 3;

type Icon = { ext: "svg" | "png" | "webp"; contentType: string; wide: boolean };
type StoredIcon = { key: string; wide: boolean };
type IconBucket = {
  head(key: string): Promise<unknown>;
  put(
    key: string,
    value: Uint8Array,
    options: { httpMetadata: { contentType: string } },
  ): Promise<unknown>;
};

/** The normalized URL, so `..` cannot step outside a prefix, when it is https under the allowlist. */
export function allowedIconUrl(value: string | undefined) {
  const url = value ? URL.parse(value) : null;
  return url?.protocol === "https:" && ICON_PREFIXES.some((prefix) => url.href.startsWith(prefix))
    ? url.href
    : null;
}

const isWide = (width: number, height: number) =>
  width > 0 && height > 0 && width / height > WIDE_ASPECT;

export const isSafeSvg = (text: string) =>
  (text.startsWith("<svg") || text.startsWith("<?xml")) &&
  /<svg\b/.test(text) &&
  !/<([\w-]+:)?script/i.test(text);

export function svgIsWide(svg: string) {
  const root = /<svg\b[^>]*>/.exec(svg)?.[0] ?? "";
  const box = /\sviewBox\s*=\s*["']([^"']*)["']/
    .exec(root)?.[1]
    ?.trim()
    .split(/[\s,]+/)
    .map(Number);
  if (box?.length === 4 && box.every(Number.isFinite)) {
    const [, , width = 0, height = 0] = box;
    return isWide(width, height);
  }
  // The leading \s keeps stroke-width from passing for width.
  const length = (name: string) =>
    Number(new RegExp(`\\s${name}\\s*=\\s*["']\\s*([\\d.]+)(?:px)?\\s*["']`).exec(root)?.[1]);
  return isWide(length("width"), length("height"));
}

/** Sniffs the bytes: raw.githubusercontent.com serves every SVG as text/plain. */
export function readIcon(bytes: Uint8Array): Icon | null {
  const png = pngSize(bytes);
  if (png) {
    return { ext: "png", contentType: "image/png", wide: isWide(png.width, png.height) };
  }
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.subarray(start, end));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") {
    return { ext: "webp", contentType: "image/webp", wide: false };
  }
  const text = new TextDecoder().decode(bytes).trimStart();
  return isSafeSvg(text)
    ? { ext: "svg", contentType: "image/svg+xml", wide: svgIsWide(text) }
    : null;
}

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");

async function storeIcon(bucket: IconBucket, url: string): Promise<StoredIcon | null> {
  // A redirect could leave the allowlist, so only a direct 200 counts.
  const response = await fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(ICON_TIMEOUT),
  });
  if (response.status !== 200 || !response.body) {
    return null;
  }
  const bytes = await readAtMost(response.body, MAX_ICON_BYTES);
  const icon = bytes && readIcon(bytes);
  if (!bytes || !icon) {
    return null;
  }
  const key = `icons/${toHex(await crypto.subtle.digest("SHA-256", bytes))}.${icon.ext}`;
  if (!(await bucket.head(key))) {
    await bucket.put(key, bytes, { httpMetadata: { contentType: icon.contentType } });
  }
  return { key, wide: icon.wide };
}

/** Light logos first, each URL once, at most 24; a failed icon is left out, never the post. */
export async function storeIcons(bucket: IconBucket, stack: Meta["stack"]): Promise<StackItem[]> {
  const wanted = [...stack.map((item) => item.icon), ...stack.map((item) => item.iconDark)];
  const urls = [...new Set(wanted.map(allowedIconUrl).filter((url) => url !== null))].slice(
    0,
    MAX_ICON_FETCHES,
  );
  const stored = new Map(
    urls.map((url) => [
      url,
      storeIcon(bucket, url).catch((error: unknown) => {
        console.error("icon", url, error);
        return null;
      }),
    ]),
  );
  const lookUp = (url: string | undefined) => {
    const key = allowedIconUrl(url);
    return key === null ? null : (stored.get(key) ?? null);
  };
  return Promise.all(
    stack.map(async (item) => {
      const [light, dark] = await Promise.all([lookUp(item.icon), lookUp(item.iconDark)]);
      return {
        name: item.name,
        iconKey: light?.key ?? null,
        iconDarkKey: dark?.key ?? null,
        wide: (light ?? dark)?.wide ?? false,
      };
    }),
  );
}
