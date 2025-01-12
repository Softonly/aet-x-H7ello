import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import DotenvWebpack from 'dotenv-webpack';
import webpack from 'webpack';

export default {
  mode: 'production',
  entry: './src/app/layout.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
    alias: {
      '@': path.resolve(__dirname, 'src'), '@nextui-org/react': path.resolve(__dirname, 'node_modules/@nextui-org/react'),
    },
    mainFields: ['browser', 'module', 'main'],
    fallback: {
      crypto: false,
      stream: false,
      assert: false,
    },
    // Handle ES module-specific resolution
    mainFiles: ['index', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false, // Ensures .mjs modules are loaded correctly
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|md|LICENSE|README.md)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
    new DotenvWebpack(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /chunk-RFEIBVIG\.mjs/, // Ignore specific problematic module
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /@nextui-org\/shared-utils/, // Ignore specific modules causing export errors
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimize: true,
  },
};
