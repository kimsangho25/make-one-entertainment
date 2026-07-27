import { copyFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { build } from "vite";

const root = process.cwd();
const outputDirectory = path.resolve(root, "dist");

await rm(outputDirectory, { recursive: true, force: true });

await build({
  configFile: false,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(root, "src"),
    },
    extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  build: {
    outDir: path.resolve(outputDirectory, "client"),
    emptyOutDir: false,
  },
});

await mkdir(path.resolve(outputDirectory, "server"), { recursive: true });
await copyFile(
  path.resolve(root, "worker", "sites-index.js"),
  path.resolve(outputDirectory, "server", "index.js"),
);
