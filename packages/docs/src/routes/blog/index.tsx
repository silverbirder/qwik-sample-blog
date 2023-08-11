import { component$ } from "@builder.io/qwik";
import { PostSummaryList } from "@sb/ui";
import data from "./index.json";

export default component$(() => {
  return (
    <main class="main">
      <PostSummaryList data={data}></PostSummaryList>
    </main>
  );
});
