---
title: Micro Frontendsで組成するフラグメントをWeb Componentsで定義してModule Federationで共有する
published: true
date: 2022-05-28
description: Micro Frontends(以降、MFE)で組成するフラグメントを Web Components で定義して Module Federation で共有する方法を、ざっくり紹介します。
tags: ["Web Components", "Module Federation", "Micro Frontends"]
---

Micro Frontends(以降、MFE)で組成するフラグメントを Web Components で定義して Module Federation で共有する方法を、ざっくり紹介します。

サンプルコードは、次のリポジトリにあります。

- https://github.com/silverbirder/playground/tree/main/node/web-components-is-api-for-micro-frontends

※ MFE については、以下のブログ記事をお読みください。

https://silverbirder.github.io/blog/contents/mfe/

## 用語

- フラグメント
  - 各フロントエンドチームが提供する UI 部品(HTML,CSS,JS,etc)
  - コンポーネントと言い換えても良いです
- 組成
  - フラグメントを使って、ページ全体を構築する

MFE で有名な Michael Geers さんの記事より、次のサンプル図があります。

<figure title="[翻訳記事]マイクロフロントエンド > mfe-three-teams">
<img alt="[翻訳記事]マイクロフロントエンド > mfe-three-teams" src="https://micro-frontends-japanese.org/resources/three-teams.png" />
<figcaption><a href="https://micro-frontends-japanese.org/">[翻訳記事]マイクロフロントエンド</a></figcaption>
</figure>

この例は、EC サイトのサンプルです。
チェックアウトチームは React を使っていて、フラグメントは次の 2 つです。

- 購入ボタン(`buy for 66.00`)
- バスケット(`busket: 0 items(s)`)

組成は、プロダクトチームが担っています。
組成は調整の難しさがあるので、専任のチームがあっても良いかもと思います。

## フラグメントを Web Components で定義

フラグメントは、各フロントエンドチームが自由に定義できます。React で書いたり、Vue で書いたりできます。
フラグメントを組成するチームからすると、フラグメントのインターフェースが揃っている方が使いやすいと思います。
そこで、フラグメントを Web Components で定義しましょう。(定義の中身は React や Vue など自由です)

このやり方は、以下の MFE を実現する 3 つの設計パターンどれでも適用できると思います。

- ビルドタイム組成パターン
- サーバーサイド組成パターン
- クライアントサイド組成パターン

次に、サンプルコードを紹介します。

## 検索ボタンのフラグメント

検索ボタンのフラグメント(Web Components)を書きます。
それは、ボタンとクリックハンドラを定義した簡単なものです。
フレームワークは、React を選択しました。

```typescript
// ./packages/team-search/src/components/SearchButton/SearchButton.tsx
import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

export const CustomElementContext = createContext<HTMLElement>(
  document.createElement("div")
);

export class SearchButton extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement("span");
    this.attachShadow({ mode: "open" }).appendChild(mountPoint);
    ReactDOM.createRoot(mountPoint as HTMLElement).render(
      <React.StrictMode>
        <CustomElementContext.Provider value={this}>
          <App />
        </CustomElementContext.Provider>
      </React.StrictMode>
    );
  }
}
```

```typescript
// ./packages/team-search/src/components/SearchButton/App.tsx
import { useContext } from "react";
import { CustomElementContext } from "./SearchButton";

const App = () => {
  const customElement = useContext(CustomElementContext);
  const onClick = () => {
    customElement.dispatchEvent(
      new CustomEvent("search", { detail: { num: Math.random() } })
    );
  };
  return <button onClick={onClick}>Search</button>;
};

export default App;
```

この Web Components は、`<search-button />` と書いて使います。

他のフラグメントと連携する場合、カスタムイベントを使います。
この Web Components は、クリックボタンを押したら、`CustomEvent("search", { detail: <object> })` というカスタムイベントを発火します。

## JSON を表示するフラグメント

次に、このイベントのデータ(`<object>`)を表示するフラグメント(Web Components)を書きます。
与えられた json 文字列を表示するだけのシンプルなものです。
Web Components へデータを与える手段は 3 つあります。(さらにあるかもです)

- HTML 属性 (ex. `<div attribute="value">`)
  - プリミティブな値(数値、文字など)で使う
- イベントリスナー (`eventlistener`)
  - 非プリミティブな値(配列など)で使う
- Slot (`<slot name="xxx">`)
  - HTML 要素を差し込みたいときに使う

今回は、HTML 属性を選択しました。

```typescript
// ./packages/team-content/src/components/JsonDiv/JsonDiv.tsx
import ReactDOM from "react-dom/client";
import App from "./App";

export class JsonDiv extends HTMLElement {
  root: ReactDOM.Root | undefined;
  static get observedAttributes() {
    return ["value"];
  }

  attributeChangedCallback() {
    const value = this.getAttribute("value") || ("{}" as string);
    const props = { json: value };
    if (this.root) {
      this.root.render(<App {...props} />);
    }
  }

  connectedCallback() {
    const value = this.getAttribute("value") || ("{}" as string);
    const props = { json: value };
    const mountPoint = document.createElement("span");
    this.attachShadow({ mode: "open" }).appendChild(mountPoint);
    this.root = ReactDOM.createRoot(mountPoint as HTMLElement);
    this.root.render(<App {...props} />);
  }
}
```

この Web Components は、`<json-div value="{}" />` のように使います。

```typescript
// ./packages/team-content/src/components/JsonDiv/App.tsx
type AppProps = {
  json: string;
};

const App = (props: AppProps) => {
  const { json } = props;
  return <div>{json}</div>;
};

export default App;
```

`App.tsx`は、与えられた json を`<div>`で表示しているだけです。

## 組成

これまで紹介したフラグメントを組成します。
組成するためには、フラグメントを提供する仕組みが必要です。
そこで、Webpack の Module Federation を使います。

※ Module Federation を採用すると、各フロントエンドチームのビルドシステムを Webpack で縛ってしまうデメリットがあります。

※ 他の提供する仕組みとして、`importmap` が使えないかなと思ったんですが、未検証です。

## Module Federation

Module Federation は、Webpack@5 から導入された機能です。

- https://webpack.js.org/concepts/module-federation/

> Each build acts as a container and also consumes other builds as containers. This way each build is able to access any other exposed module by loading it from its container.

Module Federation は、各ビルドをコンテナとして機能させ、他のコンテナを使うことができます。
今回で言うと、Web Components の SearchButton と JsonDiv をコンテナ化し、組成のビルドでコンテナを参照します。

具体的なコードを紹介します。

### コンテナ化

検索ボタンをコンテナ化してみます。(JSON を表示するフラグメントも同様のコードです)

```typescript
// .packages/team-search/src/remoteEntry.ts
export { SearchButton } from "./SearchButton";
```

何をコンテナとして提供するか export します。
次に、webpack の plugins コードを定義します。

```javascript
// .packages/team-search/webpack.config.js
...
const config = {
  entry: "./src/index",
  plugins: [
    new ModuleFederationPlugin({
      name: "search",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/remoteEntry",
      },
      shared: {
        react: {
          singleton: true,
          strictVersion: true,
          requiredVersion: "^18.0.0",
          eager: true,
        },
        "react-dom": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "^18.0.0",
          eager: true,
        },
      },
    }),
  ]
};
...
```

先程の export したファイルを exposes で設定します。
ライブラリの重複ロードを防ぐために shared を設定します。
これで、SearchButton をコンテナ化し提供できるようになりました。

### 組成

では、コンテナをロードする組成側のビルド(webpack)を見てみます。

```javascript
// ./webpack.config.js
const URL_MAP = {
  content: process.env.CONTENT_URL || "http://localhost:3001",
  search: process.env.SEARCH_URL || "http://localhost:4001",
};

const config = {
  entry: "./src/index",
  plugins: [
    new ModuleFederationPlugin({
      name: "all",
      remotes: {
        content: `content@${URL_MAP.content}/remoteEntry.js`,
        search: `search@${URL_MAP.search}/remoteEntry.js`,
      },
      shared: {
        react: {
          singleton: true,
          strictVersion: true,
          requiredVersion: "^18.0.0",
        },
        "react-dom": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "^18.0.0",
        },
      },
    }),
  ],
};
```

remotes で、コンテナをロードする URL を設定します。
次に、entry コードです。

```typescript
// ./src/index.ts
// @see: https://webpack.js.org/concepts/module-federation/#uncaught-error-shared-module-is-not-available-for-eager-consumption
import("./bootstrap");
export {};
```

`@see`を読むと分かりますが、entry コードは、`import`で動的ロードする必要があります。
次に、bootstrap コードです。

```typescript
// ./src/bootstrap.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

```typescript
// ./src/App.tsx
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    import("content/App").then((module) => {
      const { JsonDiv } = module;
      if (customElements.get("json-div") === undefined) {
        customElements.define("json-div", JsonDiv);
      }
    });
    import("search/App").then((module) => {
      const { SearchButton } = module;
      if (customElements.get("search-button") === undefined) {
        customElements.define("search-button", SearchButton);
      }
      const SearchButtonElement = document.querySelector("search-button");
      SearchButtonElement?.addEventListener("search", ((e: CustomEvent) => {
        document
          .querySelector("json-div")
          ?.setAttribute("value", JSON.stringify(e.detail));
      }) as EventListener);
    });
  }, []);

  return (
    <>
      <search-button />
      <json-div />
    </>
  );
};

export default App;
```

ここにある `import("content/App")` や`import("search/App")` がコンテナを動的ロードしているところです。
ロードするものは、Web Components なので`customElements.define`で定義します。
また、`search-button`の`search`イベントハンドラをリッスンし、イベントデータを`json-div`の`value`属性に設定する処理を書きます。
これで、組成が完了です。

実際に、動きを見てみたい場合は、リポジトリの README.md を見て試してみてください。

## この手法におけるメリット

Web Components をフラグメントとして使うメリット・デメリットは、次のとおりです。

- メリット
  - 適合性
    - Web Components は、Web 標準技術なので、ライブラリとの適合は容易
    - HTML タグを使うようにカスタム HTML タグを使えば良い
  - 独立性
    - Shadow DOM というサンドボックス環境で開発可能
- デメリット
  - Javascript が動く必要あり

## 最後に

Micro Frontends で組成するフラグメントを Web Components で定義して Module Federation で共有する方法を紹介しました。
実運用の経験はないですが、アイデアとして使えるかもしれないと思いました。
