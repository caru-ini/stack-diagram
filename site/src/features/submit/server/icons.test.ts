import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import {
  MAX_ICON_FETCHES,
  allowedIconUrl,
  isSafeSvg,
  readIcon,
  storeIcons,
  svgIsWide,
} from "./icons.ts";
import { pngBytes } from "./test-png.ts";

const SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>';
const utf8 = (text: string) => new TextEncoder().encode(text);

function bucket() {
  const keys = new Set<string>();
  return {
    keys,
    bucket: {
      head: async (key: string) => (keys.has(key) ? {} : null),
      put: async (key: string) => keys.add(key),
    },
  };
}

function serve(respond: (url: string) => Response) {
  const fetched: string[] = [];
  vi.stubGlobal("fetch", (url: string) => {
    fetched.push(url);
    return Promise.resolve(respond(url));
  });
  return fetched;
}

describe("allowedIconUrl", () => {
  it("takes https URLs under the curated prefixes", () => {
    for (const url of [
      "https://svgl.app/library/hono.svg",
      "https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/vercel-icon.svg",
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original.svg",
      "https://raw.githubusercontent.com/kubernetes/community/master/icons/svg/resources/unlabeled/pod.svg",
      "https://raw.githubusercontent.com/cncf/artwork/master/projects/cilium/icon/color/cilium_icon-color.svg",
    ]) {
      expect(allowedIconUrl(url)).toBe(url);
    }
  });

  it("refuses other schemes, hosts and paths, including ones that only look alike", () => {
    for (const url of [
      "http://svgl.app/library/hono.svg",
      "https://svgl.app/hono.svg",
      "https://svgl.app.evil.test/library/hono.svg",
      "https://svgl.app@evil.test/library/hono.svg",
      "https://svgl.app/library/../api/hono.svg",
      "https://cdn.jsdelivr.net/gh/gilbarbara/logos/%2e%2e/%2e%2e/evil/x.svg",
      "https://cdn.jsdelivr.net/npm/lucide-static/icons/server.svg",
      "https://raw.githubusercontent.com/someone/repo/main/logo.svg",
      "https://raw.githubusercontent.com/devicons/devicon/0123abc/icons/go/go-original.svg",
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/../../fork/x.svg",
      "javascript:alert(1)",
      "not a url",
    ]) {
      expect(allowedIconUrl(url)).toBeNull();
    }
  });
});

describe("isSafeSvg", () => {
  it("takes markup that opens with <svg or <?xml", () => {
    expect(isSafeSvg(SVG)).toBe(true);
    expect(isSafeSvg(`<?xml version="1.0" encoding="UTF-8"?>\n${SVG}`)).toBe(true);
  });

  it("refuses scripts, prefixed or not, and anything that is not an SVG", () => {
    for (const text of [
      SVG.replace("<path", "<script>alert(1)</script><path"),
      SVG.replace("<path", "<SCRIPT>alert(1)</SCRIPT><path"),
      SVG.replace(
        "<path",
        '<s:script xmlns:s="http://www.w3.org/2000/svg">alert(1)</s:script><path',
      ),
      `<!DOCTYPE html><html>${SVG}</html>`,
      '<?xml version="1.0"?><html/>',
      "plain text",
    ]) {
      expect(isSafeSvg(text)).toBe(false);
    }
  });
});

describe("readIcon", () => {
  it("sniffs SVG past a byte order mark and whitespace, PNG and WebP", () => {
    expect(readIcon(utf8(`\uFEFF\n  ${SVG}`))).toEqual({
      ext: "svg",
      contentType: "image/svg+xml",
      wide: false,
    });
    expect(readIcon(pngBytes(64, 64))).toEqual({
      ext: "png",
      contentType: "image/png",
      wide: false,
    });
    expect(readIcon(utf8("RIFF\0\0\0\0WEBPVP8 "))).toMatchObject({ ext: "webp" });
    expect(readIcon(utf8("GIF89a"))).toBeNull();
  });
});

describe("wide detection", () => {
  it("reads the viewBox, with spaces or commas", () => {
    expect(svgIsWide('<svg viewBox="0 0 400 100">')).toBe(true);
    expect(svgIsWide('<svg viewBox="0,0,301,100">')).toBe(true);
    expect(svgIsWide('<svg viewBox="0 0 300 100">')).toBe(false);
    expect(svgIsWide('<svg viewBox="0 0 100 100">')).toBe(false);
  });

  it("keeps a wide mark like Cloudflare's cloud apart from wordmarks", () => {
    expect(svgIsWide('<svg viewBox="0 0 256 116">')).toBe(false);
  });

  it("falls back to width and height, never stroke-width", () => {
    expect(svgIsWide('<svg width="320px" height="100">')).toBe(true);
    expect(svgIsWide('<svg stroke-width="200" width="24" height="24">')).toBe(false);
    expect(svgIsWide('<svg width="100%" height="20">')).toBe(false);
    expect(svgIsWide("<svg>")).toBe(false);
  });

  it("reads a PNG's IHDR", () => {
    expect(readIcon(pngBytes(400, 100))?.wide).toBe(true);
    expect(readIcon(pngBytes(100, 100))?.wide).toBe(false);
  });
});

describe("storeIcons", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches each URL once, light logos first, and at most 24 in all", async () => {
    const fetched = serve(() => new Response(SVG));
    const stack = Array.from({ length: 20 }, (_, i) => ({
      name: `Tech ${i}`,
      icon: `https://svgl.app/library/${i}.svg`,
      iconDark: `https://svgl.app/library/${i}_dark.svg`,
    }));
    const first = "https://svgl.app/library/0.svg";
    stack.push({ name: "Again", icon: first, iconDark: first });
    const stored = await storeIcons(bucket().bucket, stack);
    expect(fetched.length).toBe(MAX_ICON_FETCHES);
    expect(new Set(fetched).size).toBe(MAX_ICON_FETCHES);
    expect(fetched.slice(0, 20).every((url) => !url.includes("_dark"))).toBe(true);
    expect(stored.at(-1)?.iconKey).toBe(stored[0]?.iconKey);
    expect(stored.at(-1)?.iconDarkKey).toBe(stored[0]?.iconKey);
    expect(stored.filter((item) => item.iconDarkKey).length).toBe(5);
  });

  it("stores by content hash, so the same logo is stored once", async () => {
    serve(() => new Response(SVG));
    const store = bucket();
    const stored = await storeIcons(store.bucket, [
      { name: "A", icon: "https://svgl.app/library/a.svg" },
      {
        name: "B",
        icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/b/b.svg",
      },
    ]);
    expect(store.keys.size).toBe(1);
    expect(stored[0]?.iconKey).toMatch(/^icons\/[0-9a-f]{64}\.svg$/);
    expect(stored[1]?.iconKey).toBe(stored[0]?.iconKey);
  });

  it("leaves out an icon that fails, keeping the rest of the post", async () => {
    const fetched = serve((url) => {
      if (url.includes("redirect")) {
        return new Response(null, { status: 302, headers: { location: "https://evil.test/" } });
      }
      if (url.includes("huge")) {
        return new Response(`${SVG}${" ".repeat(64 * 1024)}`);
      }
      if (url.includes("script")) {
        return new Response(SVG.replace("<path", "<script>alert(1)</script><path"));
      }
      return new Response(utf8("not found"), { status: 404 });
    });
    const stored = await storeIcons(bucket().bucket, [
      { name: "Redirect", icon: "https://svgl.app/library/redirect.svg" },
      { name: "Huge", icon: "https://svgl.app/library/huge.svg" },
      { name: "Script", icon: "https://svgl.app/library/script.svg" },
      { name: "Missing", icon: "https://svgl.app/library/missing.svg" },
      { name: "Elsewhere", icon: "https://evil.test/logo.svg" },
      { name: "None" },
    ]);
    expect(fetched.length).toBe(4);
    expect(stored).toEqual(
      ["Redirect", "Huge", "Script", "Missing", "Elsewhere", "None"].map((name) => ({
        name,
        iconKey: null,
        iconDarkKey: null,
        wide: false,
      })),
    );
  });
});
