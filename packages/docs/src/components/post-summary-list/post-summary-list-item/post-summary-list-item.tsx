import { component$ } from "@builder.io/qwik";
import { PostSummary } from "~/models";
import { BsTag } from "@qwikest/icons/bootstrap";
import { HStack } from "~/styled-system/jsx";
import { css } from "~/styled-system/css";

export const PostSummaryListItem = component$(
  ({ title, description, permalink, tags, date, published }: PostSummary) => {
    if (!published) return <></>;
    return (
      <>
        <a href={permalink}>
          <h2>{title}</h2>
        </a>
        <p>{date}</p>
        <HStack>
          {tags.map((tag) => {
            return (
              <a href={`/blog/tags/${tag}`}>
                <HStack
                  key={tag}
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
        <p>{description}</p>
      </>
    );
  }
);
