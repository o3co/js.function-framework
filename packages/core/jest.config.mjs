import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

// jest.config.mjs
export default {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  verbose: true,
  testPathIgnorePatterns: ["<rootDir>/src/", "/node_modules/"],
  testMatch: ["<rootDir>/built/**/*.spec.*"],
};
