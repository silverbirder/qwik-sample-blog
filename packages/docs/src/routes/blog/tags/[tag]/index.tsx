import { Resource, component$, useResource$ } from "@builder.io/qwik";
import { DocumentHeadProps, useLocation } from "@builder.io/qwik-city";
import { PostSummaryListItem } from "@sb/ui";
import { PostSummary } from "@sb/ui/lib-types/models";
import { asyncMap } from "~/util";

export const getPosts = async (): Promise<PostSummary[]> => {
  const modules = await import.meta.glob(
    "/src/routes/blog/contents/**/**/index.mdx"
  );
  const posts = await asyncMap(Object.keys(modules), async (path) => {
    const data = (await modules[path]()) as DocumentHeadProps;
    return {
      title: data.head.title || "",
      description:
        data.head.meta.find((m) => m.name === "description")?.content || "",
      date: data.head.frontmatter.date,
      tags: data.head.frontmatter.tags,
      published: data.head.frontmatter.published,
      permalink: path
        .replace(/^\/src\/routes/, "")
        .replace(/\/index.mdx$/, "/"),
    };
  });
  return posts.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
};

export default component$(() => {
  const loc = useLocation();
  const postsResource = useResource$(getPosts);
  return (
    <>
      <main class="main">
        <Resource
          value={postsResource}
          onResolved={(posts) => {
            const tagPosts = posts.filter(
              (post) => post.tags.indexOf(loc.params.tag) !== -1
            );
            return (
              <>
                {tagPosts.map(
                  ({
                    title,
                    description,
                    permalink,
                    tags,
                    date,
                    published,
                  }) => (
                    <PostSummaryListItem
                      key={title}
                      title={title}
                      description={description}
                      permalink={permalink}
                      tags={tags}
                      date={date}
                      published={published}
                    ></PostSummaryListItem>
                  )
                )}
              </>
            );
          }}
        />
      </main>
    </>
  );
});
