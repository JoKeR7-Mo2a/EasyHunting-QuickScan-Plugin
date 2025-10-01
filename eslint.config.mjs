import { defaultConfig } from "@caido/eslint-config";

/** @type {import('eslint').Linter.Config } */
export default [
  ...defaultConfig(),
  {
    rules: {
      // Disable overly strict rules for plugin development
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/strict-boolean-expressions": "off", 
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-restricted-types": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "compat/compat": "off",
      "vue/no-dupe-keys": "off",
      "vue/no-parsing-error": "off"
    }
  }
]
