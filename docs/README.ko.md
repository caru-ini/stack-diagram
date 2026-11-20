# stack-diagram

[![Release](https://img.shields.io/github/v/release/caru-ini/stack-diagram)](https://github.com/caru-ini/stack-diagram/releases/latest)
[![License](https://img.shields.io/github/license/caru-ini/stack-diagram)](../LICENSE)
[![skills.sh](https://skills.sh/b/caru-ini/stack-diagram)](https://skills.sh/caru-ini/stack-diagram)

[English](../README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | **한국어**

기술 스택을 한 문장으로 설명하면, 공식 로고가 들어간 아키텍처 다이어그램을 만들어 줍니다.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="hero-dark.png">
  <img src="hero.png" alt="아키텍처 다이어그램: 사용자가 HTTPS로 Vercel의 Next.js에 접속한다. Next.js는 같은 Vercel 배포 안의 Hono API를 RPC로 호출한다. Hono는 SQL로 Neon을 조회하고, 세션은 Clerk, 결제는 Stripe를 호출한다. 배포는 GitHub Actions가 한다" width="100%">
</picture>

> Diagram our stack: Next.js and a Hono API on Vercel. Postgres on Neon, auth with Clerk, payments with Stripe. GitHub Actions deploys.

```bash
npx skills add caru-ini/stack-diagram
```

Claude Code, Codex, Cursor 등 [스킬을 지원하는 에이전트](https://agentskills.io)에서 사용할 수 있습니다. Claude 앱에서는 [Releases](https://github.com/caru-ini/stack-diagram/releases/latest)에서 `stack-diagram.zip`을 내려받아 스킬로 업로드하세요.

## 더 많은 예시

<table>
  <tr>
    <td width="50%" valign="top">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="tooling-dark.png">
        <img src="tooling.png" alt="모노레포 개발 도구 다이어그램: 개발자가 GitHub Actions로 푸시하면 GitHub Actions가 Turborepo를 실행하고 npm에 게시한다. pnpm 워크스페이스 안에서는 Lefthook이 커밋 전에 Biome을 실행하고, Turborepo가 Biome과 Vitest를 실행한다" width="100%">
      </picture>
      <p><b>클라우드뿐 아니라 개발 도구도</b></p>
      <blockquote>Draw our monorepo tooling: a pnpm workspace with Turborepo, Biome, Vitest and Lefthook. GitHub Actions runs CI and publishes to npm.</blockquote>
    </td>
    <td width="50%" valign="top">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="ai-dark.png">
        <img src="ai.png" alt="AI 앱 다이어그램: 사용자가 Vercel의 Next.js에 질문하면 Next.js는 Supabase pgvector에서 벡터 검색을 하고 Claude에 프롬프트를 보낸다. Inngest는 매일 밤 Notion 문서를 동기화하고 임베딩을 Supabase에 저장한다" width="100%">
      </picture>
      <p><b>AI 앱</b></p>
      <blockquote>Draw our docs chatbot: Next.js on Vercel searches Supabase pgvector and answers with Claude. Inngest syncs Notion every night.</blockquote>
    </td>
  </tr>
  <tr>
    <td colspan="2" valign="top">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="aws-dark.png">
        <img src="aws.png" alt="AWS 다이어그램: 사용자가 HTTPS로 CloudFront에 접속한다. CloudFront는 정적 경로를 S3에서 제공하고, API 경로는 VPC 퍼블릭 서브넷의 ALB로 보낸다. ALB는 프라이빗 서브넷의 Fargate로 전달하고, Fargate는 SQL로 RDS를 조회하며 ElastiCache를 캐시로 사용한다" width="100%">
      </picture>
      <p><b>AWS는 AWS 공식 아이콘으로</b></p>
      <blockquote>Draw our app on AWS: CloudFront in front of S3 and an ALB in a public subnet. Fargate, RDS and ElastiCache sit in a private subnet.</blockquote>
    </td>
  </tr>
  <tr>
    <td colspan="2" valign="top">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="gcp-dark.png">
        <img src="gcp.png" alt="Google Cloud 다이어그램: 사용자가 HTTPS로 Cloud Load Balancing에 접속한다. 로드 밸런서는 정적 경로를 Cloud Storage에서 제공하고, API 경로는 VPC의 한 리전에 있는 GKE로 보낸다. GKE는 SQL로 Cloud SQL을 조회하고 Memorystore를 캐시로 사용한다" width="100%">
      </picture>
      <p><b>Google Cloud는 Google 공식 아이콘으로</b></p>
      <blockquote>Draw our app on Google Cloud: a global load balancer in front of Cloud Storage and GKE. GKE, Cloud SQL and Memorystore run in one region of a VPC.</blockquote>
    </td>
  </tr>
  <tr>
    <td colspan="2" valign="top">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="azure-dark.png">
        <img src="azure.png" alt="Azure 다이어그램: 사용자가 HTTPS로 Azure Front Door에 접속한다. Front Door는 정적 경로를 Azure Blob Storage에서 제공하고, API 경로는 일본 동부 리전의 Azure App Service로 보낸다. App Service는 가상 네트워크의 프라이빗 엔드포인트를 거쳐 SQL로 Azure SQL Database를 조회하고, Azure Managed Redis를 캐시로 사용한다" width="100%">
      </picture>
      <p><b>Azure는 Microsoft 공식 아이콘으로</b></p>
      <blockquote>Draw our app on Azure: Front Door in front of Blob Storage and App Service. App Service reaches Azure SQL and Managed Redis through private endpoints in a VNet.</blockquote>
    </td>
  </tr>
</table>

## 라이트와 다크

모든 다이어그램은 라이트와 다크 두 테마로 렌더링됩니다. 타일은 흰색 그대로라서 로고가 원래 색으로 보이고, 그룹 라벨은 브랜드의 다크 테마용 로고로 바뀝니다.

<img src="light-dark.png" alt="모노레포 개발 도구 다이어그램을 대각선으로 나눈 이미지. 왼쪽 위는 라이트 테마, 오른쪽 아래는 다크 테마" width="100%">

## 아티팩트로 공유하기

다이어그램은 폰트와 로고를 인라인으로 담은 HTML 파일 하나라서, 네트워크 없이도 어디서나 표시됩니다. Claude 아티팩트로 게시해 링크를 공유하거나, 저장소나 위키에 그대로 넣을 수 있습니다. PNG와 React 컴포넌트도 같은 파일에서 렌더링합니다.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="html-page-dark.png">
  <img src="html-page.png" alt="문서 챗봇 다이어그램을 브라우저 창에서 HTML 페이지로 연 모습. 제목, 짧은 설명, 다이어그램, 범례, 푸터가 있다" width="100%">
</picture>

## 갤러리에 공유하기

다이어그램을 다 그리면, 에이전트가 공개 갤러리 <https://stacks.caru.moe>에 올릴지 한 번 묻습니다. 공개될 내용(라이트·다크 PNG, 영어 제목, 기술 스택, 표시 이름)을 먼저 보여 주고, 두 번 '예'라고 답해야만 게시합니다. 프롬프트는 전송되지 않습니다. GitHub 로그인은 선택 사항이며 다른 사람에게 표시되지 않습니다. 로그인해 두면 나중에 게시물을 삭제할 수 있습니다. 사이트 소스는 [`site/`](../site)에 있습니다.

## 특징

- **공식 로고를 자동으로 가져옵니다.** [svgl](https://svgl.app), [devicon](https://devicon.dev), [gilbarbara/logos](https://github.com/gilbarbara/logos) 순서로 찾거나, 브랜드 자체 저장소에서 가져옵니다. AWS, Google Cloud, Azure, Kubernetes, CNCF 프로젝트 아이콘은 각 벤더의 공식 패키지에서 가져옵니다: [AWS](https://aws.amazon.com/architecture/icons/), [Google Cloud](https://cloud.google.com/icons), [Azure](https://learn.microsoft.com/en-us/azure/architecture/icons/), [Kubernetes](https://github.com/kubernetes/community/tree/master/icons), [CNCF](https://github.com/cncf/artwork). Databricks는 아이콘 패키지가 없어서, Databricks 제품 아이콘에는 databricks.com에 있는 Databricks 자체 아트워크를 사용합니다. 아이콘은 커뮤니티의 [databricks-architecture-icons](https://github.com/oieduardorabelo/databricks-architecture-icons) 카탈로그로 찾습니다. 색을 바꾸거나 다시 그리지 않습니다.
- **화살표가 텍스트를 가로지르지 않습니다.** 선은 라벨을 피해서 그리며, 에이전트가 다이어그램을 렌더링해 확인한 뒤에 넘겨 줍니다.
- **원하는 형식으로 받을 수 있습니다.** 자체 완결형 HTML 파일(기본값), PNG, 의존성 없는 React 컴포넌트, 아티팩트 중에서 고를 수 있습니다.

Python 3.9 이상과 로고를 받기 위한 네트워크 연결이 필요합니다. PNG 내보내기에는 Playwright와 Chromium을 사용합니다.

## 스타 추이

<a href="https://www.star-history.com/?repos=caru-ini%2Fstack-diagram&type=date&legend=top-left">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=caru-ini/stack-diagram&type=date&theme=dark&legend=top-left">
    <img src="https://api.star-history.com/chart?repos=caru-ini/stack-diagram&type=date&legend=top-left" alt="caru-ini/stack-diagram의 GitHub 스타 수 추이 차트" width="100%">
  </picture>
</a>

## 라이선스와 상표

- 코드와 문서: MIT — `LICENSE` 참고.
- 포함된 폰트: SIL Open Font License 1.1 — `skills/stack-diagram/assets/fonts/` 참고.
- 로고는 스킬에 **포함되어 있지 않습니다**. 빌드할 때 다음에서 내려받습니다: [svgl](https://svgl.app), [devicon](https://devicon.dev) (MIT), [gilbarbara/logos](https://github.com/gilbarbara/logos) (CC0), [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/), [Google Cloud product icons](https://cloud.google.com/icons), [Azure icons](https://learn.microsoft.com/en-us/azure/architecture/icons/), [Kubernetes Community Icons](https://github.com/kubernetes/community/tree/master/icons) (Apache-2.0 / CC-BY-4.0), [CNCF Artwork](https://github.com/cncf/artwork) (Linux Foundation 상표 사용 가이드라인), [databricks-architecture-icons](https://github.com/oieduardorabelo/databricks-architecture-icons)를 통해 찾은 databricks.com의 Databricks 아트워크(이 카탈로그는 MIT 라이선스의 비공식 프로젝트로 Databricks의 보증을 받지 않았으며, 아트워크의 권리는 Databricks에 있습니다), [Lucide](https://lucide.dev) (ISC), 또는 브랜드 자체 사이트나 저장소. `docs/`의 예시 이미지에는 서드파티 로고가 들어 있습니다. 모든 브랜드 이름과 로고는 각 소유자의 상표이며, 다이어그램에 사용했다고 해서 해당 소유자의 보증을 뜻하지는 않습니다. 스크립트는 로고의 색을 바꾸거나 수정하지 않습니다. Microsoft는 아키텍처 다이어그램, 교육 자료, 문서에서 Azure 아이콘 사용을 허용합니다.
