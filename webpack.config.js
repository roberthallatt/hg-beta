const path = require('path')
const fs = require("fs")
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
require('dotenv').config(); // Load environment variables from .env file

// create a list of twig files to generate
// filter out anything that starts with an underscore or is not a twig file
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = `${dir}/${file}`;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && path.basename(file).indexOf('_') !== 0) {
      /* Recurse into a subdirectory */
      results = results.concat(walk(file));
    } else if (
      stat &&
      !stat.isDirectory() &&
      path.extname(file) === '.twig' &&
      path.basename(file).indexOf('_') !== 0
    ) {
      /* Is a file */
      results.push(file);
    }
  });
  return results;
}
const files = walk('./src/twig');

// generates html plugins to export
const htmlPlugins = files.map(
  file =>
    // Create new HTMLWebpackPlugin with options
    new HtmlWebpackPlugin({
      filename: file.replace('./src/twig/', '').replace('.twig', '.html'),
      template: path.resolve(__dirname, file),
      hash: true,
    })
);

// Read proxy URL from environment variables
const proxyUrl = process.env.PROXY_URL;

module.exports = (env) => {
  const isProduction = env.production === true;
  const proxyUrl = process.env.PROXY_URL;
  return {
    mode: isProduction ? 'production' : 'development',
    entry: {
      bundle: path.resolve(__dirname, 'src/index.js'),
    },
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name][contenthash].js' : '[name].js',
      assetModuleFilename: isProduction ? '[name][contenthash][ext]' : '[name][ext]',
    },
    devtool: isProduction ? false : 'source-map',
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'dist'),
      },
      server: {
        type: 'https',
        options: {
          key: fs.readFileSync('/workspace/.ssl/localhost-key.pem'),
          cert: fs.readFileSync('/workspace/.ssl/localhost.pem'),
        },
      },
      port: 3000,
      open: true,
      hot: true,
      compress: false, // Disable compression
      historyApiFallback: true,
      watchFiles: ['src/**/*'],
      ...(proxyUrl ? { proxy: { '/api': { target: proxyUrl, secure: false, changeOrigin: true } } } : {}),
    },
    module: {
      rules: [
        {
          test: /\.scss$/, // Process .scss files with "sass-loader", "css-loader", "postcss-loader", and "MiniCssExtractPlugin".
          use: [
            MiniCssExtractPlugin.loader, // Extract CSS into separate files for production build.
            "css-loader", // Translates CSS into CommonJS.
            "postcss-loader", // PostCSS is used for autoprefixing CSS for better cross-browser support.
            "sass-loader", // Compiles SCSS to CSS.
          ],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              cacheCompression: false,
              cacheDirectory: true,
              compact: false,
            },
          },
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        // Twig templates
        {
          test: /\.twig$/,
          use: [
            'raw-loader',
            {
              loader: 'twig-html-loader',
              options: {
                data: {},
              },
            },
          ],
        }
      ],
    },
    optimization: isProduction ? {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
        new CssMinimizerPlugin(),
      ],
    } : {
      minimize: false, // Disable minimization in development mode
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name][contenthash].css' : '[name].css',
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: './src/assets/img', to: './assets/img' }
        ]
      }),
      ...(isProduction ? [new CleanWebpackPlugin({
        protectWebpackAssets: true,
        cleanOnceBeforeBuildPatterns: [],
        cleanAfterEveryBuildPatterns: [
            '*.js',
            '*.css',
            '*.map',
            '.html',
            '!uploads/**',
            '!assets/**',
        ],
    })] : []),
    ].concat(htmlPlugins),
  };
}