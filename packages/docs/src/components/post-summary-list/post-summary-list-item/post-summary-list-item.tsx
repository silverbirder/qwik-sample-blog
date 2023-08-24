import { component$ } from "@builder.io/qwik";
import { type PostSummary } from "~/models";
import { BsTag } from "@qwikest/icons/bootstrap";
import { HStack } from "~/styled-system/jsx";
import { css } from "~/styled-system/css";

export const PostSummaryListItem = component$(
  ({ title, permalink, description, tags, date, published }: PostSummary) => {
    if (!published) return <></>;
    return (
      <div
        class={css({
          width: "70vw",
        })}
      >
        <a href={permalink}>
          <div class={css({ textStyle: "h4" })}>{title}</div>
        </a>
        <p>{date}</p>
        <HStack
          class={css({
            flexWrap: "wrap",
          })}
        >
          {tags.map((tag) => {
            return (
              <a href={`/blog/tags/${tag}`} key={tag}>
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
                    {tag}
                  </span>
                </HStack>
              </a>
            );
          })}
        </HStack>

        <p
          class={css({
            borderColor: "bg.quote",
            borderWidth: "medium",
            borderRadius: "base",
          })}
        >
          {description}...
        </p>
      </div>
    );
  }
);
