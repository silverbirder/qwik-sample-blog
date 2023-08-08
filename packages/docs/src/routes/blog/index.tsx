import { component$, useContext } from "@builder.io/qwik";
import { PostSummaryList } from "@sb/ui";
import { BlogContentsContext } from "./layout";

export default component$(() => {
  const { posts } = useContext(BlogContentsContext);
  return <PostSummaryList data={posts}></PostSummaryList>;
});
