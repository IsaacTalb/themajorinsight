export async function GET() {
  const body = [
    "# The Major Insight ads.txt",
    "# Configure approved ad sellers here before enabling monetization.",
    ""
  ].join("\n");
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
