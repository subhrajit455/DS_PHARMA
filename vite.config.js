import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    // Add a dev-only mock endpoint for /getheading so the frontend can fetch marquee headings
    // without requiring a backend during local development.
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method === "GET" && req.url === "/getheading") {
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              data: [
                {
                  _id: "mock-1",
                  title: "✓ Welcome to DS Pharma",
                  active: true,
                  speed: "medium",
                  color: "#e94242",
                },
                {
                  _id: "mock-2",
                  title: "✓ Fast & Reliable Delivery",
                  active: true,
                  speed: "medium",
                  color: "#0b7285",
                },
              ],
            }),
          );
          return;
        }
        next();
      });
    },
  },
});
