/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: [
        "airbnb-base",
        "airbnb-typescript/base"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json"
    }
}
