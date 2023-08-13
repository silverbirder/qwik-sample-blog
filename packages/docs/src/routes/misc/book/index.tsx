import { component$ } from "@builder.io/qwik";
import Index from "./index.json";

export default component$(() => {
  return (
    <ul>
      {Index.map((item) => {
        return <li key={item.title}>{item.title}</li>;
      })}
    </ul>
  );
});
