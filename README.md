# Cosmic Explorer

A groundbreaking, interactive 3D space-themed project that serves as a dynamic exploration hub. Built with [Three.js](https://threejs.org/) and [Vite](https://vitejs.dev/).

## Features

-   **Interactive 3D Solar System:** Orbiting planets, a central sun, and a starry background.
-   **Planet Scanning:** Click on planets to reveal data about them.
-   **Dynamic Camera:** Immersive mouse-controlled camera movement.

## Getting Started

To run this project, you need [Node.js](https://nodejs.org/) installed on your machine.

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    This will start a local server (usually at `http://localhost:5173`). Open the link in your browser to view the project.

3.  **Build for Production:**
    ```bash
    npm run build
    ```
    This generates the production-ready files in the `dist/` directory.

## Troubleshooting

-   **"Did not work"?** ensure you are running the project via `npm run dev`. Opening `index.html` directly in the browser will not work due to browser security restrictions on ES modules (CORS).
