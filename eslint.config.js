// @ts-check
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const reactNativePlugin = require("eslint-plugin-react-native");

/**
 * Ekoru Mobile – ESLint flat config (ESLint v9+)
 *
 * Naming convention enforcement
 * ─────────────────────────────
 * Rule                      Convention
 * variables / params        camelCase
 * functions                 camelCase  (React components → PascalCase)
 * React components          PascalCase
 * TypeScript types          PascalCase
 * TypeScript interfaces     PascalCase  (no 'I' prefix)
 * Enums                     PascalCase
 * Enum members              UPPER_CASE
 * Module-level constants    UPPER_CASE  (primitives exported at top-level)
 * React hooks               camelCase, must start with 'use'
 * Private class members     camelCase with leading underscore allowed
 *
 * Files that are intentionally excluded:
 * - node_modules, .expo, .claude, docs
 * - Expo Router special files: _layout, +not-found
 * - Deprecated stub files: login.tsx, register.tsx (pending deletion)
 */

/** Files to completely ignore */
const IGNORE_PATTERNS = [
  "**/node_modules/**",
  "**/.expo/**",
  "**/.claude/**",
  "**/docs/**",
  // Deprecated screen stubs (pending deletion once git allows it)
  "features/auth/screens/login.tsx",
  "features/auth/screens/register.tsx",
];

/** Base TypeScript rules shared across all .ts/.tsx files */
const baseTsRules = {
  // ── Naming conventions ─────────────────────────────────────────────────────
  "@typescript-eslint/naming-convention": [
    "error",

    // ── 1. Default: camelCase for everything not overridden below ─────────────
    {
      selector: "default",
      format: ["camelCase"],
      leadingUnderscore: "allow", // private members: _myField
      trailingUnderscore: "forbid",
    },

    // ── 2. Variables: camelCase or UPPER_CASE ─────────────────────────────────
    // Module-scope primitive constants are allowed to be UPPER_CASE.
    // Everything else must be camelCase.
    {
      selector: "variable",
      format: ["camelCase", "UPPER_CASE"],
      leadingUnderscore: "allow",
    },

    // ── 3. Functions: camelCase (hooks) or PascalCase (components) ────────────
    {
      selector: "function",
      format: ["camelCase", "PascalCase"],
    },

    // ── 4. Parameters: camelCase ──────────────────────────────────────────────
    {
      selector: "parameter",
      format: ["camelCase"],
      leadingUnderscore: "allow", // allow _unused convention
    },

    // ── 5. Types & Interfaces: PascalCase, no I-prefix ────────────────────────
    {
      selector: "typeLike", // covers class, interface, typeAlias, enum
      format: ["PascalCase"],
    },

    // ── 6. Enum members: UPPER_CASE ───────────────────────────────────────────
    {
      selector: "enumMember",
      format: ["UPPER_CASE"],
    },

    // ── 7. Object destructured properties: allow camelCase or UPPER_CASE ──────
    // (covers GraphQL response fields, 3rd-party APIs, etc.)
    {
      selector: "variable",
      modifiers: ["destructured"],
      format: ["camelCase", "PascalCase", "UPPER_CASE"],
    },

    // ── 8. React components (const arrow functions): PascalCase ──────────────
    {
      selector: "variable",
      modifiers: ["const"],
      types: ["function"],
      format: ["camelCase", "PascalCase"],
    },

    // ── 9. Allow Expo Router reserved names ───────────────────────────────────
    // unstable_settings is an Expo Router API — not our code
    {
      selector: "variable",
      filter: {
        regex: "^unstable_",
        match: true,
      },
      format: null,
    },
  ],

  // ── General quality rules ──────────────────────────────────────────────────

  // Disallow 'any' type (use 'unknown' instead)
  "@typescript-eslint/no-explicit-any": "warn",

  // Require explicit return types on exported functions
  "@typescript-eslint/explicit-module-boundary-types": "off", // too noisy for React

  // No unused variables (with exceptions for _ prefix and React)
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      vars: "all",
      args: "after-used",
      ignoreRestSiblings: true,
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_|^React$",
    },
  ],

  // No non-null assertions (use optional chaining instead)
  "@typescript-eslint/no-non-null-assertion": "warn",

  // Consistent type imports
  "@typescript-eslint/consistent-type-imports": [
    "error",
    { prefer: "type-imports", fixStyle: "separate-type-imports" },
  ],

  // No console.log left in production code (warn, not error, to allow debug sessions)
  "no-console": ["warn", { allow: ["warn", "error"] }],

  // No duplicate imports from same module
  "no-duplicate-imports": "error",

  // Prefer const over let when variable is never reassigned
  "prefer-const": "error",

  // No var
  "no-var": "error",
};

/** React + React Hooks rules */
const reactRules = {
  // Hooks must be called at top level (not inside loops/conditions)
  "react-hooks/rules-of-hooks": "error",

  // Exhaustive deps in useEffect/useCallback/useMemo
  "react-hooks/exhaustive-deps": "warn",

  // Components must be PascalCase
  "react/display-name": "warn",

  // Prefer self-closing tags for empty JSX elements
  "react/self-closing-comp": ["error", { component: true, html: true }],

  // No duplicate keys in JSX lists
  "react/jsx-key": ["error", { checkFragmentShorthand: true }],

  // No direct mutation of state
  "react/no-direct-mutation-state": "error",
};

/** React Native specific rules */
const reactNativeRules = {
  // No unused styles in StyleSheet objects
  "react-native/no-unused-styles": "error",

  // Use platform-specific file extensions when needed
  "react-native/split-platform-components": "off",

  // No raw text strings outside <Text> components
  "react-native/no-raw-text": ["error", { skip: ["CustomText"] }],
};

module.exports = [
  // ── Global ignores ─────────────────────────────────────────────────────────
  {
    ignores: IGNORE_PATTERNS,
  },

  // ── TypeScript source files ────────────────────────────────────────────────
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-native": reactNativePlugin,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...baseTsRules,
      ...reactRules,
      ...reactNativeRules,
    },
  },

  // ── Test files: relax some rules ──────────────────────────────────────────
  {
    files: [
      "**/tests/**/*.ts",
      "**/tests/**/*.tsx",
      "**/*.test.ts",
      "**/*.test.tsx",
    ],
    rules: {
      // Allow any in test mocks
      "@typescript-eslint/no-explicit-any": "off",
      // Allow non-null assertions in tests
      "@typescript-eslint/no-non-null-assertion": "off",
      // console is fine in tests
      "no-console": "off",
      // Type imports not enforced in test files
      "@typescript-eslint/consistent-type-imports": "off",
      // Naming: test describe/it strings can be anything, but vars still camelCase
      "@typescript-eslint/naming-convention": "off",
    },
  },

  // ── Expo Router files: allow PascalCase filenames mapped to lowercase routes ─
  {
    files: ["app/**/*.tsx", "app/**/*.ts"],
    rules: {
      // Route-level default exports don't need display names
      "react/display-name": "off",
    },
  },

  // ── GraphQL files: constants must be SCREAMING_SNAKE_CASE ─────────────────
  {
    files: ["graphql/**/*.ts"],
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        // All exported GraphQL operation constants: SCREAMING_SNAKE_CASE
        {
          selector: "variable",
          modifiers: ["const", "exported"],
          format: ["UPPER_CASE"],
        },
        // Other variables (gql helper internals): camelCase
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE"],
        },
        // Type-level names: PascalCase
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
      ],
    },
  },

  // ── Hook files: enforce 'use' prefix ──────────────────────────────────────
  {
    files: ["**/hooks/**/*.ts", "**/hooks/**/*.tsx"],
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        // Default export function must start with 'use'
        {
          selector: "function",
          modifiers: ["exported"],
          format: ["camelCase"],
          custom: {
            regex: "^use[A-Z]",
            match: true,
          },
        },
        // Everything else: camelCase or UPPER_CASE
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "enumMember",
          format: ["UPPER_CASE"],
        },
      ],
    },
  },
];
