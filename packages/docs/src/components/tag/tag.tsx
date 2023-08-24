import { component$ } from "@builder.io/qwik";
import { BsTag } from "@qwikest/icons/bootstrap";
import { css } from "~/styled-system/css";
import { HStack } from "~/styled-system/jsx";

export interface TagProps {
  name: string;
  url: string;
}

export const Tag = component$<TagProps>(({ name, url }) => {
  return (
    <div
      class={css({
        display: "inline-block",
      })}
    >
      <a href={url}>
        <HStack
          gap="1"
          class={css({
            backgroundColor: "bg.quote",
            borderRadius: "tag.main",
            padding: "2",
          })}
        >
          <BsTag class="icon" />
          <span
            class={css({
              fontWeight: "light",
              fontSize: "sm",
            })}
          >
            {name}
          </span>
        </HStack>
      </a>
    </div>
  );
});
