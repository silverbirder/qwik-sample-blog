import { component$, Slot } from "@builder.io/qwik";
import Index from "./index.json";
import { css } from "~/styled-system/css";

export default component$(() => {
  return (
    <>
      <Slot />
      <div
        class={css({
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 20,
        })}
      >
        {Index.items.map((item) => {
          return (
            <div
              key={item.name}
              class={css({
                display: "grid",
                gridTemplateRows: "max-content 200px 1fr",
              })}
            >
              <header>
                <h2>{item.name}</h2>
              </header>
              <img
                src={item.image}
                class={css({
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                })}
                width={200}
                height={200}
              />
              <div>
                <p>{item.results}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
});
