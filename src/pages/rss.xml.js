import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

export async function GET(context) {
  const blog = await getCollection("blogPosts");
  const sortedBlog = blog.sort(
    (a, b) => new Date(b.data.createdAt) - new Date(a.data.createdAt)
  );
  return rss({
    title: "Nick Khami's Blog",
    description:
      "Technical blog covering AI, cryptography, data analysis, and software development. Insights on building systems, tutorials, and lessons learned from production deployments.",
    site: context.site,
    items: sortedBlog.map((post) => ({
      title: post.data.title,
      link: `/posts/${post.id}/`,
      description: post.data.summary,
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
      pubDate: new Date(post.data.createdAt),
      ...(post.data.updatedAt && {
        lastModified: new Date(post.data.updatedAt),
      }),
      author: post.data.author,
      categories: post.data.categories,
      guid: `${context.site}blog/${post.id}/`,
    })),
    customData: `<language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
  });
}
