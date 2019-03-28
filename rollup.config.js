import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import globals from "rollup-plugin-node-globals";
import builtins from "rollup-plugin-node-builtins";
import pkg from "./package.json";

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
        external: ["node-fetch"],
        output: {
            name: "yonius",
            file: pkg.browser,
            banner: banner,
            format: "umd",
            exports: "named",
            sourcemap: true,
            globals: {
                "node-fetch": "fetch"
            }
        },
        plugins: [
            globals(),
            builtins(),
            resolve({
                customResolveOptions: {
                    paths:
                        process.platform === "win32"
                            ? process.env.NODE_PATH.split(/;/)
                            : process.env.NODE_PATH.split(/:/)
                }
            }),
            commonjs(),
            babel({
                babelrc: false,
                presets: ["@babel/preset-env"]
            })
        ]
    },
    {
        input: "js/index.js",
        external: ["node-fetch", "process"],
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
            resolve({
                customResolveOptions: {
                    paths:
                        process.platform === "win32"
                            ? process.env.NODE_PATH.split(/;/)
                            : process.env.NODE_PATH.split(/:/)
                }
            })
        ]
    }
];
