# Bun Web Framework with React and Svelte Support

This project is a simple web framework built using Bun. It supports serving front-end applications created with React and Svelte, and includes a basic routing mechanism with dynamic route capabilities.

## Project Structure

```
.
├── public/               # Static assets accessible by the Bun server (if any directly served)
├── react-app/            # React frontend application
│   ├── dist/             # Build output for the React app
│   ├── src/
│   │   ├── App.tsx       # Main React app component
│   │   └── main.tsx      # React entry point
│   ├── index.html        # Main HTML for React app
│   └── package.json
├── svelte-app/           # Svelte frontend application
│   ├── dist/             # Build output for the Svelte app (main.js)
│   ├── src/
│   │   ├── App.svelte    # Main Svelte app component
│   │   └── main.ts       # Svelte entry point
│   ├── index.html        # Main HTML for Svelte app
│   └── package.json
├── src/                  # Server-side Bun application
│   └── index.ts          # Main Bun server and routing logic
├── package.json          # Root package.json (if any, for overall project scripts - currently none)
└── README.md
```

## Prerequisites

*   [Bun](https://bun.sh/) (check project for specific version if issues arise, but latest stable is recommended)

## Setup and Installation

1.  **Clone the repository (if applicable).**

2.  **Install dependencies for the React app:**
    ```bash
    cd react-app
    bun install
    cd ..
    ```

3.  **Install dependencies for the Svelte app:**
    ```bash
    cd svelte-app
    bun install
    cd ..
    ```

## Building Frontend Applications

1.  **Build the React app:**
    This will generate static assets in `react-app/dist/`.
    ```bash
    cd react-app
    bun run build
    cd ..
    ```

2.  **Build the Svelte app:**
    This will generate static assets in `svelte-app/dist/`.
    ```bash
    cd svelte-app
    bun run build
    cd ..
    ```

## Running the Application

1.  **Ensure both frontend applications are built first** (see "Building Frontend Applications" above). The Bun server serves the *built* static assets.

2.  **Start the Bun server:**
    ```bash
    bun src/index.ts
    ```
    The server will start, typically on `http://localhost:3000`.

## Available Routes

*   **`/`**: Welcome message from the Bun framework.
*   **`/hello`**: Simple "Hello" message from the router.
*   **`/users/:id`**: Dynamic route example (e.g., `/users/testuser`).
*   **`/posts/:year/:month`**: Dynamic route example (e.g., `/posts/2024/03`).
*   **`/react`**: Serves the React application.
    *   The React app fetches data from `/api/react-data`.
*   **`/svelte`**: Serves the Svelte application.
    *   The Svelte app fetches data from `/api/svelte-data`.
*   **`/api/react-data`**: API endpoint for the React app.
*   **`/api/svelte-data`**: API endpoint for the Svelte app.

Any other route will return a "Not Found" 404 error.

## Development

### Frontend Apps

*   **React:** Navigate to `react-app` and run `bun run dev` (or as per its `package.json`) for the React development server with hot reloading. Note that this will typically run on a different port than the main Bun server. For integrated testing, you'll need to build the React app and run the main Bun server.
*   **Svelte:** Navigate to `svelte-app` and run `bun run dev` (or `bun run build --watch`) for Svelte development with automatic rebuilding. Like React, this is separate from the main Bun server.

### Bun Server
If you make changes to `src/index.ts`, you'll need to restart the Bun server (`bun src/index.ts`). Bun supports hot reloading for the server as well, which might be active by default depending on the version and how it's run.

## Adding New Routes

1.  Open `src/index.ts`.
2.  Add a new route object to the `routes` array. A route object has:
    *   `path`: A `RegExp` to match the URL pathname. Use named capture groups for dynamic parameters (e.g., `/(?<id>[a-zA-Z0-9_]+)/`).
    *   `handler`: A function that takes `(req: Request, params?: Record<string, string>)` and returns a `Response`.
3.  Place your new route in the desired order of precedence within the `routes` array. More specific routes should generally come before more general ones.

## Extending Frontend Applications

*   **React:** Modify files within `react-app/src/`. Rebuild the app to see changes served by the main Bun server.
*   **Svelte:** Modify files within `svelte-app/src/`. Rebuild the app to see changes served by the main Bun server.
