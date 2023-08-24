import { component$, Slot } from "@builder.io/qwik";
import {
  type DocumentHead,
  useContent,
  useDocumentHead,
} from "@builder.io/qwik-city";
import { PostSummaryList } from "~/components/post-summary-list/post-summary-list";
import { Tag } from "~/components/tag/tag";
import data from "~/routes/blog/index.json";
import { css } from "~/styled-system/css";
import { HStack } from "~/styled-system/jsx";

export default component$(() => {
  const head = useDocumentHead();
  const content = useContent();
  const tags: string[] = head.frontmatter.tags || [];
  return (
    <>
      <article
        class={css({
          display: "grid",
          gridTemplateAreas: {
            base: `
            "content sidebar"
            "tags ."
            "disqus ."`,
            mdDown: `
            "content"
            "tags"
            "disqus"`,
          },
          gridTemplateRows: {
            base: "1fr auto",
            mdDown: "auto",
          },
          gridTemplateColumns: "1fr",
        })}
      >
        <div
          class={css({
            gridArea: "content",
          })}
        >
          <h1>{head.title}</h1>
          <HStack gap={1}>
            {tags.map((tag) => (
              <Tag url={`/blog/tags/${tag}`} name={tag} key={tag} />
            ))}
          </HStack>
          <Slot />
        </div>
        <aside
          class={css({
            gridArea: "sidebar",
            hideBelow: "md",
          })}
        >
          <ul>
            {content.headings?.map((heading) => (
              <li key={heading.id}>
                <a href={`#${heading.id}`}>{heading.text}</a>
              </li>
            ))}
          </ul>
        </aside>
        <div
          class={css({
            gridArea: "tags",
          })}
        >
          <h2>Tags</h2>
          <RelatedTags currentTags={tags} currentTitle={head.title} />
        </div>
        <div
          class={css({
            gridArea: "disqus",
          })}
        >
          <script
            src="https://giscus.app/client.js"
            data-repo="silverbirder/qwik-sample-blog"
            data-repo-id="R_kgDOKCARrA"
            data-category="General"
            data-category-id="DIC_kwDOKCARrM4CYpI-"
            data-mapping="pathname"
            data-strict="0"
            data-reactions-enabled="1"
            data-emit-metadata="0"
            data-input-position="top"
            data-theme="preferred_color_scheme"
            data-loading="lazy"
            crossOrigin="anonymous"
            async
          ></script>
        </div>
      </article>
    </>
  );
});

interface RelatedTagsProps {
  currentTags: string[];
  currentTitle: string;
}

const RelatedTags = component$(
  ({ currentTags, currentTitle }: RelatedTagsProps) => {
    return (
      <>
        {currentTags.map((tag) => {
          const relatedTagPosts = data.filter(
            (post) =>
              post.tags.indexOf(tag) !== -1 && currentTitle !== post.title
          );
          if (relatedTagPosts.length === 0) return <></>;
          return (
            <section key={tag}>
              <h3>
                <Tag url={`/blog/tags/${tag}`} name={tag} />
              </h3>
              <PostSummaryList data={relatedTagPosts} />
            </section>
          );
        })}
      </>
    );
  }
);

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
