import unified from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import remark2rehype from "remark-rehype";
import rehypePrism from "@mapbox/rehype-prism";
import html from "rehype-stringify";

// This seems to be the minimum required to convert markdown to HTML
// in a safe way (no HTML allowed withing markdown)

// I was going to use remark-html as seen in
// but the npmjs page https://www.npmjs.com/package/remark-html
// suggested I used remark-hype directly
// so I followed the example there https://github.com/remarkjs/remark-rehype

// later I added gfm, remark-gfm to render markdown tables as HTML tables

const processor = unified()
  .use(markdown)
  .use(gfm)
  .use(remark2rehype)
  .use(rehypePrism)
  .use(html);

export async function markdownToHtml(md: string) {
  return (await processor.process(md)).contents as string;
}
