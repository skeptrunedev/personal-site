export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const acceptHeader = request.headers.get("accept") || "";

    const blogPostMatch = url.pathname.match(/^\/posts\/([^\/]+)\/?$/);
    if (blogPostMatch && acceptHeader.includes("text/plain")) {
      const slug = blogPostMatch[1];

      const slugToFile = {
        "using-git-worktrees-with-ai": "UsingGitWorktreesWithAI.mdx",
        "git-worktrees-agents-and-tmux": "UsingGitWorktreesWithAI.mdx",
        "how-to-use-midjourney": "HowToUseMidjourney.mdx",
        "taking-dkg-from-papers-to-production":
          "TakingDKGFromPapersToProduction.mdx",
        "building-the-server-for-threshold-multisigs":
          "MakingTheServerForThresholdMultisigs.mdx",
        "jukebox-hacker-news": "JukeboxAnalysis.mdx",
        "doing-the-little-things": "DoingTheLittleThings.mdx",
        "llm-over-dns": "LLMOverDNS.mdx",
      };

      const filename = slugToFile[slug];
      if (filename) {
        try {
          const mdxResponse = await fetch(
            `${url.origin}/content/blog-posts/${filename}`,
            {
              cf: { cacheTtl: 3600 }, // Cache for 1 hour
            }
          );

          if (mdxResponse.ok) {
            const mdxContent = await mdxResponse.text();

            const contentWithoutFrontmatter = mdxContent.replace(
              /^---[\s\S]*?---\n/,
              ""
            );

            return new Response(contentWithoutFrontmatter, {
              headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "public, max-age=3600",
              },
            });
          }
        } catch (error) {
          console.error("Error fetching MDX file:", error);
        }
      }
    }

    // For all other requests, fetch from origin
    return fetch(request);
  },
};
