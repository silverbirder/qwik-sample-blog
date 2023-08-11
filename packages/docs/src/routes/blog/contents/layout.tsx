import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import { DocumentHead, useDocumentHead } from "@builder.io/qwik-city";
import data from "../index.json";

import prismStyles from "~/styles/prism/prism-vsc-dark-plus.css?inline";
import styles from "./index.css?inline";

export default component$(() => {
  useStyles$(prismStyles);
  useStyles$(styles);

  const head = useDocumentHead();
  const tags: string[] = head.frontmatter.tags || [];
  return (
    <>
      <article class="post">
        <Slot />
      </article>
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
  );
});

export const head: DocumentHead = ({ head }) => {
  return {
    ...head,
    meta: [
      ...head.meta,
      // { name: "twitter:card", content: "summary" },
      // { name: "twitter:site", content: "Doğan Öztürk | Blog" },
      // { name: "twitter:creator", content: "Doğan Öztürk" },
      // { name: "twitter:title", content: head.title },
      // { name: "twitter:description", content: description },
      // {
      //   name: "twitter:image",
      //   content: "https://doganozturk.dev/images/avatar.jpg",
      // },
      // { property: "og:title", content: head.title },
      // { property: "og:type", content: "article" },
      // {
      //   property: "og:url",
      //   content: "https://doganozturk.dev" + head.frontmatter.permalink,
      // },
      // {
      //   property: "og:image",
      //   content: "https://doganozturk.dev/images/avatar.jpg",
      // },
      // { property: "og:description", content: description },
      // { property: "og:site_name", content: "doganozturk.dev" },
    ],
  };
};
