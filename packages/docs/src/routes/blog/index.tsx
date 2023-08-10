import { component$ } from "@builder.io/qwik";
import { PostSummaryList } from "@sb/ui";
import data from "./index.json";

export default component$(() => {
  return <PostSummaryList data={data}></PostSummaryList>;
});
