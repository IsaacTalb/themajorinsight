import fs from "node:fs/promises";
import path from "node:path";
import postcss from "postcss";
import { compile } from "tailwindcss";

async function sourceFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(location);
    return /\.(?:js|ts|jsx|tsx|mdx)$/.test(entry.name) ? location : [];
  }));
  return files.flat();
}

async function candidates() {
  const files = await sourceFiles(path.join(process.cwd(), "src"));
  const found = new Set();
  for (const file of files) {
    const source = await fs.readFile(file, "utf8");
    for (const match of source.matchAll(/["'`]([^"'`\n]+)["'`]/g)) {
      for (const token of match[1].split(/\s+/)) if (token) found.add(token);
    }
  }
  return [...found];
}

export default function tailwindPostcss() {
  return {
    postcssPlugin: "tailwindcss-local-compiler",
    async Once(root, { result }) {
      const from = result.opts.from ?? path.join(process.cwd(), "src/app/globals.css");
      const compiler = await compile(root.toString(), {
        base: path.dirname(from),
        loadStylesheet: async (id, base) => {
          const resolved = id === "tailwindcss"
            ? path.join(process.cwd(), "node_modules/tailwindcss/index.css")
            : id.startsWith(".") ? path.resolve(base, id) : path.join(process.cwd(), "node_modules", id);
          return { content: await fs.readFile(resolved, "utf8"), path: resolved, base: path.dirname(resolved) };
        }
      });
      const generated = compiler.build(await candidates());
      root.removeAll();
      root.append(postcss.parse(generated, { from }).nodes);
    }
  };
}

tailwindPostcss.postcss = true;
