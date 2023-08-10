import { component$, Slot } from "@builder.io/qwik";
import { useDocumentHead } from "@builder.io/qwik-city";
import data from "../index.json";

export default component$(() => {
  const head = useDocumentHead();
  const tags: string[] = head.frontmatter.tags || [];
  return (
    <>
      <Slot />
      <>
        <h2>Tags</h2>
        {tags.map((tag) => (
          <section key={tag}>
            <h3>{tag}</h3>
            {data
              .filter(
                (post) =>
                  post.tags.indexOf(tag) !== -1 && head.title !== post.title
              )
              .map((post) => (
                <div key={post.title}>
                  <a href={post.permalink}>{post.title}</a>
                </div>
              ))}
          </section>
        ))}
      </>
    </>
  );
});
