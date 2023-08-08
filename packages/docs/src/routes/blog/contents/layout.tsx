import { component$, Slot, useContext } from "@builder.io/qwik";
import { useDocumentHead } from "@builder.io/qwik-city";
import { BlogContentsContext } from "../layout";

export default component$(() => {
  const head = useDocumentHead();
  const tags: string[] = head.frontmatter.tags || [];
  const { posts } = useContext(BlogContentsContext);
  return (
    <>
      <Slot />
      <>
        <h2>Tags</h2>
        {tags.map((tag) => (
          <section>
            <h3>{tag}</h3>
            {posts
              .filter(
                (post) =>
                  post.tags.indexOf(tag) !== -1 && head.title !== post.title
              )
              .map((post) => (
                <div>
                  <a href={post.permalink}>{post.title}</a>
                </div>
              ))}
          </section>
        ))}
      </>
    </>
  );
});
