import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodePolyfills from "rollup-plugin-node-polyfills";
import dts from "rollup-plugin-dts";
import pkg from "./package.json";

import { yoniusRollup } from "./js/rollup/plugins";

const nodePath = process.env.NODE_PATH
    ? process.platform === "win32"
        ? process.env.NODE_PATH.split(/;/)
        : process.env.NODE_PATH.split(/:/)
    : null;
const banner =
    "/**\n" +
    ` * Yonius ${pkg.version}.\n` +
    " *\n" +
    ` * Copyright (c) 2008-${new Date().getFullYear()} Hive Solutions Lda.\n` +
    " *\n" +
    " * This source code is licensed under the Apache 2.0 license found in the\n" +
    " * LICENSE file in the root directory of this source tree.\n" +
    " */";

export default [
    {
        input: "js/index.js",
        output: {
            name: "yonius",
            file: pkg.browser,
            banner: banner,
            format: "umd",
            exports: "named",
            sourcemap: true
        },
        plugins: [
            json(),
            yoniusRollup(),
            nodePolyfills(),
            resolve({
                customResolveOptions: {
                    paths: nodePath
                }
            }),
            commonjs(),
            babel({
                babelrc: false,
                babelHelpers: "bundled",
                presets: ["@babel/preset-env"]
            })
        ]
    },
    {
        input: "js/index.js",
        external: ["node-fetch", "fs", "process", "path"],
        output: [
            {
                file: pkg.main,
                banner: banner,
                format: "cjs",
                exports: "named",
                sourcemap: true
            },
            {
                file: pkg.module,
                banner: banner,
                format: "es",
                sourcemap: true
            }
        ],
        plugins: [
            json(),
            commonjs(),
            resolve({
                customResolveOptions: {
                    paths: nodePath
                }
            })
        ]
    },
    {
        input: "types/index.d.ts",
        output: [{ file: "dist/yonius.d.ts", format: "es" }],
        plugins: [dts()]
    }
];
