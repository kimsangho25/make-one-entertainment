import { copyFile, rm } from "node:fs/promises";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { build } from "vite";

const root = process.cwd();
const outputDirectory = path.resolve(root, "dist-preview");

await rm(outputDirectory, { recursive: true, force: true });

await build({
  configFile: false,
  base: "/make-one-entertainment/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(root, "src"),
    },
    extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  build: {
    outDir: outputDirectory,
  },
});

await copyFile(
  path.resolve(outputDirectory, "index.html"),
  path.resolve(outputDirectory, "404.html"),
);
