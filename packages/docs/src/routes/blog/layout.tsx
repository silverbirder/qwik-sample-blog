import { component$, Slot } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { css } from "~/styled-system/css";
import { Container } from "~/styled-system/jsx";

export default component$(() => {
  return (
    <Container
      class={css({
        display: "grid",
        gridTemplateAreas: {
          base: `"nav content"`,
          mdDown: `"content"`,
        },
        gridTemplateRows: "1fr",
        gridTemplateColumns: {
          base: "auto 1fr",
          mdDown: "1fr",
        },
      })}
    >
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
    </Container>
  );
});
