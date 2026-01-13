import js from "@eslint/js";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
    js.configs.recommended,
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsparser,
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        plugins: {
            "@typescript-eslint": tseslint
        },
        rules: {
            ...tseslint.configs.recommended.rules,
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
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
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
            "@typescript-eslint/no-explicit-any": "off"
        }
    }
];
