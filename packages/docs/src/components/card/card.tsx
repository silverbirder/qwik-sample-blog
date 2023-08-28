import { component$ } from "@builder.io/qwik";
import { css } from "~/styled-system/css";
import { Image } from "@unpic/qwik";

export interface CardProps {
  name: string;
  image: string;
  description: string;
}

export const Card = component$<CardProps>(({ name, image, description }) => {
  return (
    <div
      class={css({
        display: "grid",
        gridTemplateRows: "max-content 200px 1fr",
        maxWidth: 200,
      })}
    >
      <div class={css({ textStyle: "h4" })}>{name}</div>
      <Image
        src={image}
        class={css({
          objectFit: "contain",
          width: "100%",
          height: "100%",
        })}
        width={200}
        height={200}
        layout="constrained"
        alt="A lovely bath"
      />
      <div>
        <p>{description}</p>
      </div>
    </div>
  );
});
