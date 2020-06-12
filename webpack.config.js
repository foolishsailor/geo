const path = require("path");

module.exports = ["source-map"].map((devtool) => ({
  entry: "./src/index",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "geo.js",
    library: "geo",
    libraryTarget: "umd",
  },
  devtool: "source-map",
}));
