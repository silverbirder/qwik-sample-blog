import { component$, Resource, useResource$ } from "@builder.io/qwik";
import type { DocumentHeadProps } from "@builder.io/qwik-city";
import { PostSummaryList } from "@sb/ui";
import { PostSummary } from "@sb/ui/lib-types/models";
import { asyncMap } from "~/util";

export const getPosts = async (): Promise<PostSummary[]> => {
  const modules = await import.meta.glob(
    "/src/routes/blog/contents/**/**/index.md"
  );
  const posts = await asyncMap(Object.keys(modules), async (path) => {
    const data = (await modules[path]()) as DocumentHeadProps;
    return {
      title: data.head.title || "",
      description:
        data.head.meta.find((m) => m.name === "description")?.content || "",
      permalink: data.head.frontmatter.permalink,
      date: data.head.frontmatter.date,
      tags: data.head.frontmatter.tags,
      published: data.head.frontmatter.published,
    };
  });
  return posts.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
};

export default component$(() => {
  const postsResource = useResource$(getPosts);
  return (
    <>
      <main class="main">
        <Resource
          value={postsResource}
          onResolved={(posts) => <PostSummaryList data={posts} />}
        />
      </main>
    </>
  );
});
