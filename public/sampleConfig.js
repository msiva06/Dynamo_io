const config = {
  entry: "./client/index.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
        exclude: /node_modules/,
      },
    ],
  },
};

module.exports = config;
