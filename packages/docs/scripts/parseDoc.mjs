import { parseFile } from "@orama/plugin-parsedoc";
import { globby } from "globby";
import { readFileSync, writeFileSync } from "fs";

async function parseDoc() {
  const files = await globby("src/**/*.md");
  const textForSearch = await Promise.all(
    files.map(async (file) => {
      const readFileData = readFileSync(file, "utf8");
      const parsedData = await parseFile(readFileData, "md");
      const contents = parsedData
        .filter((d) => d.type !== "a" && d.type !== "code")
        .map((item) => {
          if (
            item.path === "root[1].html[1].body[1]" &&
            item.content.startsWith("title:")
          ) {
            return item.content.split("title:")[1].split("published")[0].trim();
          } else {
            return item.content;
          }
        });
      return {
        f: file,
        c: Array.from(new Set(contents)),
      };
    })
  );
  writeFileSync("./src/search.json", JSON.stringify(textForSearch));
}

parseDoc();
