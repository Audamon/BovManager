/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
  // theme.ts importa global.css (só usado no build web) — o Jest não
  // sabe interpretar .css, então mapeamos pra um mock vazio.
  moduleNameMapper: {
    "\\.css$": "<rootDir>/__mocks__/styleMock.js",
  },
};
