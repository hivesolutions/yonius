import js from "@eslint/js";
import globals from "globals";
import mochaPlugin from "eslint-plugin-mocha";
import nodePlugin from "eslint-plugin-n";

export default [
    {
        ignores: ["dist/**", "node_modules/**"]
    },
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jasmine
            }
        },
        plugins: {
            mocha: mochaPlugin,
            n: nodePlugin
        },
        rules: {
            indent: [
                "warn",
                4,
                {
                    SwitchCase: 1
                }
            ],
            quotes: [
                "error",
                "double",
                {
                    avoidEscape: true
                }
            ],
            semi: ["error", "always"],
            "space-before-function-paren": [
                "error",
                {
                    anonymous: "never",
                    named: "never",
                    asyncArrow: "always"
                }
            ],
            "linebreak-style": ["error", "windows"],
            "object-shorthand": ["error", "consistent"],
            "no-debugger": "warn",
            "no-unused-vars": [
                "error",
                {
                    args: "none",
                    vars: "all",
                    caughtErrors: "none",
                    ignoreRestSiblings: true
                }
            ],
            "brace-style": "off",
            "no-useless-escape": "off",
            "no-mixed-operators": "off",
            "operator-linebreak": "off",
            "mocha/no-exclusive-tests": "error"
        }
    },
    {
        files: ["**/*.json"],
        rules: {
            quotes: "off",
            semi: "off"
        }
    }
];
