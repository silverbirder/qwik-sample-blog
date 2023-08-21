import { component$, $, useSignal, noSerialize } from "@builder.io/qwik";
import search from "~/search.json";
import Fuse from "fuse.js";

export interface SearchProps {}

const fuse = noSerialize(new Fuse(search, { keys: ["c"] }));

export const Search = component$<SearchProps>(() => {
  const keyword = useSignal<string>("");
  const contents = useSignal<string[]>([]);
  const onClick = $(() => {
    const results = fuse?.search(keyword.value);
    contents.value = results?.map((r) => r.item.f) || [];
  });
  return (
    <>
      <input name="keyword" bind:value={keyword} />
      <button onClick$={onClick}>search</button>
      {contents.value.map((content, index) => (
        <div key={index}>{content}</div>
      ))}
    </>
  );
});
