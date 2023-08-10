/**
 * WHAT IS THIS FILE?
 *
 * SSR entry point, in all cases the application is rendered outside the browser, this
 * entry point will be the common one.
 *
 * - Server (express, cloudflare...)
 * - npm run start
 * - npm run preview
 * - npm run build
 *
 */
import {
  renderToStream,
  type RenderToStreamOptions,
} from "@builder.io/qwik/server";
import { manifest } from "@qwik-client-manifest";
import Root from "./root";
import fs from "fs";
import { DocumentHeadProps } from "@builder.io/qwik-city";
import { asyncMap } from "./util";

export default async function (opts: RenderToStreamOptions) {
  const modules = await import.meta.glob("/src/blog/*.mdx");
  const posts = (
    await asyncMap(Object.keys(modules), async (path) => {
      const data = (await modules[path]()) as DocumentHeadProps;
      return {
        title: data.head.title || "",
        description:
          data.head.meta.find((m) => m.name === "description")?.content || "",
        permalink: path
          .replace(/^\/src\/routes/, "")
          .replace(/\/index.mdx$/, "/"),
        date: data.head.frontmatter.date,
        tags: data.head.frontmatter.tags,
        published: data.head.frontmatter.published,
      };
    })
  ).sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
  fs.writeFileSync("posts.json", JSON.stringify(posts));
  return renderToStream(<Root />, {
    manifest,
    ...opts,
    // Use container attributes to set attributes on the html tag.
    containerAttributes: {
      lang: "en-us",
      ...opts.containerAttributes,
    },
  });
}
