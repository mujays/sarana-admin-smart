module.exports = {
  "*.{ts,tsx}": [
    () => "yarn types:staged",
    "yarn test:staged",
    "yarn lint:staged",
    "yarn format:staged",
  ],
};
