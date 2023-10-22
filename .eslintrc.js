module.exports = {
  extends: ["eslint:recommended", "plugin:astro/recommended", "prettier"],
  plugins: ["unused-imports"],
  overrides: [
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
    },
  ],
};
