import {
  component$,
  createContextId,
  Slot,
  useContextProvider,
} from "@builder.io/qwik";
import { PostSummary } from "@sb/ui/lib-types/models";
import data from "./posts.json";

interface BlogContents {
  posts: PostSummary[];
}

export const BlogContentsContext =
  createContextId<BlogContents>("blogContents");

export default component$(() => {
  useContextProvider(BlogContentsContext, { posts: data });
  return <Slot />;
});
