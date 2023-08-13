import { component$, Slot } from "@builder.io/qwik";
import Index from "./index.json";

export default component$(() => {
  return (
    <>
      <Slot />
      <ul>
        {Index.items.map((item) => {
          return <li key={item.name}>{item.name}</li>;
        })}
      </ul>
    </>
  );
});
