module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  plugins: ["react", "react-hooks", "prettier"],
  rules: {
    "no-console": "off",
    "no-empty": "off",
    "react/jsx-filename-extension": "off",
    "import/order": "off",
    "react-hooks/exhaustive-deps": "warn",
    "no-duplicate-imports": "warn",
    "prettier/prettier": "warn",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "no-dupe-keys": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    jest: true,
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
};
