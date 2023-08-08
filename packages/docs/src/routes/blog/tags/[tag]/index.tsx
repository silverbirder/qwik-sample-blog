import { component$, useContext } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { BlogContentsContext } from "../../layout";
import { PostSummaryList } from "@sb/ui";

export default component$(() => {
  const loc = useLocation();
  const { posts } = useContext(BlogContentsContext);
  const tagPosts = posts.filter(
    (post) => post.tags.indexOf(loc.params.tag) !== -1
  );
  return <PostSummaryList data={tagPosts}></PostSummaryList>;
});
