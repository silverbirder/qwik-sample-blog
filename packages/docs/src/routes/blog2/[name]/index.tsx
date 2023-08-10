import { component$ } from "@builder.io/qwik";
import * as Blog from "@sb/content/src/blog";
import data from "../../blog/posts.json";
import { StaticGenerateHandler, useLocation } from "@builder.io/qwik-city";

export default component$(() => {
  const name = useLocation().params.name;
  //@ts-ignore
  const Content = Blog[name];
  return (
    <>
      <main class="main">
        <Content />
      </main>
    </>
  );
});

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: data.map(() => {
      return {
        name: "mfe",
      };
    }),
  };
};
