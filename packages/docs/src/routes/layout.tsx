import { component$, Slot } from "@builder.io/qwik";
import { Link, type RequestHandler } from "@builder.io/qwik-city";
import { css } from "~/styled-system/css";
import { Container } from "~/styled-system/jsx";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  return (
    <Container
      class={css({
        display: "grid",
        gridTemplateAreas: {
          base: `
          "header header"
          "nav content"
          "footer footer"`,
          mdDown: `
              "header"
              "content"
              "footer"`,
        },
        gridTemplateRows: {
          base: "auto 1fr",
          mdDown: "auto",
        },
        gridTemplateColumns: "auto 1fr auto",
      })}
    >
      <header class={css({ gridArea: "header" })}>
        <h1>silverbirder's portfolio</h1>
      </header>
      <nav class={css({ gridArea: "nav", hideBelow: "md" })}>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
          </li>
          <li>
            <Link href="/resume">Resume・Skill</Link>
          </li>
          <li>
            <a href="/misc">Misc</a>
          </li>
        </ul>
      </nav>
      <main class={css({ gridArea: "content" })}>
        <Slot />
      </main>
      <footer class={css({ gridArea: "footer" })}>
        <p>&copy; 2023 silverbirder's portfolio. All rights reserved.</p>
      </footer>
    </Container>
  );
});
