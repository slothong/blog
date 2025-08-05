---
title: "정적 사이트에서 폰트 최적화하기"
date: 2025-08-05
tags:
  - Font
---

## 문제

블로그에 들어올 때마다 폰트 로드가 지연되는 것이 눈에 거슬렸다. 이로 인해 폰트가 변경되는 것이 눈에 보이는 것 뿐만 아니라 레이아웃이 살짝 밀리는 것처럼 보인다.

<img src="assets/font-example.gif" width="100%" />

이를 개선하고자 폰트 최적화에 대해 조사하게 되었다. 폰트를 최적화하는 방법은 크게 아래 두 가지 방향이 있다.

- 폰트 파일의 용량을 줄이기
- 로드 시점을 빠르게 하기

이 블로그에 두 가지를 모두 적용하였고 폰트 로드 속도가 크게 개선된 것을 확인했다.

## 폰트 파일의 용량 줄이기

이 블로그는 pretendard 폰트를 사용하고 있다. CSS 파일에서는 cdn에서 폰트 파일을 아래와 같이 가져오고 있었다.

```css
// styles.css
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");
```

이 폰트가 페이지에 적용되기까지 어떻게 로드되는지는 네트워크 탭에서 확인할 수 있다.

<img src="assets/font-load.png" width="100%" >

페이지에 접속하면 우선 `styles.css` 파일을 로드하고 해당 파일에서 필요한 파일들을 가져오기 시작한다. `styles.css` 파일에서 `pretendard.min.css` 파일을 import 하고 있기 때문에 이 파일을 로드한다. `pretendard.min.css` 파일에는 font family와 그 폰트 파일의 url이 정의되어 있고 해당 폰트 파일을 다시 로드한다. 폰트 파일이 로드되면 최종적으로 페이지에 폰트가 적용된다.

**폰트 파일 로드 순서**

> styles.css -> pretendard.min.css -> font files

### 폰트 서브셋

폰트 서브셋은 폰트 파일을 작은 파일 여러 개로 나눈 것이다. 페이지에서 필요한 글자(glyph) 수는 많지 않기 때문에 모든 글자가 들어 있는 폰트 파일을 로드하는 것은 비효율적이다. 서브셋을 사용하면 페이지에서 필요한 파일들만 로드해오기 때문에 더 효율적으로 폰트 파일을 가져올 수 있다. Pretendard에서도 폰트 서브셋을 지원한다.

```css
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css");
```

폰트 서브셋을 적용하면 아래와 같이 작은 파일 여러개를 불러오는 것을 알 수 있다.

<img src="assets/font-subset-example.png" width="100%">

하지만 이 역시 원격 `css` 파일을 로드하는 것이 선행되어야 해서인지 크게 개선되지는 않았다. 그래서 cdn에서 폰트를 불러오는 대신 커스텀 폰트 파일을 호스팅해보기로 했다.

## 커스텀 서브셋

[fonttools](https://github.com/fonttools/fonttools)는 폰트 파일을 다루기 위한 커맨드라인 툴이다. 파이썬으로 작성되었기 때문에 `pip`로 설치할 수 있다.

```sh
$ pip install fonttools
```

fonttools를 설치하면 pyftsubset 명령어를 사용할 수 있는데, 이는 입력된 폰트 파일의 subset 파일을 제작해준다.

```sh
$ pyftsubset Pretendard.ttf \
  --text-file=glyphs.txt \
  --flavor=woff2 \
  --output-file="./pretendard-subset.woff2"
```

`pyftsubset`은 `--text-file=glyphs.txt`로 입력받은 파일에 존재하는 글자들만을 사용해 subset을 만들어준다. 이 기능은 나의 현재 상황에 최적화되어있다. 왜냐하면 이 블로그는 정적 사이트이고 어떤 글자가 렌더링될지 빌드 시점에 알 수 있기 때문이다.

아래와 같이 명령어를 작성하면 빌드 폴더 안에 있는 모든 html 파일을 파싱해서 글자들을 모을 수 있다.

```sh
find ./dist -name "*.html" -exec cat {} \; | \
  sed 's/<[^>]*>//g' | \
  tr -d '\n' | \
  tr -cd '[:print:]' | \
  fold -w1 | \
  sort | \
  uniq | \
  tr -d '\n' > all-text.txt
```

생성된 txt 파일을 `pyftsubset`에 넣고 서브셋을 생성했더니 무려 22KB 사이즈의 폰트 파일이 생성됐다.

## 로드 시점 앞당기기

폰트 파일의 용량을 아무리 줄여도 지연 로딩을 피할 수는 없었다. 그 이유는 css 파일이 로드된 후에 폰트를 로드한다는 근본적인 로드 과정 때문이다. 이를 해결하기 위해서는 `link` 태그의 [preload](https://developer.mozilla.org/ko/docs/Web/HTML/Reference/Attributes/rel/preload) 속성을 사용할 수 있다. 이 속성을 사용하면 페이지에서 즉시 필요로 하는 리소스를 명시하여 브라우저의 렌더링 시작하기 전에 리소스를 로드하게 해준다. `index.html`에 아래와 같이 작성하면 된다.

```html
<link rel="preload" href="/assets/fonts/pretendard-custom.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
```

이 간단한 태그 한 줄을 추가하고나니 폰트 로드가 지연되는 현상이 완전히 없어진 것을 확인했다.

## 자동화

코드가 푸시되면 페이지를 빌드하고 subset 폰트를 생성하기 위해 github workflow를 아래와 같이 작성했다.

```yml
name: Generate Subset Font and Commit

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build-and-subset-font:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Install fonttools (for pyftsubset)
        run: |
          pip3 install fonttools
          pip3 install brotli

      - name: Extract text from HTML
        run: |
          find ./dist -name "*.html" -exec cat {} \; | \
            sed 's/<[^>]*>//g' | \
            tr -d '\n' | \
            tr -cd '[:print:]' | \
            fold -w1 | \
            sort | \
            uniq | \
            tr -d '\n' > all-text.txt

      - name: Download PretendardVariable.ttf
        run: |
          curl -L -o PretendardVariable.ttf https://github.com/orioncactus/pretendard/raw/main/packages/pretendard/dist/public/variable/PretendardVariable.ttf

      - name: Generate subset font
        run: |
          pyftsubset PretendardVariable.ttf \
            --text-file=all-text.txt \
            --flavor=woff2 \
            --output-file=public/assets/fonts/pretendard-custom.woff2

      - name: Commit subset font
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

          git add public/assets/fonts/pretendard-custom.woff2
          git commit -m "chore: generate subset font"
          git push
```

## 결론

폰트 최적화를 위해 폰트 서브셋을 사용해 폰트 파일의 용량을 줄이고 로드 시점을 렌더링 이전으로 앞당기는 방법을 알아보았다. 사실 유저에게 가장 민감한 것은 초기에 렌더링된 폰트와 나중에 로드된 폰트가 달라서 약간의 깜빡임과 같은 현상이 생기는 것인데, 이건 preload만 적용해도 해소될 것 같다. 그래도 폰트 서브셋의 개념과 fonttools의 간단한 사용법에 대해 학습할 수 있어서 좋은 경험이 된 것 같다.
