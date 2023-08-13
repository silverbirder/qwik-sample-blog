import { component$, Slot } from "@builder.io/qwik";

export default component$(() => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <a href="#">カテゴリ1</a>
          </li>
          <li>
            <a href="#">カテゴリ2</a>
          </li>
          <li>
            <a href="#">カテゴリ3</a>
          </li>
        </ul>
      </nav>
      <Slot />
      <section>
        <h3>関連記事</h3>
        <ul>
          <li>
            <a href="#">関連記事1</a>
          </li>
          <li>
            <a href="#">関連記事2</a>
          </li>
          <li>
            <a href="#">関連記事3</a>
          </li>
        </ul>
      </section>
    </>
  );
});
