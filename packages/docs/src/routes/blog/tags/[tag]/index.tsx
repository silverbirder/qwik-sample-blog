import { component$, useContext } from "@builder.io/qwik";
import { StaticGenerateHandler, useLocation } from "@builder.io/qwik-city";
import { BlogContentsContext } from "../../layout";
import { PostSummaryList } from "@sb/ui";
import data from "../../posts.json";

export default component$(() => {
  const loc = useLocation();
  const { posts } = useContext(BlogContentsContext);
  const tagPosts = posts.filter(
    (post) => post.tags.indexOf(loc.params.tag) !== -1
  );
  return <PostSummaryList data={tagPosts}></PostSummaryList>;
});

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const tags = Array.from(new Set(data.map(({ tags }) => tags).flat()));
  return {
    params: tags.map((tag) => {
      return { tag };
    }),
  };
};
