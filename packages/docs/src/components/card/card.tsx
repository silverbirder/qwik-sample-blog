import { component$ } from "@builder.io/qwik";
import { css } from "~/styled-system/css";
import { Image } from "@unpic/qwik";

export interface CardProps {
  name: string;
  image: string;
  description: string;
  width?: number;
  height?: number;
}

export const Card = component$<CardProps>(
  ({ name, image, description, width = 200, height = 200 }) => {
    return (
      <div
        class={css({
          display: "grid",
          gridTemplateRows:
            "minmax(50px, auto) minmax(200px, auto) minmax(50px, auto)",
        })}
      >
        <div>{name}</div>
        <div
          class={css({
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          {image && <Image src={image} width={width} height={height} />}
        </div>
        <div>
          <p>{description}</p>
        </div>
      </div>
    );
  }
);
