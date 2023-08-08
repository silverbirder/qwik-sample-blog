import { component$, useContext } from "@builder.io/qwik";
import { BlogContentsContext } from "../layout";

export default component$(() => {
  const { posts } = useContext(BlogContentsContext);
  const tags = posts.map(({ tags }) => tags).flat();
  const tagCount = tags.reduce((acc, cur) => {
    acc[cur] = (acc[cur] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
  return (
    <ul>
      {Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .map(([tag, count]) => {
          return (
            <li>
              <a key={tag} href={`/blog/tags/${tag}`}>
                {tag} ({count})
              </a>
            </li>
          );
        })}
    </ul>
  );
});
