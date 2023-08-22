import { component$ } from "@builder.io/qwik";
import { type PostSummary } from "~/models";
import { BsTag } from "@qwikest/icons/bootstrap";
import { HStack } from "~/styled-system/jsx";
import { css } from "~/styled-system/css";

export const PostSummaryListItem = component$(
  ({ title, permalink, tags, date, published }: PostSummary) => {
    if (!published) return <></>;
    return (
      <>
        <a href={permalink}>
          <h3>{title}</h3>
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
        {/* <p
          class={css({
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          })}
        >
          {description}
        </p> */}
      </>
    );
  }
);
