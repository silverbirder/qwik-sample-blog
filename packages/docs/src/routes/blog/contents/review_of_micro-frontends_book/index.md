---
title: 「マイクロフロントエンド」を読みました
published: true
date: 2022-11-13
description: DAZN の Luca Mezzalira さんが書かれたマイクロフロントエンドを読みました。簡単な書籍レビューを残しておこうかなと思います。
tags: ["Micro Frontends", "Review"]
---

DAZN の Luca Mezzalira さんが書かれた[マイクロフロントエンド](https://www.oreilly.co.jp/books/9784814400027/) を読みました。簡単な書籍レビューを残しておこうかなと思います。

## なぜマイクロフロントエンドを使うのか

従来のモノリスなフロントエンドから、マイクロフロントエンドに置き換えることで、どういう価値があるのでしょうか。
書籍に書いてある内容と、自身の意見を混ぜて以下に列挙します。

- 機能開発のイテレーションが短くなる
  - 1 チームに 1 サブドメインという小さなスコープのため
- チーム内の意思決定がしやすい
  - コードベースが小さいため
- リリース速度が早い
  - 各チームが独立しているため

1 チームが小さなサブドメインで独立することで、開発やコミュニケーション、リリースなどのコスト低減ができます。
これは、最終的には顧客への価値提供するサイクルを短くすることに繋がります。

## マイクロフロントエンドの導入方法

書籍には、実例として既存アプリケーションをマイクロフロントエンドへマイグレーションする話があります。
マイクロフロントエンドは、その設計の性質上、基本的に(既存アプリケーションからの)マイグレーションとセットです。
そのため、マイグレーションをどのように進めるかというのは、とても重要です。

その中で、マイクロフロントエンドへの最初の一歩として、次のパターンがあります。

- 共有コンポーネントをマイクロフロントエンドとしてリリース
- 新機能をマイクロフロントエンドとしてリリース
- 既存アプリケーションの一部をマイクロフロントエンドとしてリリース

要は、段階的に導入しましょうという話です。
また、マイクロフロントエンドには、従来の SPA 開発に似ている垂直分割という方法が最初の一歩としてお勧めのようです。

- 垂直分割
  - 1 つの画面に 1 つのマイクロフロントエンド
- 水平分割
  - 1 つの画面に複数のマイクロフロンエンド

ちなみに、マイクロフロントエンドとコンポーネントは、次のように区別します。

- マイクロフロントエンド
  - サブドメインのビジネス表現
  - ロジックをカプセル化し、イベント通信
- コンポーネント
  - 再利用性の目的で使用される技術的ソリューション
  - 拡張しやすく複数のプロパティを公開

## 書籍にあった好きな言葉

付録にある、New Relic で働かれている Erik Grijzen さんのインタビュー記事にて、

- Q. マイクロフロントエンドを 3 語で表現すると
- A. Scaling UI Development

という回答がありました。
`Scaling UI Development` という言葉、めちゃくちゃ好きになりました。

マイクロフロントエンドは、フロントエンドをサブドメインで分割し、小さく独立した開発が可能となります。
大規模な 1 つのアプリケーション開発や、1 つのブランド内の様々なプロダクトを提供するアプリケーション開発に対しては、マイクロフロントエンドは効果的だと思っています。

## 終わりに

余談ですが、ブログを書く時間が、徐々に減っています。
1 年前とかは、1 日とか使っていたんですが、今日は 30 分とかです。
効率化できている訳じゃなく、単純に時間がなくなってきたなと思います。