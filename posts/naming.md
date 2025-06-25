---
title: "좋은 이름 == 좋은 구조"
date: 2025-06-24
tags:
  - Typescript
---

## Angular의 제거된 suffix

앵귤러 팀은 버전 20의 공식 문서에서 더 이상 `.component.ts`나 `.service.ts` 같은 [suffix를 사용하지 않는다](https://github.com/angular/angular/discussions/59522). 또한 CLI로 컴포넌트, 서비스, 디렉티브 등을 생성할 때 suffix를 붙이지 않도록 수정됐다. 즉 기존에 `user.component.ts`처럼 작성했던 파일은 `user.ts`로 작성해야 한다. [논란](https://www.reddit.com/r/Angular2/comments/1l9iq1s/angular_20_removing_suffixes_from_components/)이 많은 업데이트지만 왜 이런 방향으로 업데이트하게 되었는지 생각 해 볼만하다.

앞서 말했듯 기존 앵귤러의 파일명에는 해당 파일이 어떤 종류인지를 나타내기 위해 `component.ts`, `.service.ts`와 같은 suffix를 붙이는 것이 관례였다. 유저와 관련된 서비스를 `user.service.ts`로 이름짓는 것은 아주 자연스러워 보인다. 이제 `user.service.ts`에 정의되는 `UserService` 안에 어떤 로직이 들어갈지 생각해보자. 프로젝트 초기에 이 서비스를 추가했을 때는 아마도 `getUser()`, `updateUser()`와 같은 API 관련 함수들이 들어갈 것이다. 인증 로직이 추가되고 로그인, 로그아웃 관련 기능도 추가될 수 있다. 그 후 유저의 역할(role)이라는 개념이 추가되면서 역할 목록을 조회하고 권한을 확인하는 함수가 추가된다. 알림 설정, dark/light 모드 설정 등 유저의 개인 설정 기능이 추가되면서 해당 로직들도 들어오게 될 것이다. 이런 식으로 `UserService`는 점점 커지게 되고 몇 천줄짜리 클래스가 되는 경우도 다반사다. 이를 방지하기 위해서는 `user-role.ts`, `user-notification.ts`, `user-setting.ts`과 같이 이름에 그 역할이 더 잘 드러나도록 지어야 한다. 물론 suffix를 유지하더라도 항상 네이밍에 신경을 쓴다면 `user-role.service.ts`와 같이 적절히 역할을 나눌 수 있을 것이다. 하지만 촉박한 시간에 코드를 작성해야 하는 경우에 사소해보이는 것에 능동적으로 노력을 기울이기란 쉽지 않다.

## Typescript의 `I`-prefix

이와 비슷한 주제(이름을 잘 짓기)는 여러 곳에서 논의되어 왔다. Stackoverflow의 한 게시물에서는 타입스크립트에 인터페이스에 `I`-prefix를 붙이는 것에 대한 [논의](https://stackoverflow.com/questions/31876947/confused-about-the-interface-and-class-coding-guidelines-for-typescript)가 있었다. 채택된 답변은 4가지 이유를 들어 `I`-prefix에 반대하는 의견을 제시했다.

1. Hungarian notation는 없어지는 추세이다. 현대적인 에디터에서 장점이 거의 없다.
2. `I`-prefix는 캡슐화를 위반한다. 해당 타입을 사용할 때 interface인지 class인지 알아야 한다면 잘못된 설계일 가능성이 높다.
3. 나쁜 이름을 짓는 것을 막을 수 있다. 클래스에서 interface를 추출해야 할 때 단순히 `I`를 붙여서 인터페이스 이름을 지을 수 있게 된다. 이를 금지하면 개발자는 더 적절한 이름을 짓기 위해 더 생각하게 될 것이다. 예를 들어 `Car` 클래스의 인터페이스가 `ICar`가 되어서는 안된다. `SportsCar`, `SuvCar`, `HollowCar` 등 구체적인 이름을 지어아 한다.

4. 잘못된 추상화를 예방할 수 있다. 단순히 인터페이스를 분리하는 것이 추상화가 되지는 않는다. 오히려 잘못된 추상화는 유지보수를 어렵게 만들 수 있다.

## Private 필드의 명명법

[구글 타입스크립트 스타일 가이드](https://google.github.io/styleguide/tsguide.html#naming-style)에서는 private 필드의 이름 앞에 `_`를 붙이는 것을 금지하고 있다. 아래와 같이 `_`-prefix를 붙여서 변수가 private임을 나타내는 코드는 일반적으로 접하게 되는 코드이다.

```ts
class SomeClass {
  private _someVariable;

  get someVariable() {
    return this._someVariable;
  }
}
```

아래와 같은 코드도 많이 보았을 것이다.

```ts
class SomeClass {
  private _someVariable;

  get someVariable() {
    return this._someVariable;
  }

  set someVariable(newValue) {
    this._someVariable = newValue;
  }
}
```

조금 생각해보면 여기서 사용된 getter와 setter가 전혀 의미 없다는 것을 알 수 있다. Getter와 setter을 없애고 `_someVariable`을 public으로 변경해도 완벽히 동일한 동작을 하게 된다. `_`-prefix를 금지하면 무심코 의미 없는 getter와 setter를 사용하는 것을 방지할 수 있다.
