# TODO

## ブログコンテンツを packages/content に置く

packages/docs は、qwik の routing などのみとして、コンテンツは別ファイルに切り出したい。docs 以下がめちゃくちゃファイル増える。

git commit 58e382aeef66 で試した。
dynamic import が qwik の都合上できない。
そこで、以下のようにすれば、解消はできた。

```text
// packages/content/src/blog/mfe.md
...
// packages/content/src/blog/index.ts
import mfe from "./mfe.md"
export { mfe }
// packages/docs/src/blog/[name]/index.tsx
import Blog from "@sb/content/src/blog" // 全部Import
export default component$(() => {
    const name = useLocation().params.name;
    //@ts-ignore
    const Content = Blog[name];
    return <Content />
})
```

こうすれば、SSR の build もパスする。
いけそうなんだけど、割とトリッキーなことをしているので、これで進んで困りそうなことがありそう。
1 点、小さな困りごとは、相対パスの扱い。
packages/content/src/blog 以下でそれぞれのファイル参照ができる。
けど、packages/docs 側から当該ファイルが参照しようとすると URL の path 上、ダメなんだじゃないか。

```text
// packages/content/src/blog/a.md
[b](./b.md)
// packages/content/src/blog/b.md
...
// packages/docs/src/blog/[name]/index.ts
aをloadしたとき、URLは以下。
/blog/a/
参照先は [./b.md] だからもしかしたら、
/blog/a/b/
になるんじゃないかな
```

まあ、まずは完成を目指して、後で content に切り出そうかな。

## pandaCSS

pandaCSSを入れようとしたけど、うまくいかなかった。

git commit dd26d72095a4 がrevert commit.