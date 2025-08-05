---
title: "Angular에서 유연한 컴포넌트 구현하기"
date: 2025-08-03
tags:
  - Angular
---

UI 컴포넌트를 작성할 때 중요하게 고려해야 할 것 중 하나는 컴포넌트의 유연성이다. 특히 디자인 시스템이나 여러 곳에서 공유되는 코어 UI 라이브러리의 컴포넌트를 작성해야 한다면 해당 컴포넌트를 사용하는 use case에 대해 충분한 고려가 필요하다. 예를 들어 버튼 컴포넌트를 작성하는 경우를 생각해보자. 버튼 안에는 text가 들어가야 한다. 따라서 다음과 같이 구현할 수 있다.

```ts
@Component({
  selector: "button[ui-button]",
  template: ` {{ text() }} `,
})
export class Button {
  readonly text = input<string>();
}
```

간단한 구현이지만 여기에는 잠재적인 문제가 있다. Text를 `string` 타입으로 받았기 때문에 한 가지 use case만 커버하고 있다. 만약 text가 ellipsis 처리 되어야 한다거나 font weight를 다르게 해야 하는 경우, 또는 가운데에 아이콘이 들어가야 하는 경우 등은 이 구조로 커버하기 어렵다. 만약 구조를 유지하면서 위 요구사항을 구현하려고 하면 아래와 같이 순식간에 코드가 복잡해진다.

```ts
@Component({
  selector: 'button[ui-button]',
  template: `
    {{ text() }}
  `
  styles: [`
    // 복잡한 css...
  `]
})
export class Button {
  readonly text = input<string>();
  readonly isBold = input<boolean>();
  readonly truncate = input<boolean>();
}
```

이 경우를 해결하는 방법은 구현을 바깥에 넘기는 것이다. React에서는 간단히 ReactNode 타입의 데이터를 바깥에서 받을 수 있다.

```ts
const Button = ({ children }: { children: React.ReactNode }) => {
  return <button>{children}</button>;
};
```

Angular도 비슷한 방법으로 [Content Projection](https://angular.dev/guide/components/content-projection)이라는 기능을 제공하고 있다.

```ts
@Component({
  selector: 'button[ui-button]'
  template: '<ng-content></ng-content>'
})
export class Button {}

@Component({
  selector: 'app-main'
  imports: [Button],
  template: '<button ui-button>이 곳을 누르세요</button>'
})
export class Main {}
```

이처럼 간단한 경우는 content projection으로 해결할 수 있다. 하지만 조금 더 복잡한 경우는 어떨까? 다음과 같은 Card 컴포넌트를 생각해 볼 수 있다.

<img src="assets/example-component.png" width="100%"  />

이 컴포넌트는 header와 body로 구성되고 header와 body 사이에는 divider를 표시해야 한다. 그리고 header가 존재하지 않을 때는 body만 표시되며 이 경우에는 divider도 사라진다. Content projection으로 이 컴포넌트를 아래와 같이 구현할 수 있다.

```ts
@Component({
  selector: "ui-card",
  template: `
    <div class="header">
      <ng-content select="ui-card-header"></ng-content>
      <ui-divider />
    </div>
    <ng-content select="ui-card-content"></ng-content>
  `,
  styles: [
    `
      .header {
        &:not(:has(ui-card-header)) {
          display: none;
        }
      }
    `,
  ],
})
export class Card {}
```

위 구현에서 header가 존재하지 않는 것을 판별하기 위해 CSS selector를 사용했다. CSS 트릭을 쓰는 것 같아 약간 거부감이 들 수 있지만 가장 간단하게 해결할 수 있다. 조금 더 상황이 복잡한 경우를 생각해보자.

<img src="assets/example-component2.png" width="100%"  />

리스트 컴포넌트 안에 list-item을 여러 개 표시해야 하고 각 item 사이에는 divider가 있어야 한다. 가장 마지막 item 다음에는 divider가 표시되지 않아야 한다. 이 경우에는 content projection으로 해결할 수 없다. Angular에서는 [template의 참조를 사용](https://angular.dev/guide/directives/structural-directives)해서 동적으로 뷰를 제어하는 기능을 제공한다.

```ts
@Directive({
  selector: "[uiListItem]",
})
export class ListItem {
  readonly templateRef = inject(TemplateRef);
}

@Component({
  selector: "ui-list",
  imports: [CommonModule],
  template: `
    @for(item of items(); track item) {
    <ng-template *ngTemplateOutlet="item.templateRef"></ng-template>
    @if (!$last) {
    <ui-divider />
    } }
  `,
})
export class List {
  readonly items = contentChildren(ListItem);
}

@Component({
  selector: 'app-main'
  imports: [List, ListItem],
  template: `
  <ui-list>
    <div *uiListItem>Item 1</div>
    <div *uiListItem>Item 2</div>
  </ui-list>
  `
})
export class Main {}
```

이처럼 templateRef를 사용하면 컴포넌트의 뷰를 완전히 제어할 수 있다. 여기에서 uiListItem은 structural directive이기 때문에 사용할 때 `*`를 붙여주어야 한다. 이를 숨기려면 아래와 같이 구현하는 것도 가능하다.

```ts
@Component({
  selector: "ui-list-item",
  template: `
  <ng-template #template>
    <ng-content></ng-content>
  </ng-template>
  `
})
export class ListItem {
  readonly templateRef = inject(TemplateRef);
}

@Component({
  selector: "ui-list",
  imports: [CommonModule],
  template: `
    @for(item of items(); track item) {
    <ng-template *ngTemplateOutlet="item.templateRef"></ng-template>
    @if (!$last) {
    <ui-divider />
    } }
  `,
})
export class List {
  readonly items = contentChildren(ListItem);
}

@Component({
  selector: 'app-main'
  imports: [List, ListItem],
  template: `
  <ui-list>
    <ui-list-item>Item 1</ui-list-item>
    <ui-list-item>Item 2</ui-list-item>
  </ui-list>
  `
})
export class Main {}
```

이 방법을 쓰면 structural directive라는 것을 숨기고 더 깔끔해보이는 코드를 작성할 수 있다. 하지만 주의할 점은 `ui-list-item`라는 요소가 직점 렌더링 되는 것이 아니기 때문에 이 요소에 스타일을 줄 수 없다는 것이다. 예를 들어,

```html
<ui-list>
  <ui-list-item [style.background]="'blue'">Item 1</ui-list-item>
  <ui-list-item>Item 2</ui-list-item>
</ui-list>
```

와 같은 코드에서 item1에 작성한 style은 template 내부까지 전달되지 않기 때문에 무시된다.

### 결론

Angular에서 동적으로 뷰를 제어하기 위해 content projection 또는 structural directive를 사용할 수 있다. Structural directive를 사용할 때는 해당 요소가 직접 렌더링되는 것이 아니라 template으로 전달되는 것에 유의해야 한다. 이러한 방식을 잘 이해하고 컴포넌트를 작성하면 유지보수 하기 쉽고 유연한 컴포넌트를 작성할 수 있을 것이다. 다만 React에서는 ReactNode라는 타입으로 통일성 있게 관리할 수 있는 것에 비해 Angular에서는 뷰의 주입 방법이 여러가지로 나뉘고, template의 경우에 렌더링 되는 방식에 대해 프로그래머가 주의를 기울여야 한다는 것은 단점으로 느껴진다.
