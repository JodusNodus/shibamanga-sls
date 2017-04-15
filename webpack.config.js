const path = require("path");

module.exports = {
  entry: "./handler",
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, "/.webpack"),
    filename: "handler.js",
  },
  target: "node",
  resolve: {
    extensions: [".ts", ".js", ".json", ""],
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: "ts-loader" },
      { test: /\.json$/, loader: "json-loader" },
    ],
  },
};
