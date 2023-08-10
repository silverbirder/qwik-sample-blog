---
title: Webフロントエンドにおける網羅的テストパターンガイド
published: true
date: 2023-04-28
description: こんにちは、テストが好きなsilverbirderと申します。Webフロントエンドのテストは実施していますか？ユニットテストやビジュアルリグレッションテストは広く知られていると思います。しかし、パフォーマンステストのためのテストコードはありますか？また、カオスエンジニアリングテストやアクセシビリティテストはありますか？
tags: ["Frontend", "Test"]
---

こんにちは、テストが好きな silverbirder と申します。Web フロントエンドのテストは実施していますか？ユニットテストやビジュアルリグレッションテストは広く知られていると思います。しかし、パフォーマンステストのためのテストコードはありますか？また、カオスエンジニアリングテストやアクセシビリティテストはありますか？

今回、私は Web フロントエンドにおける網羅的なテストパターンを調査し、その結果をここで紹介したいと思います。これらを理解することで、読者の皆さんが適切なテスト戦略を策定する際の参考になれば幸いです。

## 前提

今回、テスト対象として取り上げる題材は、[TodoMVC](https://todomvc.com/)という TODO アプリです。フレームワークとして React を使用しますが、紹介するテストパターンはフレームワークに依存しないものです。ただし、使用するライブラリは React に関連しているため、その点についてはご了承ください。また、テストライブラリとして、Jest を使用します。

参考となるコードは次のリポジトリに用意していますので、ぜひご参照ください。

https://github.com/silverbirder/react-todoMVC/

また、動作するアプリケーションを Vercel で公開しています。こちらも参考にしてください。

https://silverbirder-react-todo-mvc.vercel.app

コンポーネントの構造は以下の通りです。

![component_structure](https://storage.googleapis.com/zenn-user-upload/8fcf377eaa36-20230423.png)

- App.tsx
  - TodoInput.tsx
  - TodoList.tsx
    - TodoItem.tsx
  - TodoContext.ts

## 概要

まず、これから紹介するテストパターンの全体図を紹介します。

![overview](https://storage.googleapis.com/zenn-user-upload/5182e7bd04a5-20230425.png)

テストパターンは、大きく以下の 3 つに分類されます。

- 機能テスト
- 非機能テスト
- UI/UX テスト

それぞれの内容について、これから説明していきます。

## テストパターン

### 機能テスト(Functional)

機能とは、システムやソフトウェア、製品、またはサービスが提供する特定の目的を達成するために実行されるタスクや操作を指します。Web フロントエンドにおける機能は、Web アプリケーションのユーザーインターフェース（UI）部分で実現されるタスクや操作を指します。これには画面表示や操作、ページ遷移や更新などが含まれます。

機能テストには、テストトロフィーやテストピラミッドが有名です。一般的に次の 3 つのカテゴリがあります。

- ユニットテスト
  - 関数やコンポーネントなど、単体レベルのテスト
- インテグレーションテスト
  - 複数の関数やコンポーネントが正しく連携するかのテスト
- E2E(システム)テスト
  - フロントエンドからバックエンドまで一気通貫したテスト

ユニットテストとインテグレーションテストは、フロントエンドだけで完結し速度重視のテストです。一方、E2E テストはバックエンドと連携し、速度は遅く重たいものの、より本番環境に近い状態でテストを行います。

ユニットテストは一つの機能やコンポーネントに対して行うのに対し、インテグレーションテストではユーザーにとって意味のある単位で結合したコンポーネントに対してテストを行うことがお勧めです。画面を構成するページレベルのコンポーネントが適切でしょう。

#### ユニットテスト

まず、よく知られているユニットテストから始めましょう。TodoItem コンポーネントのテストを行ってみましょう。

TodoItem コンポーネントは以下の通りです。

```typescript
// src/components/TodoItem/TodoItem.tsx

import React, { useContext } from "react";
import type { Todo } from "../../types";
import { TodoContext } from "../context";

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { toggle, deleteTodo } = useContext(TodoContext);
  return (
    <li className={todo.completed ? "completed" : ""}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggle(todo.id)}
        />
        <label data-testid="todo-title">{todo.title}</label>
        <button className="destroy" onClick={() => deleteTodo(todo.id)} />
      </div>
    </li>
  );
};
```

このコンポーネントに対するテストコードは、以下のようになります。

```typescript
// src/components/TodoItem/TodoItem.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import { TodoItem } from "./TodoItem";
import { TodoContext } from "../context";
import userEvent from "@testing-library/user-event";

const mockToggle = jest.fn();
const mockDeleteTodo = jest.fn();
const mockAdd = jest.fn();

describe("TodoItem", () => {
  // Arrange
  const mockTodo = {
    id: "1",
    title: "Test Todo",
    completed: false,
  };

  it("renders todo title", () => {
    // Act
    render(
      <TodoContext.Provider
        value={{
          toggle: mockToggle,
          deleteTodo: mockDeleteTodo,
          addTodo: mockAdd,
        }}
      >
        <TodoItem todo={mockTodo} />
      </TodoContext.Provider>
    );

    // Assert
    expect(screen.getByText(mockTodo.title)).toBeInTheDocument();
  });

  it("toggles todo completion", () => {
    // Arrange
    render(
      <TodoContext.Provider
        value={{
          toggle: mockToggle,
          deleteTodo: mockDeleteTodo,
          addTodo: mockAdd,
        }}
      >
        <TodoItem todo={mockTodo} />
      </TodoContext.Provider>
    );

    // Act
    userEvent.click(screen.getByRole("checkbox"));

    // Assert
    expect(mockToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it("deletes a todo", () => {
    // Arrange
    render(
      <TodoContext.Provider
        value={{
          toggle: mockToggle,
          deleteTodo: mockDeleteTodo,
          addTodo: mockAdd,
        }}
      >
        <TodoItem todo={mockTodo} />
      </TodoContext.Provider>
    );

    // Act
    userEvent.click(screen.getByRole("button"));

    // Assert
    expect(mockDeleteTodo).toHaveBeenCalledWith(mockTodo.id);
  });
});
```

特に目新しいテストコードはないでしょう。今回はコンポーネントに対するテストコードでしたが、コンポーネントから切り離されたロジックファイル（例えば、React の hooks）ももちろん対象です。

ユニットテストを作成する際には、以下の 3 つのポイントに注意しています。

- Arange-Act-Assert（AAA）パターンを使用する
  - 上から下に読みやすい構造にする
    - 下から上を読み返さない
  - 自然言語を意識して記述する
    - テスト実行後の出力メッセージが読みやすくなる
- DRY 原則や、制御文（if/while など）を避け、愚直に書く
  - シンプルで直感的なテストコードを好む
    - ハードコードした変数も良い
  - 1 つのテストファイルで内容を確認できるようにする
    - 例えば、データファイルを別ファイルに分割しない
- 1 つのテストケースには 1 つの検証を行う
  - 異なる目的の検証は、テストケースを分ける

##### 脱線) なんでテストコードを書くのか

テストコードは、プロダクトを利用するユーザーではなく、開発するエンジニアのために存在すると、私は考えています。そのため、私が考えるテストコードの目的は以下の 3 つです。

- 開発効率の向上（キーストロークの削減）
- 機能品質の維持
- 仕様の明確化

開発効率の向上では、例えば多くの組み合わせパターンがあるスキーマバリデーションの場合、手動での確認は大変です。そこで、パラメタライズドテストやプロパティベースドテストを実施することで効率的に開発できます。

機能品質の維持では、CI/CD プロセスでテストを実行し、テストが成功した場合にのみデプロイするリリースフローを構築します。そうすると、デプロイされたプロダクトは、テストで記述された内容の品質を担保できます。

仕様の明確化では、テストコードを自然言語として分かりやすく書くことで、どのような機能があるのかが理解できます。仕様書をプロダクトコードから読み取るのは不親切ですが、テストコードが分かりやすい場合、機能の現状の動作がある程度把握できるようになります。

#### インテグレーションテスト

ユニットテストでは、個々のコンポーネントや関数が対象となります。一方、インテグレーションテストでは、1 画面に構成されるコンポーネントなど、ユーザーに価値を提供できる状態のものが対象です。今回の場合、TodoList.tsx や TodoInput.tsx を使用している App.tsx が該当します。

インテグレーションテストにおいては、バックエンドとの通信は模擬されますが、それ以外の要素はすべて実際のものです。ユニットテストではコンポーネント単体のみのテストでしたが、インテグレーションテストでは画面に表示される必要なコンポーネントが全て揃っています。そのため、コンポーネント間の連携を確認する目的で、ユーザー操作、すなわちインタラクションテストを行うことが効果的です。

インタラクションテストには、Storybook を利用すると便利です。

https://storybook.js.org/docs/react/writing-tests/interaction-testing

従来はターミナルでインタラクション（クリックなど）のテストを行っていたと思いますが、Storybook を用いることで視覚的に確認しながらテストが作成できるため、非常に開発しやすくなります。

それでは、1 つの機能として提供されている App.tsx を対象に、インタラクションテストを作成してみましょう。
まず、Storybook を作成すると、次のようなものができます。

:::message
今回紹介する Storybook のバージョンは 6.5 です。
:::

```typescript
// src/components/App/App.stories.tsx

import { ComponentStoryObj, ComponentMeta } from "@storybook/react";
import { App } from ".";
import { userEvent, within } from "@storybook/testing-library";

type Component = typeof App;
type Meta = ComponentMeta<Component>;
type Story = ComponentStoryObj<Component>;

const meta: Meta = {
  component: App,
};
export default meta;

export const AddTwoTodosAndCheckOneScenario: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox"), "Write a blog post", {
      delay: 100,
    });
    await userEvent.keyboard("{enter}", { delay: 100 });
    await userEvent.type(canvas.getByRole("textbox"), "Develop sample app", {
      delay: 100,
    });
    await userEvent.keyboard("{enter}", { delay: 100 });
    await userEvent.click(canvas.getAllByRole("checkbox")[1]);
  },
};
```

このように、Storybook では、Story に play を記述することでインタラクションを表現できます。Storybook 上でインタラクションを確認することができます。

![storybook_interaction](https://storage.googleapis.com/zenn-user-upload/97cc9410915a-20230423.gif)

それでは、これをテストに活用しましょう。

```typescript
// src/components/App/App.test.tsx

import { render, screen } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./App.stories";

const { AddTwoTodosAndCheckOneScenario } = composeStories(stories);

describe("play AddTwoTodosAndCheckOneScenario", () => {
  it("renders two todos", async () => {
    // Arrange
    const { container } = render(<AddTwoTodosAndCheckOneScenario />);

    // Act
    await AddTwoTodosAndCheckOneScenario.play({ canvasElement: container });

    // Assert
    const todos = screen.getAllByTestId("todo-title");
    expect(todos).toHaveLength(2);
  });
  it("checks one todo", async () => {
    // Arrange
    const { container } = render(<AddTwoTodosAndCheckOneScenario />);

    // Act
    await AddTwoTodosAndCheckOneScenario.play({ canvasElement: container });

    // Assert
    const todoCheckboxes = screen.getAllByRole("checkbox", { checked: true });
    expect(todoCheckboxes).toHaveLength(1);
  });
});
```

このように、Storybook の Story オブジェクトをテストコードに読み込み、play 関数を実行できます。したがって、Storybook で確認したインタラクションがそのままテストコードで動きます。後は、expect を書くだけです。

インテグレーションテストは、ユニットテストよりも非常に価値があるテストを多く実施できます。その理由は、ユーザー目線のテストが可能となるからです。ユニットテストでは、関数やコンポーネントの詳細なテストは可能ですが、それは基本的にエンジニア目線のテストになります。

ユニットテストよりもインテグレーションテストが多くなっても問題ありません。ユニットテストとインテグレーションテストのテストが重なるコードがあるかもしれませんが、完璧な必要最小限な網羅的なテストメンテンナンスは現実的ではないため、また、重なっていても困ることもそう多くない場合、許容して良いと思っています。

##### API 通信のモック

フロントエンドは、バックエンドとの通信を発生させることは多々あります。インテグレーションテストやユニットテストでは、API 通信をモックすることがよくあります。通信をインターセプトして、固定データを返却する mswjs/msw が有名です。また、固定データではなく、動的にデータを返却できる mswjs/data というものも便利なので紹介です。

https://github.com/mswjs/msw
https://github.com/mswjs/data

#### E2E テスト(システム)

ここでは、フロントエンドから API までを含んだ一気通貫のテストを作成します。E2E テストでは、一般的にヘッドレスブラウザを使用したテストが行われます。私は、Playwright を好んで使います。

E2E テストの作成方法としては、エンジニア目線で細かいテストを行うよりも、ビジネス目線で要件を満たすかどうかを確認する受け入れテストを書くことが望ましいでしょう。そこで、ATDD として有名な[cucumber](https://github.com/cucumber/cucumber-js)を用いたサンプルを紹介します。

cucumber では、受け入れのためのシナリオを BDD 形式の gherkin で記述します。また、[gherkin は markdown で作成すること](https://github.com/cucumber/gherkin/blob/main/MARKDOWN_WITH_GHERKIN.md)ができます。

それでは、簡単な受け入れテストのシナリオを作成してみましょう。以下のようなシナリオになります。

```markdown
# Feature: Todo App

## Background: The Todo App is opened

- Given the Todo App is opened

## Rule: Adding new Todos

### Scenario: Add a new Todo

- When the user enters a "new Todo" and enter key
- Then the "new Todo" is added to the list

### Scenario: Attempt to add an empty Todo

- When the user enters an empty Todo and clicks the Add button
- Then the Todo is not added to the list and "Not entered" message is displayed
```

このシナリオを参考にして、テストコードを作成してみましょう。次のようなテストコードを記述します。`World` は、Playwright を使用してヘッドレスブラウザを起動しているだけです。

```typescript
// features/step_definitions/steps.ts

import { Given, When, Then } from "@cucumber/cucumber";
import World from "../support/World";
import assert from "assert";

Given("the Todo App is opened", async function (this: World) {
  await this.page.goto("https://silverbirder-react-todo-mvc.vercel.app");
});

When(
  "the user enters a {string} and enter key",
  async function (this: World, todo: string) {
    const todoInput = await this.page.getByPlaceholder("what you need to do?");
    await todoInput.type(todo);
    await this.page.keyboard.down("Enter");
  }
);

Then(
  "the {string} is added to the list",
  async function (this: World, todo: string) {
    const todos = await this.page.getByText(todo);
    assert((await todos.count()) === 1);
  }
);

When(
  "the user enters an empty Todo and clicks the Add button",
  async function (this: World) {
    const todoInput = await this.page.getByPlaceholder("what you need to do?");
    await todoInput.focus();
    await this.page.keyboard.down("Enter");
  }
);

Then(
  "the Todo is not added to the list and {string} message is displayed",
  async function (this: World, message: string) {
    const todos = await this.page.getByTestId("todo-title");
    assert((await todos.count()) === 0);
    const messages = await this.page.getByText(message);
    assert((await messages.count()) === 1);
  }
);
```

`cucumber-js` を実行すると、シナリオをもとにテストが実行されます。

```bash
$ npx cucumber-js
..........
2 scenarios (2 passed)
6 steps (6 passed)
0m02.504s (executing steps: 0m02.476s)
```

このテストをリリース前に実施することで、シナリオで記述された内容が保証されます。ぜひ、リリース前の受け入れテストの実施をご検討ください。

※ Screenplay パターンと呼ばれる、Actor、Task、World についてもお話ししたいのですが、情報量が多くなるため、今回は割愛させていただきます。

### 非機能テスト(Non-Functional)

バックエンドではマシンリソースに対するパフォーマンステストが行われるように、フロントエンドでもブラウザに対するパフォーマンステストが実施されます。パフォーマンスは非機能要件の 1 つです。これから紹介する非機能要件は以下の通りです。

- パフォーマンス
- レジリエンス
- ミューテーション
- 互換性
- ~~Security~~

#### パフォーマンス

フロントエンド開発では、パフォーマンス問題に直面することは避けられません。パフォーマンス問題が発生した際には、パフォーマンスチューニングが一般的に行われます。DevTool やプロファイラーを活用して問題を特定し、解決を図ります。

しかし、問題解決だけで終わらせてしまうのは非常に勿体ないことです。同じような問題が再発しないように、パフォーマンスに関するテストコードが存在するとさらに良いでしょう。

##### Profiler

React では、Profiler というツールが提供されており、これを Jest と組み合わせることで効果的にテストが可能です。

https://ja.reactjs.org/docs/profiler.html

例えば、TodoList の Todo が 100 個レンダリングされる場合の描画時間を、200ms 未満であることを確認するテストが作成できます。

```typescript
// src/components/TodoList/TodoList.perf.test.tsx

import { render } from "@testing-library/react";
import { TodoList } from ".";
import { Todo } from "../../types";
import { Profiler } from "react";

describe("TodoList", () => {
  it("renders with acceptable performance", () => {
    // Arrange
    const onRender = jest.fn();
    const todos: Todo[] = [...Array(100)].map((value, index) => {
      return {
        id: index.toString(),
        title: "title",
        completed: false,
      };
    });

    // Act
    render(
      <Profiler id="PerformanceTestComponent" onRender={onRender}>
        <TodoList todos={todos} />
      </Profiler>
    );

    // Assert
    const [, , actualDuration, , , , ,] = onRender.mock.calls[0];
    expect(actualDuration).toBeLessThan(200);
  });
});
```

これは単純な例ですが、実際にはもっと複雑な操作が求められることがあります。パフォーマンスチューニング後に、描画時間などの要件が保証されるようにしましょう。

##### PerformanceObserver

レイアウトの再計算（reflow）が強制的に実行される場合、ブラウザのメインスレッドでの JS 実行時間が長く続く可能性があります。これにより、描画速度が遅れ、フレームレート（fps）が低下することがあります。

この問題に対処するために、Performance API の中にある、まだ実験段階の機能である PerformanceLongTaskTiming という指標を用いたテストコードを作成することができます。

以下のリンクで Performance API および PerformanceLongTaskTiming に関する詳細情報を参照できます。

- https://developer.mozilla.org/ja/docs/Web/API/Performance_API
- https://developer.mozilla.org/ja/docs/Web/API/PerformanceLongTaskTiming

具体的にテストコードを作成してみましょう。@playwright/test を利用してみます。

```typescript
import { test, expect } from "@playwright/test";

test("no long tasks after button click", async ({ page }) => {
  // Navigate to the specified URL
  await page.goto(
    "https://googlesamples.github.io/web-fundamentals/tools/chrome-devtools/rendering-tools/forcedsync.html"
  );

  // Define a function to observe long tasks
  const observeLongTasks = async (): Promise<number> => {
    return await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let longTaskCount = 0;

        // Create a PerformanceObserver to observe long tasks
        const observer = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.entryType === "longtask") {
              longTaskCount++;
            }
          }
        });

        // Start observing long tasks
        observer.observe({ entryTypes: ["longtask"] });

        // Click the button
        const button = document.querySelector("button");
        button.click();

        // Wait for a short time to allow long tasks to be recorded
        setTimeout(() => {
          // Stop observing and resolve the promise with the count of long tasks
          observer.disconnect();
          resolve(longTaskCount);
        }, 3000);
      });
    });
  };

  // Observe long tasks after clicking the button
  const longTaskCount = await observeLongTasks();

  // Expect no long tasks to occur
  expect(longTaskCount).toBe(0);
});
```

以下のコマンドを使用してテストを実行することができます。

```
$ npx playwright test
```

このテストコードによって、longTasks が発生しないことが保証されます。

longTasks は、50ms を超えるタスクが対象となります（[参照](https://w3c.github.io/longtasks/)）。その他の指標には、`paint`や`layout-shift`などが含まれます。指標の一覧は、[こちらのリンク](https://w3c.github.io/timing-entrytypes-registry/#registry)で確認できます。

##### メモリリーク

SPA のようなフロントエンドの場合、メモリリークが懸念されることがあります。この問題に対処するために、Meta 社が開発した Memlab というツールが便利です。Memlab は、Puppeteer を起動し、画面操作を行い、[V8 におけるヒープメモリのスナップショットを取得しています](https://github.com/facebook/memlab/blob/d93d724a95696ab013631bb86c42283303b7dcd1/packages/core/src/lib/NodeHeap.ts#L93)。

ここでは、簡単な Memlab を利用したテストコードを紹介します。

```javascript
// .memlab/scenario.js

// initial page load's url
function url() {
  return "https://silverbirder-react-todo-mvc.vercel.app";
}

// action where you suspect the memory leak might be happening
async function action(page) {
  await page.type(".new-todo", "Hello World");
  await page.keyboard.press("Enter");
}

// how to go back to the state before action
async function back(page) {
  await page.hover(".view");
  await page.click(".destroy");
}

module.exports = { action, back, url };
```

`url` は、ベースとなる URL へのアクセスであり、メモリの使用量を監視します。`action` でメモリリークが発生しそうな操作を記述し、`back` で元の状態に戻す操作を行います。

Memlab の実行は、以下のコマンドです。

```bash
$ memlab run --scenario .memlab/scenario.js
page-load[1.4MB](baseline)[s1] > action-on-page[1.6MB](target)[s2] > revert[1.8MB](final)[s3]

total time: 49.2s
Memory usage across all steps:
2.1 _________
1.9 _________
1.8 _________
1.7 ______▄▄_
1.5 ___▄▄_▄▄_
1.4 ___▄▄_▄▄_
1.3 ▄▄_▄▄_▄▄_
1.1 ▄▄_▄▄_▄▄_
1.0 ▄▄_▄▄_▄▄_
    1  2  3

No leaks found
MemLab found 0 leak(s)
✨  Done in 51.69s.
```

#### レジリエンス

フロントエンドでもカオスエンジニアリングテストが実施可能です。

https://www.npmjs.com/package/chaos-frontend-toolkit

ブラウザの操作はユーザーによって多様です。例えば、以下のようなブラウザ操作が存在します。

- 自由なブラウザバックやマウス、キーボード操作
- シングルクリックではなくダブルクリック

さらに、ブラウザが外部と通信することはよくあります。ネットワークに関しても、次のような状況が起こり得ます。

- リクエストの失敗や遅延
- プロキシ環境下でよくあるリクエストの遮断

このようなカオスを注入してもアプリケーションがクラッシュしないようにテストを書くことは有益であるかもしれません。

例えば、Storybook 上でランダムなクリックを発生させるためのコードは、次のようになります。

```typescript
// src/components/App/App.stories.tsx
import { ComponentStoryObj, ComponentMeta } from "@storybook/react";
import { App } from ".";
import chaosFrontendToolkit from "chaos-frontend-toolkit";

type Component = typeof App;
type Meta = ComponentMeta<Component>;
type Story = ComponentStoryObj<Component>;

const meta: Meta = {
  component: App,
};
export default meta;

export const Monkey: Story = {
  decorators: [
    (Story) => {
      chaosFrontendToolkit.gremlins.start();
      return <Story />;
    },
  ],
};
```

その後、console.error を監視し、発生しないことを確認するテストコードを書くと良いでしょう。ただし、もしエラーが検出されたとしても、再現できなければ問題解決が難しいため、何らかの方法で追跡しやすいログを残すか、セッションリプレイのように記録するなどの工夫が必要です（シード値があればさらに良いですが）。

#### ミューテーション

突然変異テストという手法が存在します。

https://stryker-mutator.io/

これは、フロントエンドという文脈ではありませんが、面白かったので紹介します。(笑)

Stryker は、プロダクションコードを書き換え（突然変異）する際に、テストコードも失敗することを期待するものです。つまり、テストコードのテストを行うイメージです。これにより、偽のテストカバレッジを見抜くことができます。Stryker の設定は、公式ページに従ってセットアップし、`stryker run` を実行するだけです。実際に動かしてみます。

```bash
$ stryker run
INFO ProjectReader Found 4 of 63 file(s) to be mutated.
INFO Instrumenter Instrumented 4 source file(s) with 47 mutant(s)
INFO ConcurrencyTokenProvider Creating 2 checker process(es) and 2 test runner process(es).
INFO DryRunExecutor Starting initial test run (jest test runner with "off" coverage analysis). This may take a while.
INFO DryRunExecutor Initial test run succeeded. Ran 8 tests in 20 seconds (net 8004 ms, overhead 12326 ms).
Mutation testing  [=========================================] 100% (elapsed: ~2m, remaining: n/a) 47/47 Mutants tested (21 survived, 0 timed out)

All tests
  ...
  TodoItem/TodoItem.test.tsx
    ✘ TodoItem renders todo title [line 18] (covered 0)
    ✘ TodoItem toggles todo completion [line 30] (covered 0)
    ✓ TodoItem deletes a todo [line 45] (killed 1)
```

TodoItem の中で、プロダクトコードを破壊したミュータント（👽）を検出し、対応するテストが失敗した（Killed）ものは、次の画像の通りです。

![mutant_todo_item_1](https://storage.googleapis.com/zenn-user-upload/ec63905e2231-20230423.png)

一方、ミュータントが生き残って（Survived）しまった例として、例えば、className の箇所が挙げられます。

![mutant_todo_item_2](https://storage.googleapis.com/zenn-user-upload/81915c789ace-20230423.png)

className は見た目に関わるため、後述するビジュアルリグレッションテストで検出したいところですね。

このように、ミュータントを見つけてテストの品質を向上させることは、効果的な手段の 1 つだと考えられます。

#### 互換性

フロントエンド開発では、サポート対象のブラウザで動作確認を行う必要があります。ブラウザごとに異なる JavaScript エンジンやレンダリングエンジンがあるため、各ブラウザにおける JavaScript の動作や見た目を確認することが必要です。

クロスブラウザテストには、実機の購入、仮想サーバーの利用、BrowserStack のような SaaS を活用する、Playwright でのマルチブラウザ利用など、さまざまな方法が存在します。費用対効果に見合った選択を行うことが重要です。

### UI/UX

UI/UX は、フロントエンド開発において、切っても切り離せない重要なテーマです。今回は、テスト自動化が可能な非常に小さな部分だけを紹介します。UI/UX の範囲は、人の判断が多く求められる領域であるため、書く内容はあまり多くありません。

#### ビジュアル

見た目は、フロントエンド特有の非常に重要な要素です。レスポンシブデザイン、デスクトップ・モバイルのデバイス、Windows/Mac などの OS、ブラウザの外観に関する機能（ダークモード）など、見た目の変化をテストすることも重要です。
ビジュアルリグレッションテストという手法を開発サイクルに取り入れましょう。Lost Pixel や Chromatic など、様々な手段があるので試してみてください。

https://storybook.js.org/docs/react/writing-tests/visual-testing

#### アクセシビリティ

アクセシビリティについては、人の判断が必要なケースもありますが、機械的にチェックできる要素も存在します。キーボード操作のみで機能が正常に動作するか確認するためには、インタラクションテストが必要です。VoiceOver の対応状況はいかがでしょうか？さらに、画像の alt 属性は適切に設定されていますか？文章の表現については人の目で判断が必要ですが、少なくとも入力されているかどうかはチェックできます。

https://storybook.js.org/docs/react/writing-tests/accessibility-testing

## その他

テストの観点として、網羅的に知りたいと思いませんか？私は、自前で[point of view](https://docs.google.com/spreadsheets/d/e/2PACX-1vSpbSeaOPVSKyi36bwbBXQ56DbXNzLEp-anI4PHfXps4pa7gWUMDGHjNmVy1gl945o4aNGCszPWxcKm/pubhtml)というものを作成しました。これは、様々な観点の一覧表です。この一覧表から、何かインスパイアされるものを見つけるのが、楽しいですね。

例えば、以下のようなことが考えられます。

- 精度(precision)
  - バックエンド側の数値は、フロントエンド側の数値の範囲に収まりますか？
  - JavaScript の Integer の最大値は、9,007,199,254,740,991 です。
- 耐障害性(fault tolerance)
  - フロントエンドから、コアなデータ参照と、補助のデータ参照は分けていますか？
  - 補助のデータ参照が失敗したとしても、アプリケーションが動作できる状態になっているのが良いでしょう。

## 終わりに

いかがでしたでしょうか。フロントエンドにおけるテストパターンは、まだまだ存在すると思います。もし他にもご存知のものがあれば、ぜひ教えてください。
