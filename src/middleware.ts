import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Old URLs that should return 410 Gone
const gonePatterns = [
  // Location-based mobile app development pages
  /^\/mobile-app-development(\/.*)?$/,
  // Old blog posts
  /^\/blog\/why-your-business-needs-to-switch-from-wordpress-to-svelteKit-for-a-competitive-edge$/,
  /^\/blog\/passion-and-experience-versus-price-when-hiring-a-software-developer$/,
  // Old article categories
  /^\/articles\/(business-efficiency|customer-engagement|user-engagement|seo)$/,
  // Old service/topic pages
  /^\/app-development-costs\/.*/,
  /^\/website-optimisation\/.*/,
  /^\/bespoke-mobile-apps\/.*/,
  /^\/legal-tech\/.*/,
  /^\/services\/mobile-application-development$/,
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the URL matches any of the gone patterns
  for (const pattern of gonePatterns) {
    if (pattern.test(pathname)) {
      return new NextResponse(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Removed - Solve With Software</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #f9fafb;
      color: #374151;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      font-size: 4rem;
      margin: 0;
      color: #9ca3af;
    }
    p {
      font-size: 1.125rem;
      margin: 1rem 0;
    }
    a {
      color: #2563eb;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>410</h1>
    <p>This page has been permanently removed.</p>
    <p><a href="/">Visit our homepage</a> to explore our latest content.</p>
  </div>
</body>
</html>`,
        {
          status: 410,
          headers: {
            "Content-Type": "text/html",
          },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match old URL patterns
    "/mobile-app-development/:path*",
    "/blog/:path*",
    "/articles/:path*",
    "/app-development-costs/:path*",
    "/website-optimisation/:path*",
    "/bespoke-mobile-apps/:path*",
    "/legal-tech/:path*",
    "/services/:path*",
  ],
};
