import { component$, useStylesScoped$, Slot } from "@builder.io/qwik";
import { css } from "~/styled-system/css";

export interface ButtonProps {
  size?: "small" | "medium" | "large";
}
export const Button = component$<ButtonProps>(({ size = "medium" }) => {
  useStylesScoped$(`
    .size-small {
      font-size: 10px;
    }
    .size-medium {
      font-size: 14px;
    }
    .size-large {
      font-size: 18px;
    }
  `);
  return (
    <button
      class={css({
        padding: 10,
        bg: "red.400",
        height: "dvh",
        margin: 100,
        fontSize: 30,
      })}
    >
      <Slot></Slot>
    </button>
  );
});
