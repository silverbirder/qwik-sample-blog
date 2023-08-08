import {
  component$,
  createContextId,
  Slot,
  useContextProvider,
} from "@builder.io/qwik";
import { DocumentHeadProps, routeLoader$ } from "@builder.io/qwik-city";
import { PostSummary } from "@sb/ui/lib-types/models";
import { asyncMap } from "~/util";

const useBlogContents = routeLoader$(async (): Promise<PostSummary[]> => {
  const modules = await import.meta.glob(
    "/src/routes/blog/contents/**/**/index.mdx"
  );
  const posts = await asyncMap(Object.keys(modules), async (path) => {
    const data = (await modules[path]()) as DocumentHeadProps;
    return {
      title: data.head.title || "",
      description:
        data.head.meta.find((m) => m.name === "description")?.content || "",
      permalink: path
        .replace(/^\/src\/routes/, "")
        .replace(/\/index.mdx$/, "/"),
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
});

interface BlogContents {
  posts: PostSummary[];
}

export const BlogContentsContext =
  createContextId<BlogContents>("blogContents");

export default component$(() => {
  const { value: posts } = useBlogContents();
  useContextProvider(BlogContentsContext, { posts });
  return <Slot />;
});
