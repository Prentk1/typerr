/* eslint-disable no-undef */
module.exports = {
  launch: {
    headless: true,
    devtools: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--no-first-run",
    ],
  },
};
