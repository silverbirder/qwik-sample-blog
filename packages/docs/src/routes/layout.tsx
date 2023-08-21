import { component$, Slot } from "@builder.io/qwik";
import { type RequestHandler } from "@builder.io/qwik-city";
import { Search } from "~/components/search/search";
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
    <div
      class={css({
        display: "grid",
        gridTemplateAreas: `
        "header"
        "content"
        "footer"`,
        gridTemplateRows: "auto 1fr auto",
        gridTemplateColumns: "1fr",
      })}
    >
      <header
        class={css({
          gridArea: "header",
          position: "sticky",
          top: 0,
          backdropFilter: "blur(23px) saturate(4.5)",
          zIndex: 1,
        })}
      >
        <h1>silverbirder's portfolio</h1>
      </header>
      <Container class={css({ gridArea: "content" })}>
        <Search />
        <Slot />
      </Container>
      <footer class={css({ gridArea: "footer", backgroundColor: "bg.quote" })}>
        <p>&copy; 2023 silverbirder's portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
});
