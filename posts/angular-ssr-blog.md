---
title: "Angular로 정적 사이트 블로그 배포하기"
date: 2025-06-12
tags:
  - Angular
  - Blog
  - SSR
---

"프론트엔드 = 리액트"가 통용되는 지금 이 시대에 앵귤러를 쓰는 회사에 입사해버렸다. 리액트에 익숙해져 있던 나에게는 앵귤러의 사용법이 여러모로 불편한 점이 많았지만 이왕 쓰게 된 거 깊이 있게 공부해보기로 했다. 이 참에 나의 오랜 염원이었던 개인 블로그 만들기도 실행에 옮겼다.

## Angular SSR

블로그가 검색엔진에 노출되기 위해서는 SSR이 필요하다. 앵귤러는 프레임워크이기 때문에 [SSR 기능](https://angular.dev/guide/ssr)을 자체 지원한다. 앵귤러는 서버 라우트를 설정하는 파일(`app.routes.server.ts`)에서 아래와 같이 렌더 모드를 설정할 수 있다.

```ts
// app.routes.server.ts
import { RenderMode, ServerRoute } from "@angular/ssr";
export const serverRoutes: ServerRoute[] = [
  {
    path: "", // This renders the "/" route on the client (CSR)
    renderMode: RenderMode.Client,
  },
  {
    path: "about", // This page is static, so we prerender it (SSG)
    renderMode: RenderMode.Prerender,
  },
  {
    path: "profile", // This page requires user-specific data, so we use SSR
    renderMode: RenderMode.Server,
  },
  {
    path: "**", // All other routes will be rendered on the server (SSR)
    renderMode: RenderMode.Server,
  },
];
```

`RenderMode.Client`, `RenderMode.Prerender`, `RenderMode.Server`는 각각 Next.js에서 말하는 client side render(CSR), static site generation (SSG), server side rendering(SSR)에 해당한다. `Prerender`모드를 선택한 경우 빌드타임에 페이지가 렌더링되기 때문에 생성하고자 하는 페이지의 경로를 사전에 알고 있어야 한다. 따라서 `getPrerenderParams()`함수로 접근 가능한 경로를 알려주어야 한다.

```ts
// app.routes.server.ts
import { RenderMode, ServerRoute } from "@angular/ssr";
export const serverRoutes: ServerRoute[] = [
  {
    path: "post/:id",
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(PostService);
      const ids = await dataService.getIds(); // Assuming this returns ['1', '2', '3']
      return ids.map((id) => ({ id })); // Generates paths like: /post/1, /post/2, /post/3
    },
  },
  {
    path: "post/:id/**",
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [
        { id: "1", "**": "foo/3" },
        { id: "2", "**": "bar/4" },
      ]; // Generates paths like: /post/1/foo/3, /post/2/bar/4
    },
  },
];
```

Next.js에서는 서버 사이드에서 데이터를 가져오는 함수를 지정할 수 있었는데 앵귤러에서는 그런 부분이 없는 것 같다. 그러면 정적으로 생성된 페이지라도 클라이언트에서 data fetch가 일어나는 것 아닌지 의문이 든다. 문서에 명확히 기재되어 있는 것은 없는 것 같아서 좀 더 연구가 필요할 것 같다.

## Vercel에 배포

Vercel을 사용하면 깃헙 레포지토리에 올린 코드를 매우 간편하게 배포할 수 있다. Vercel에서 깃헙 레포지토리를 import하고 버튼 몇 번 누르면 배포가 완료된다. 앵귤러 배포도 지원하고 있다. 다만 `RenderMode.Server`로 배포했을 때 클라이언트에서 api 호출이 실패하고 있어서 페이지가 잘 뜨지 않았다. 우선 `RenderMode.Prerender` 모드로 배포하기로 했다. Prerender모드에서는 `?page=1`과 같은 query parameter를 사용할 수 없기 때문에 `/posts/page/1`과 같은 계층적 url을 사용해야 한다.
