import { component$ } from "@builder.io/qwik";
import Index from "./index.json";

export default component$(() => {
  return (
    <ul>
      {Index.items.map((item) => {
        return <li>{item.name}</li>;
      })}
    </ul>
  );
});
