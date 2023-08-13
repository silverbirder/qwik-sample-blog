import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { LuRocket } from "@qwikest/icons/lucide";
import { PostSummary } from "../../../models";

import styles from "./post-summary-list-item.css?inline";

export const PostSummaryListItem = component$(
  ({ title, description, permalink, tags, date, published }: PostSummary) => {
    useStylesScoped$(styles);
    if (!published) return <></>;
    return (
      <a href={permalink} class="post-summary-list-item">
        <LuRocket />
        <h2 class="title">{title}</h2>
        <p class="date">{date}</p>
        <p class="tags">{tags.join(",")}</p>
        <p class="summary">{description}</p>
      </a>
    );
  }
);
