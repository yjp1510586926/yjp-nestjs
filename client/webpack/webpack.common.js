const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { generateEntries } = require("./generate-entries");

// 动态生成 entry 配置
const pagesDir = path.resolve(__dirname, "../src/pages");
const entries = generateEntries(pagesDir);

module.exports = {
  entry: entries,
  output: {
    path: path.resolve(__dirname, "../../dist/client"),
    filename: "[name].js",
    publicPath: "/static/",
    // 确保打包后的代码立即执行（IIFE 格式）
    iife: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: "swc-loader",
        },
        // 移除 exclude: /node_modules/ 以允许打包 React 等依赖
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "../src"),
      "@components": path.resolve(__dirname, "../src/components"),
      "@pages": path.resolve(__dirname, "../src/pages"),
      "@hooks": path.resolve(__dirname, "../src/hooks"),
      "@stores": path.resolve(__dirname, "../src/stores"),
      "@services": path.resolve(__dirname, "../src/services"),
      "@utils": path.resolve(__dirname, "../src/utils"),
      "@types": path.resolve(__dirname, "../src/types"),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
};
