import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

// TODO: add airbnb config
export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
