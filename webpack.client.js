const path = require("path");
const webpack = require("webpack");

const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");

const config = {
  target: "node",

  entry: "./src/client/client.js",

  output: {
    filename: "bundle.js",
    path: path.resolve(
      __dirname,
      "public"
    ),
  },

  plugins: [
    new webpack.ProvidePlugin({
      // Make a global `process` variable that points to the `process` package,
      // because the `util` package expects there to be a global variable named `process`.
      // Thanks to https://stackoverflow.com/a/65018686/14239942
      process: "process/browser",
    }),
  ],
};

module.exports = merge(
  baseConfig,
  config
);
