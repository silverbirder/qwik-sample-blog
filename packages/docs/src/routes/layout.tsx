import { component$, Slot } from "@builder.io/qwik";
import { Link, type RequestHandler } from "@builder.io/qwik-city";
import { css } from "~/styled-system/css";
import { Container, HStack } from "~/styled-system/jsx";
import { BsGithub, BsTwitter } from "@qwikest/icons/bootstrap";
import { hstack } from "~/styled-system/patterns";

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
        class={[
          css({
            gridArea: "header",
            position: "sticky",
            backgroundColor: "bg.quote",
            top: 0,
            zIndex: 1,
            backdropFilter: "blur(23px) saturate(4.5)",
          }),
          hstack({
            justifyContent: "space-between",
          }),
        ]}
      >
        <h1>silverbirder's portfolio</h1>
        <HStack>
          <a href="https://github.com/silverbirder" target="_brank">
            <BsGithub
              class={css({ width: "icon.main", height: "icon.main" })}
            />
          </a>
          <a href="https://x.com/silverbirder" target="_brank">
            <BsTwitter
              class={css({ width: "icon.main", height: "icon.main" })}
            />
          </a>
        </HStack>
      </header>
      <Container class={css({ gridArea: "content" })}>
        <Slot />
      </Container>
      <footer
        class={css({
          gridArea: "footer",
          backgroundColor: "bg.quote",
          display: "flex",
          placeContent: "center",
        })}
      >
        <p>&copy; 2023 silverbirder's portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
});
