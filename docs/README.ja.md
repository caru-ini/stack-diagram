# stack-diagram

[![Release](https://img.shields.io/github/v/release/caru-ini/stack-diagram)](https://github.com/caru-ini/stack-diagram/releases/latest)
[![License](https://img.shields.io/github/license/caru-ini/stack-diagram)](../LICENSE)
[![skills.sh](https://skills.sh/b/caru-ini/stack-diagram)](https://skills.sh/caru-ini/stack-diagram)

[English](../README.md) | **日本語** | [简体中文](README.zh-CN.md) | [한국어](README.ko.md)

技術スタックを一文で伝えると、公式ロゴ入りの構成図ができます。

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="hero-dark.png">
  <img src="hero.png" alt="構成図: ユーザーは HTTPS で Vercel 上の Next.js にアクセスする。Next.js は同じ Vercel デプロイ内の Hono API を RPC で呼ぶ。Hono は SQL で Neon に問い合わせ、セッションは Clerk、決済は Stripe を呼ぶ。GitHub Actions がデプロイする" width="100%">
</picture>

> Diagram our stack: Next.js and a Hono API on Vercel. Postgres on Neon, auth with Clerk, payments with Stripe. GitHub Actions deploys.

```bash
npx skills add caru-ini/stack-diagram
```

Claude Code、Codex、Cursor など、[スキルに対応したエージェント](https://agentskills.io)で使えます。Claude アプリでは、[Releases](https://github.com/caru-ini/stack-diagram/releases/latest) から `stack-diagram.zip` をダウンロードし、スキルとしてアップロードしてください。

## ほかの例

<table>
  <tr>
    <td width="50%" valign="top">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="tooling-dark.png">
        <img src="tooling.png" alt="モノレポの開発ツール構成図: 開発者が push すると GitHub Actions が Turborepo を実行し、npm に公開する。pnpm ワークスペースの中では、Lefthook がコミット前に Biome を実行し、Turborepo が Biome と Vitest を実行する" width="100%">
      </picture>
      <p><b>クラウドに限らず開発ツールも</b></p>
      <blockquote>Draw our monorepo tooling: a pnpm workspace with Turborepo, Biome, Vitest and Lefthook. GitHub Actions runs CI and publishes to npm.</blockquote>
    </td>
    <td width="50%" valign="top">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="ai-dark.png">
        <img src="ai.png" alt="AI アプリの構成図: ユーザーが Vercel 上の Next.js に質問すると、Next.js は Supabase pgvector でベクトル検索をして Claude にプロンプトを送る。Inngest は毎晩 Notion のドキュメントを同期し、埋め込みを Supabase に保存する" width="100%">
      </picture>
      <p><b>AI アプリ</b></p>
      <blockquote>Draw our docs chatbot: Next.js on Vercel searches Supabase pgvector and answers with Claude. Inngest syncs Notion every night.</blockquote>
    </td>
  </tr>
  <tr>
    <td colspan="2" valign="top">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="aws-dark.png">
        <img src="aws.png" alt="AWS の構成図: ユーザーは HTTPS で CloudFront にアクセスする。CloudFront は静的パスを S3 から返し、API パスを VPC のパブリックサブネットにある ALB に送る。ALB はプライベートサブネットの Fargate に転送し、Fargate は SQL で RDS に問い合わせ、ElastiCache をキャッシュに使う" width="100%">
      </picture>
      <p><b>AWS は AWS 公式のアイコンで</b></p>
      <blockquote>Draw our app on AWS: CloudFront in front of S3 and an ALB in a public subnet. Fargate, RDS and ElastiCache sit in a private subnet.</blockquote>
    </td>
  </tr>
  <tr>
    <td colspan="2" valign="top">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="gcp-dark.png">
        <img src="gcp.png" alt="Google Cloud の構成図: ユーザーは HTTPS で Cloud Load Balancing にアクセスする。ロードバランサは静的パスを Cloud Storage から返し、API パスを VPC 内の1リージョンにある GKE に送る。GKE は SQL で Cloud SQL に問い合わせ、Memorystore をキャッシュに使う" width="100%">
      </picture>
      <p><b>Google Cloud は Google 公式のアイコンで</b></p>
      <blockquote>Draw our app on Google Cloud: a global load balancer in front of Cloud Storage and GKE. GKE, Cloud SQL and Memorystore run in one region of a VPC.</blockquote>
    </td>
  </tr>
  <tr>
    <td colspan="2" valign="top">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="azure-dark.png">
        <img src="azure.png" alt="Azure の構成図: ユーザーは HTTPS で Azure Front Door にアクセスする。Front Door は静的パスを Azure Blob Storage から返し、API パスを東日本リージョンの Azure App Service に送る。App Service は仮想ネットワーク内のプライベートエンドポイント経由で、SQL で Azure SQL Database に問い合わせ、Azure Managed Redis をキャッシュに使う" width="100%">
      </picture>
      <p><b>Azure は Microsoft 公式のアイコンで</b></p>
      <blockquote>Draw our app on Azure: Front Door in front of Blob Storage and App Service. App Service reaches Azure SQL and Managed Redis through private endpoints in a VNet.</blockquote>
    </td>
  </tr>
</table>

## ライトとダーク

どの図もライトとダークの両方のテーマで出力します。タイルは白のままなので、ロゴは本来の色で表示されます。グループのラベルは、ブランドのダークテーマ用ロゴに切り替わります。

<img src="light-dark.png" alt="モノレポの開発ツール構成図を斜めに切り分けた画像。左上がライトテーマ、右下がダークテーマ" width="100%">

## アーティファクトとして共有する

図はフォントとロゴを埋め込んだ1つの HTML ファイルです。ネットワークがなくても、どこでも表示できます。Claude のアーティファクトとして公開してリンクを共有するほか、リポジトリや Wiki にそのまま置くこともできます。PNG と React コンポーネントも、この HTML ファイルから書き出します。

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="html-page-dark.png">
  <img src="html-page.png" alt="ドキュメント検索チャットボットの構成図を、ブラウザで HTML ページとして開いたところ。タイトル、短い説明、図、凡例、フッターが並ぶ" width="100%">
</picture>

## ギャラリーに投稿する

図を描き終えると、エージェントが公開ギャラリー <https://stacks.caru.moe> への投稿を一度だけ提案します。公開される内容（ライトとダークの PNG、英語のタイトル、技術スタック、表示名）を見せたうえで、2回「はい」と答えたときだけ投稿します。プロンプトは送信しません。GitHub ログインは任意で、ほかの人には表示されません。ログインしておくと、あとで投稿を削除できます。サイトのソースは [`site/`](../site) にあります。

## 特長

- **公式ロゴを自動で取得します。** [svgl](https://svgl.app)、[devicon](https://devicon.dev)、[gilbarbara/logos](https://github.com/gilbarbara/logos) の順に探すか、ブランド自身のリポジトリから取得します。AWS、Google Cloud、Azure、Kubernetes、CNCF プロジェクトのアイコンは、各ベンダーの公式パッケージから取得します（[AWS](https://aws.amazon.com/architecture/icons/)、[Google Cloud](https://cloud.google.com/icons)、[Azure](https://learn.microsoft.com/en-us/azure/architecture/icons/)、[Kubernetes](https://github.com/kubernetes/community/tree/master/icons)、[CNCF](https://github.com/cncf/artwork)）。Databricks にはアイコンパッケージがありません。そのため Databricks の製品アイコンには、databricks.com にある Databricks 自身のアートワークを使います。探すときはコミュニティの [databricks-architecture-icons](https://github.com/oieduardorabelo/databricks-architecture-icons) カタログを使います。ロゴの色を変えたり描き直したりはしません。
- **矢印が文字に重なりません。** 線はラベルを避けて引きます。エージェントは図をレンダリングして確認してから渡します。
- **必要な形式で受け取れます。** 単体で完結する HTML ファイル（既定）、PNG、依存のない React コンポーネント、アーティファクトから選べます。

Python 3.9 以上と、ロゴを取得するためのネットワーク接続が必要です。PNG の書き出しには Playwright と Chromium を使います。

## スターの推移

<a href="https://www.star-history.com/?repos=caru-ini%2Fstack-diagram&type=date&legend=top-left">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=caru-ini/stack-diagram&type=date&theme=dark&legend=top-left">
    <img src="https://api.star-history.com/chart?repos=caru-ini/stack-diagram&type=date&legend=top-left" alt="caru-ini/stack-diagram の GitHub スター数の推移" width="100%">
  </picture>
</a>

## ライセンスと商標

- コードとドキュメント: MIT（`LICENSE` を参照）
- 同梱フォント: SIL Open Font License 1.1（`skills/stack-diagram/assets/fonts/` を参照）
- ロゴはスキルに**同梱していません**。ビルド時に次の配布元からダウンロードします: [svgl](https://svgl.app)、[devicon](https://devicon.dev)（MIT）、[gilbarbara/logos](https://github.com/gilbarbara/logos)（CC0）、[AWS Architecture Icons](https://aws.amazon.com/architecture/icons/)、[Google Cloud product icons](https://cloud.google.com/icons)、[Azure icons](https://learn.microsoft.com/en-us/azure/architecture/icons/)、[Kubernetes Community Icons](https://github.com/kubernetes/community/tree/master/icons)（Apache-2.0 / CC-BY-4.0）、[CNCF Artwork](https://github.com/cncf/artwork)（Linux Foundation の商標利用ガイドライン）、[databricks-architecture-icons](https://github.com/oieduardorabelo/databricks-architecture-icons) 経由で databricks.com の Databricks アートワーク（このカタログは MIT ライセンスの非公式プロジェクトで、Databricks の承認は受けていません。アートワークの権利は Databricks にあります）、[Lucide](https://lucide.dev)（ISC）、またはブランド自身のサイトやリポジトリ。`docs/` の例の画像には、他社のロゴが含まれます。ブランド名とロゴはすべて各所有者の商標です。図に使っても、その所有者による推奨を意味しません。スクリプトがロゴの色や形を変えることはありません。Microsoft は、アーキテクチャ図、トレーニング資料、ドキュメントでの Azure アイコンの使用を認めています。
