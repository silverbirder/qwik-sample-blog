import { component$, useContext } from "@builder.io/qwik";
import { StaticGenerateHandler, useLocation } from "@builder.io/qwik-city";
import { BlogContentsContext, getBlogContents } from "../../layout";
import { PostSummaryList } from "@sb/ui";

export default component$(() => {
  const loc = useLocation();
  const { posts } = useContext(BlogContentsContext);
  const tagPosts = posts.filter(
    (post) => post.tags.indexOf(loc.params.tag) !== -1
  );
  return <PostSummaryList data={tagPosts}></PostSummaryList>;
});

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const posts = await getBlogContents();
  const tags = Array.from(new Set(posts.map(({ tags }) => tags).flat()));
  return {
    params: tags.map((tag) => {
      return { tag };
    }),
  };
};
