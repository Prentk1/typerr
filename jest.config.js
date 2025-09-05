/* eslint-disable no-undef */
module.exports = {
  preset: "jest-puppeteer",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: ["**/test/**/*.test.ts"],
  maxWorkers: 1,
  testTimeout: 80000,
};
