import pkg from "./package.json" assert { type: "json" };

import { readdirSync, readFileSync } from "fs";
import path from "path";

import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import inject from "@rollup/plugin-inject";
import globals from "rollup-plugin-node-globals";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import css from "rollup-plugin-import-css";
import htmlTemplate from "rollup-plugin-generate-html-template";
import copy from "rollup-plugin-copy";

import dev from "rollup-plugin-dev";
import dotenv from "dotenv";

dotenv.config({ path: ".dev.vars" });

const build = process.env.BUILD ?? "browser";
const isBrowser = build === "browser";
const isNpm = build === "npm";
const isServer = process.env.SERVER ?? false;

const bannerMessage = readFileSync("./LICENSE")
    .toString()
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => " * " + line)
    .join("\n");

const banner = `/**!
${bannerMessage}
 */`;

const exampleDist = isServer ? "example/.dist" : "example/dist";

export default [
    // Main Tebex.js build
    {
        input: "src/index.ts",
        plugins: [
            nodeResolve(),
            commonjs(), // required for zoid
            globals(), // required for zoid
            inject({
                // required for zoid
                include: "node_modules/zoid/**/*",
                window: path.resolve("src/stubs/window.ts"),
            }),
            replace({
                // required for zoid support in nuxt
                // Nuxt tries to change instances of "global" to "globalThis", however it's a little overzealous
                // It ends up breaking zoid/postrobot since it replaces a local variable named "global" inside the getWildcard function
                // This particular line in Nuxt is the culprit:
                // https://github.com/nuxt/nuxt/blob/a69751b96d35b0b2a4d7674652c604e45370f60c/packages/vite/src/vite.ts#L243
                include: "node_modules/zoid/**/*",
                values: {
                    "var global = global_getGlobal();": "var zoidGlobal = global_getGlobal();",
                    "global.WINDOW_WILDCARD": "zoidGlobal.WINDOW_WILDCARD"
                },
                delimiters: ["", ""]
            }),
            typescript({
                outputToFilesystem: true,
                exclude: "tests/**/*",
                compilerOptions: {
                    rootDir: "src",
                    declaration: true,
                    declarationDir: "dist/types",
                },
                sourceMap: isBrowser,
            }),
            // Annoying: Vite/Vitest only includes CSS imports as strings if you append ?inline to their path... which breaks rollup-plugin-import-css
            // This just strips the ?inline from th end of those paths so that it works again :)
            {
                name: "inline-css-fixer",
                resolveId(source, importer, options) {
                    if (source.endsWith(".css?inline"))
                        return this.resolve(
                            source.replace("?inline", ""),
                            importer,
                            options
                        );
                },
            },
            css({
                minify: true,
            }),
            replace({
                preventAssignment: true,
                __VERSION__: JSON.stringify(pkg.version),
            }),
        ],
        output: [
            // browser-only build
            isBrowser && {
                banner,
                file: "dist/tebex.min.js",
                format: "iife",
                name: "Tebex",
                exports: "named",
                sourcemap: true,
                plugins: [terser()],
            },
            // NPM ES module build
            isNpm && {
                banner,
                file: "dist/tebex.mjs",
                format: "es",
                name: "Tebex",
                exports: "named",
            },
            // NPM legacy build (commonJS, AMD, iife)
            isNpm && {
                banner,
                file: "dist/tebex.cjs",
                format: "umd",
                name: "Tebex",
                exports: "named",
            },
        ].filter(Boolean),
    },
    // Example build
    {
        input: "example/index.js",
        output: [
            {
                // Use a different output file for local server builds to preven accidentally overriding the build
                // when running locally
                file: `${exampleDist}/index.js`,
            },
        ],
        plugins: [
            nodeResolve(),
            commonjs(),
            replace({
                preventAssignment: true,
                __CHECKOUT_ENDPOINT__: `"${
                    process.env.CHECKOUT_HOST_ENDPOINT || "https://pay.tebex.io"
                }"`,
                __PORTAL_ENDPOINT__: `"${
                    process.env.PORTAL_HOST_ENDPOINT || "https://portal.tebex.io"
                }"`,
            }),
            copy({
                targets: [{ src: ["./example/*", '!./example/*.html', '!./example/index.js', '!./example/dist'], dest: exampleDist }],
            }),
            htmlTemplate({
                template: "example/index.html",
                target: `${exampleDist}/index.html`,
                attrs: ["defer"],
            }),
            htmlTemplate({
                template: "example/components.html",
                target: `${exampleDist}/components.html`,
                attrs: ["defer"],
            }),
            isServer &&
                dev({
                    silent: true,
                    host: "localhost",
                    port: "8080",
                    dirs: ["dist", "example/.dist"],
                    // Proxy all function routes through to locally running cloudflare pages instance
                    proxy: readdirSync("./functions")
                        .map((p) => path.parse(p).name)
                        .map((route) => ({
                            from: `/${route}`,
                            to: `http://localhost:8787/${route}`,
                        })),
                    // We silence the default rollup server + wrangler console output
                    onListen: (server) => {
                        const port = server.server._connectionKey
                            .split(":")
                            .at(-1);
                        console.log(`\x1b[34m`);
                        console.log(``);
                        console.log(``);
                        console.log(`Tebex.js demo server is running!`);
                        console.log(`Preview it at http://localhost:${port}`);
                        console.log(``);
                        console.log(``);
                        console.log(``);
                    },
                }),
        ].filter(Boolean),
    },
];
