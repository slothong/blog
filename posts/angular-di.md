---
title: "Angular의 DI는 어떻게 동작할까?"
date: 2025-06-20
tags:
  - Angular
---

앵귤러를 사용하면 아래와 같은 구문을 써서 서비스 객체를 가져와 사용한 적이 있을 것이다.

```ts
@Component({ selector: "app-my-component", templateUrl: "./my.html" })
class MyComponent {
  constructor(private readonly myService: MyService) {}

  doSomething() {
    this.myService.do();
  }
}
```

잘 알려져 있듯이 앵귤러는 서비스 객체를 대부분 싱글톤으로 관리한다. 앵귤러의 Dependency Injection(DI) 시스템은 컨테이너 안에 객체를 생성해두고 해당 객체가 필요한 컴포넌트나 서비스가 있다면 위와 같이 생성자에서 주입받아 사용할 수 있다. 편리한 문법이지만 `어떻게?` 라는 의문이 든다. 타입스크립트는 빌드시에 타입이 사라지고 자바스크립트만 남기 때문에 생성자의 인수 타입이 `MyService`라는건 절대 알 수 없기 때문이다.

```js
class MyComponent {
  constructor(myService) {} // 여기에 MyService의 객체를 어떻게 넣어주는 걸까?

  doSomething() {
    this.myService();
  }
}
```

이 마법의 비밀은 앵귤러의 AOT 컴파일러에 있다.

## 앵귤러 Ahead-of-time (AOT) 컴파일러

앵귤러 코드는 대부분 HTML 템플릿과 앵귤러 문법의 타입스크립트 코드로 구성된다. 앵귤러의 컴포넌트와 서비스 클래스는 `@Component` 또는 `@Injectable` 등의 데코레이터를 붙여 메타데이터를 설정한다.

```ts
@Injectable({
  providedIn: "root",
})
class MyService {
  do() {
    console.log("Done!");
  }
}
```

이러한 코드는 브라우저가 읽을 수 없기 때문에 앵귤러의 AOT 컴파일러는 빌드타임에 앵귤러 코드를 자바스크립트로 변환한다. 바로 이 때 의존성 주입과 관련된 생성자 코드들도 처리된다. AOT 컴파일러는 위에서 보았던 `MyComponent` 클래스의 코드를 아래와 같이 컴파일한다. 이는 `ng build --configuration=development`를 실행하면 생성되는 `dist` 폴더의 `main.js`에서 확인할 수 있다.

```js
var MyComponent = class _MyComponent {
  myService;
  constructor(myService) {
    this.myService = myService;
  }
  doSomething() {
    this.myService.do();
  }
  static ɵfac = function MyComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MyComponent)(ɵɵdirectiveInject(MyService));
  };
  static ɵcmp = /* @__PURE__ */ ɵɵdefineComponent({ type: _MyComponent, selectors: [["app-my-component"]], decls: 0, vars: 0, template: function MyComponent_Template(rf, ctx) {}, encapsulation: 2 });
};
```

언뜻 보면 복잡해보이지만 static 함수 두 개가 추가된 걸 알 수 있다. 하나는 `MyComponent` 객체를 생성하는 팩토리 함수이고 다른 하나는 메타데이터를 정의하는 함수이다. 팩토리 함수 `ɵfac`는 `_MyComponent` 객체의 생성자에 `ɵɵdirectiveInject(MyService)`를 넘겨준다. `ɵɵdirectiveInject` 함수가 컨테이너로부터 `MyService` 객체를 가져온다는 것을 유추할 수 있다.

## `inject` 함수를 사용한 DI

위에서는 생성자에 의존성을 주입하는 예제를 살펴봤지만 모던 앵귤러에서는 [`inject` 함수](https://angular.dev/reference/migrations/inject-function)를 사용해 의존성을 주입하는 것을 권장하고 있다.

```ts
@Component({ selector: "app-my-component", templateUrl: "./my.html" })
class MyComponent {
  private readonly myService = inject(MyService);

  doSomething() {
    this.myService.do();
  }
}
```

위 코드는 아래와 같이 컴파일된다.

```js
var MyComponent = class _MyComponent {
  myService = inject(MyService);
  doSomething() {
    this.myService.do();
  }
  static ɵfac = function MyComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MyComponent)();
  };
  static ɵcmp = /* @__PURE__ */ ɵɵdefineComponent({ type: _MyComponent, selectors: [["app-my-component"]], decls: 0, vars: 0, template: function MyComponent_Template(rf, ctx) {}, encapsulation: 2 });
};
```

컴파일러는 더 이상 마법을 부리지 않고, 컴파일된 코드도 그대로 `inject` 함수를 사용하고 있다.

사실 `inject` 함수를 권장하는 이유는 ES2022에서 class field 문법이 도입되었기 때문이다. ES2022 이전까지는 class field가 문법적으로 허용되지 않았기 때문에 아래와 같이 생성자 안에서 property를 선언하고 초기화해야 했었다.

```ts
class Person {
  constructor(name) {
    this.name = name; // 생성자에서 필드를 정의
  }
}
```

그러나 ES2022에서 class field가 도입되고 아래와 같은 코드가 가능해졌다.

```ts
class Person {
  name = "Unknown";
}
```

문제는 앵귤러 코드는 타입스크립트로 작성된다는 것이고, 타입스크립트의 코드가 ECMAScript로 변환될 때 이 클래스 필드 문법으로 인해 동작이 달라진다는 점이다. 예를 들어,

```ts
@Component({
  /* ... */
})
export class UserProfile {
  private user = this.userData.getCurrent();

  constructor(private userData: UserData) {}
}
```

이 코드가 컴파일된 결과는 두 가지 가능성이 있다. 하나는 클래스 필드를 사용하지 않는 버전이고,

```js
export class UserProfile {
  constructor(userData) {
    this.userData = userData;
    this.user = this.userData.getCurrent();
  }
}
```

다른 하나는 클래스 필드를 사용하는 ES2022 이후 버전의 코드이다.

```js
export class UserProfile {
  userData;
  user = this.userData.getCurrent(); // Error! userData is not yet initialized!
  constructor(userData) {
    this.userData = userData;
  }
}
```

두 번째의 경우 userData가 초기화되기 전에 참조되었기 때문에 에러가 발생한다. 이처럼 클래스 필드의 적용 여부에 따라 동작이 달라지는 코드가 만들어지기 때문에 타입스크립트는 [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig/#useDefineForClassFields) 옵션을 제공해 사용자가 클래스필드 사용 여부를 결정할 수 있게 했다. 만약 이 옵션을 `false`로 설정하면 클래스 필드를 사용하지 않기 때문에 이전과 같은 결과가 나오겠지만 `true`로 설정한다면 생성자로 injectable을 주입받는 코드는 예상치 못한 동작을 하게 될 것이다. 따라서 생성자를 사용하지 않고 클래스 필드의 선언과 동시에 초기화시키는 `inject()` 함수를 사용하면 `useDefineForClassFields` 옵션 값과 관계 없이 의도한대로 동작하는 코드가 컴파일되는 것을 보장할 수 있다.

## Injection Context

`inject()` 함수를 어디에서나 호출할 수 있는 것은 아니다. `inject()`를 호출하면 해당 객체를 주입해줄 injector를 찾게 되는데, injector에 접근할 수 있는 범위를 injection context라고 한다. 공식문서에 따르면 유효한 injection context는 아래와 같다.

- DI 시스템에 의해 인스턴스화되는 클래스(예: @Injectable 또는 @Component)의 생성자(constructor) 내부에서
- 이러한 클래스의 필드 초기화 구문에서
- Provider나 @Injectable에 지정된 useFactory 팩토리 함수 내부에서
- InjectionToken에 지정된 팩토리 함수 내부에서
- 주입 컨텍스트(injection context) 내에서 실행되는 스택 프레임 안에서

실제로 앵귤러가 injector를 어떻게 설정하는지는 크롬 DevTools에서 확인할 수 있다. 우선 앵귤러 내부 코드까지 디버거가 감지하도록 하기 위해 Settings > Ignore List > Ignore Listing 에서 Enable Ignore Listing 체크박스를 해제해준다. 그 다음 앵귤러 프로젝트의 `angular.json`에서 architect > build > configurations > development > sourceMap 속성을 `false`로 설정한 후 ng serve로 개발 서버를 띄운다. 그러면 DevTools에서 앵귤러 컴포넌트의 factory 함수에 breakpoint를 걸 수 있게 된다.

```js
var HeaderComponent = class _HeaderComponent {
  ...
  static \u0275fac = function HeaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HeaderComponent)(i026.\u0275\u0275directiveInject(HlmDialogService)); // 이 라인에 breakpoint를 건다.
  };
  ...
```

그리고 페이지를 새로고침하면 이 factory 함수가 호출되는 call stack을 확인할 수 있다. `getNodeInjectable()`함수 안에서 factory 함수가 호출되었다는 것을 알 수 있는데 그 전에 `setInjectImplementation(factory.injectImpl)`로 inject의 구현을 설정하고 있다.

```js
function getNodeInjectable(lView, tView, index, tNode) {
    ...
    const previousInjectImplementation = factory.injectImpl
        ? setInjectImplementation(factory.injectImpl)
        : null; // injectImplementation 설정
    const success = enterDI(lView, tNode, 0 /* InternalInjectFlags.Default */);
    ngDevMode &&
        assertEqual(success, true, "Because flags do not contain `SkipSelf' we expect this to always succeed.");
    try {
        ngDevMode && emitInjectorToCreateInstanceEvent(token);
        value = lView[index] = factory.factory(undefined, tData, lView, tNode); // 팩토리 함수 호출
        ngDevMode && emitInstanceCreatedByInjectorEvent(value);
  ...
}
```

이렇게 설정된 injectImplementation은 컴포넌트의 생성자 또는 필드 초기화에서 `inject()` 함수가 호출되었을 때 참조하게 된다. 아래는 `inject()`가 호출하는 `ɵɵinject()`함수의 정의이다.

```ts
export function ɵɵinject<T>(token: ProviderToken<T> | HostAttributeToken, flags = InternalInjectFlags.Default): T | null {
  return (getInjectImplementation() || injectInjectorOnly)(resolveForwardRef(token as Type<T>), flags);
}
```

따라서 `injectImplementation`이나 injector가 설정되지 않은 시점에서 `inject()`를 호출하게 되면 에러를 발생시키게 된다.
