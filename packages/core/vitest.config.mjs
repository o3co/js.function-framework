import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.spec.mts", "src/**/*.test.mts"],
    environment: "node",
    globals: true,
  },
});
