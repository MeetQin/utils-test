import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { defineConfig } from "rollup";
import path from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import babel from "@rollup/plugin-babel";
const mode = process.env.MODE;
const isProd = mode === "prod";
console.log(isProd, "isProd");
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url)).toString()
);
export default defineConfig({
  input: path.resolve(__dirname, "./src/index.ts"),
  output: [
    {
      file: path.resolve(__dirname, pkg.main),
      format: "cjs",
    },
    {
      file: path.resolve(__dirname, pkg.module),
      format: "esm",
      exports: "named",
      name: pkg.name,
      extend: true,
    },
    {
      file: path.resolve(__dirname, "lib/utilsTest.global.js"),
      name: pkg.name,
      format: "iife",
      extend: true,
    },
  ],
  plugins: [
    commonjs(),
    typescript({
      outDir: "lib",
      declaration: true,
      declarationDir: "lib",
    }),
    nodeResolve({
      extensions: [".mjs", ".js", ".json", ".ts"],
    }),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "bundled",
    }),
  ],
});
