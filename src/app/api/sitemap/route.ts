import { NextResponse } from "next/server";

const routes = [{ path: "/", changefreq: "daily", priority: 1.0 }];

export async function GET(): Promise<NextResponse> {
  try {
    const baseUrl = "https://ervin-memorylane.vercel.app";

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${routes
          .map(
            (route) => `
          <url>
            <loc>${baseUrl}${route.path}</loc>
            <changefreq>${route.changefreq}</changefreq>
            <priority>${route.priority}</priority>
          </url>
        `,
          )
          .join("")}
      </urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
