import { component$ } from "@builder.io/qwik";
import MFE from "@sb/content/src/blog/mfe.mdx";
import PostJson from "@sb/content/posts.json";
import { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return <MFE></MFE>;
});

export const head: DocumentHead = () => {
  return {
    title: PostJson[0].title,
  };
};
