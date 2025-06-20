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

<!-- ## `inject` 함수의 동작

우선 앞서 봤던 `ɵɵdirectiveInject` 함수는 어떻게 생겼는지 살펴보자.

```ts
export function ɵɵdirectiveInject<T>(token: ProviderToken<T>, flags = InternalInjectFlags.Default): T | null {
  const lView = getLView();
  // Fall back to inject() if view hasn't been created. This situation can happen in tests
  // if inject utilities are used before bootstrapping.
  if (lView === null) {
    // Verify that we will not get into infinite loop.
    ngDevMode && assertInjectImplementationNotEqual(ɵɵdirectiveInject);
    return ɵɵinject(token, flags);
  }
  const tNode = getCurrentTNode();
  const value = getOrCreateInjectable<T>(tNode as TDirectiveHostNode, lView, resolveForwardRef(token), flags);
  ngDevMode && emitInjectEvent(token as Type<unknown>, value, flags);
  return value;
}
```
 -->
