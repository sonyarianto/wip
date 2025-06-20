import { join } from 'path'; // resolve is not used, join is fine

interface Route {
  path: RegExp;
  handler: (req: Request, params?: Record<string, string>) => Response | Promise<Response>;
}

const routes: Route[] = [
  {
    path: /^\/$/,
    handler: () => new Response("Welcome to the Bun Framework!"),
  },
  {
    path: /^\/hello$/,
    handler: () => new Response("Hello from the router!"),
  },
  {
    path: /^\/users\/(?<id>[a-zA-Z0-9_]+)$/,
    handler: (req, params) => {
      if (params && params.id) {
        return new Response(`User ID: ${params.id}`);
      }
      return new Response("User ID not found", { status: 400 });
    },
  },
  {
    path: /^\/posts\/(?<year>\d{4})\/(?<month>\d{2})$/,
    handler: (req, params) => {
      if (params && params.year && params.month) {
        return new Response(`Posts from Year: ${params.year}, Month: ${params.month}`);
      }
      return new Response("Year or month not found", { status: 400 });
    },
  },
  {
    path: /^\/api\/react-data$/,
    handler: () => {
      console.log("API call to /api/react-data");
      return new Response(JSON.stringify({ message: "Hello from Bun backend for React!" }), {
        headers: { 'Content-Type': 'application/json' },
      });
    },
  },
  // New API endpoint for Svelte app
  {
    path: /^\/api\/svelte-data$/,
    handler: () => {
      console.log("API call to /api/svelte-data");
      return new Response(JSON.stringify({ message: "Hello from Bun backend for Svelte!" }), {
        headers: { 'Content-Type': 'application/json' },
      });
    },
  },
];

const REACT_APP_DIST_DIR = '/app/react-app/dist';
const SVELTE_APP_INDEX_HTML = '/app/svelte-app/index.html';
const SVELTE_APP_DIST_DIR = '/app/svelte-app/dist';

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;
    console.log(`\nIncoming request: ${pathname}`);

    // Check API and predefined routes first
    for (const route of routes) {
      const match = route.path.exec(pathname);
      if (match) {
        console.log(`Matched predefined route: ${route.path}`);
        const params = match.groups;
        return route.handler(req, params);
      }
    }

    // Static file serving for React app
    if (pathname.startsWith('/react')) {
      console.log("Attempting to serve static file for /react path...");
      let relativePath = pathname.substring('/react'.length);
      if (relativePath.startsWith('/')) relativePath = relativePath.substring(1);
      if (relativePath === '') relativePath = 'index.html';

      const fullPath = join(REACT_APP_DIST_DIR, relativePath);
      console.log(`  React: Calculated fullPath: "${fullPath}"`);
      const file = Bun.file(fullPath);
      if (await file.exists()) {
        console.log(`  React: Serving static file: ${fullPath}`);
        return new Response(file);
      }

      console.log(`  React: Static file not found: ${fullPath}. Attempting SPA fallback.`);
      const indexPath = join(REACT_APP_DIST_DIR, 'index.html');
      const indexFile = Bun.file(indexPath);
      if (await indexFile.exists()) {
        console.log(`  React: Serving SPA fallback: ${indexPath}`);
        return new Response(indexFile);
      }
      console.log(`  React: SPA fallback index.html also not found at: ${indexPath}`);
    }

    // Static file serving for Svelte app
    if (pathname === '/svelte' || pathname === '/svelte/') {
      console.log("Attempting to serve Svelte index.html");
      const file = Bun.file(SVELTE_APP_INDEX_HTML);
      if (await file.exists()) {
        console.log(`  Svelte: Serving index.html: ${SVELTE_APP_INDEX_HTML}`);
        return new Response(file, { headers: { 'Content-Type': 'text/html' } });
      }
      console.log(`  Svelte: index.html not found at ${SVELTE_APP_INDEX_HTML}`);
    }

    if (pathname.startsWith('/svelte/')) {
      const assetName = pathname.substring('/svelte/'.length);
      // Serve main.js (CSS is likely injected by this JS for simple builds)
      if (assetName === 'main.js') {
        const fullPath = join(SVELTE_APP_DIST_DIR, assetName);
        console.log(`  Svelte: Attempting to serve asset: ${fullPath}`);
        const file = Bun.file(fullPath);
        if (await file.exists()) {
          console.log(`  Svelte: Serving asset ${assetName} with type application/javascript`);
          return new Response(file, { headers: { 'Content-Type': 'application/javascript' } });
        }
        console.log(`  Svelte: Asset not found: ${fullPath}`);
      }
      // No separate bundle.css to serve with this build configuration
    }

    console.log(`No route matched or static file found for: ${pathname}`);
    return new Response("Not Found", { status: 404 });
  },
  error(error) {
    console.error("Bun server error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

console.log(`Listening on http://localhost:${server.port} ...`);
