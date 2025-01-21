const path = require('path')
const fs = require("fs")
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const WatchExternalFilesPlugin = require('webpack-watch-files-plugin').default;
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();

class InjectAssetsPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('InjectAssetsPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'InjectAssetsPlugin',
        (data, cb) => {
          const cssFiles = Object.keys(compilation.assets).filter(file => file.endsWith('.css'));
          const jsFiles = Object.keys(compilation.assets).filter(file => file.endsWith('.js'));

          const cssLinks = cssFiles.map(file => `<link href="/${file}" rel="stylesheet">`).join('\n');
          const jsScripts = jsFiles.map(file => `<script defer src="/${file}"></script>`).join('\n');

          data.html = data.html.replace('<!-- WEBPACK_CSS_INJECT -->', cssLinks);
          data.html = data.html.replace('<!-- WEBPACK_JS_INJECT -->', jsScripts);

          cb(null, data);
        }
      );
    });
  }
}

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = `${dir}/${file}`;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && path.basename(file).indexOf('_') !== 0) {
      results = results.concat(walk(file));
    } else if (
      stat &&
      !stat.isDirectory() &&
      path.extname(file) === '.twig' &&
      path.basename(file).indexOf('_') !== 0
    ) {
      results.push(file);
    }
  });
  return results;
}
const files = walk('./src/twig');

const htmlPlugins = files.map(
  file =>
    new HtmlWebpackPlugin({
      filename: file.replace('./src/twig/', '').replace('.twig', '.html'),
      template: path.resolve(__dirname, file),
      inject: false,
      minify: {
        removeComments: false,
        collapseWhitespace: true
      }
    })
);

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
      filename: isProduction ? 'assets/js/[name].[contenthash].js' : 'assets/js/[name].js',
      assetModuleFilename: isProduction ? 'assets/js/[name].[contenthash][ext]' : 'assets/js/[name][ext]',
    },
    cache: false,
    devtool: isProduction ? false : 'source-map',
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'dist'),
      },
      server: {
        type: 'https',
        options: {
          key: fs.readFileSync('./.ssl/localhost-key.pem'),
          cert: fs.readFileSync('./.ssl/localhost.pem'),
        },
      },
      port: 3000,
      open: true,
      hot: false,
      liveReload: true,
      compress: false,
      historyApiFallback: true,
      watchFiles: {
        paths: ['src/**/*.scss', 'src/**/*.js', 'src/**/*.twig'],
        options: {
          usePolling: false,
          ignored: /node_modules/,
        },
      },
      // ...(proxyUrl ? { proxy: { '/api': { target: proxyUrl, secure: false, changeOrigin: true } } } : {}),
    },
    module: {
      rules: [
        {
          test: /\.(jpe?g|png|gif|svg|avif)$/i,
          type: 'asset',
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../../', // Adjust this path if needed
              },
            },
            "css-loader",
            "postcss-loader",
            {
              loader: "sass-loader",
              options: {
                sassOptions: {
                  quietDeps: true,
                  verbose: false
                }
              }
            },
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
        },
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
      minimize: false,
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isProduction ? 'assets/css/[name].[contenthash].css' : 'assets/css/[name].css',
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: './src/assets/img', to: './assets/img' }
        ]
      }),
      new WatchExternalFilesPlugin({
        files: [
          'src/**/*.scss',
        ],
      }),
      new InjectAssetsPlugin(),
      new ImageMinimizerPlugin({
        generator: [
          {
            type: 'asset',
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: [
                ['avif', { quality: 50 }],
              ],
            },
          },
        ],
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['mozjpeg', { quality: 75 }],
              ['pngquant', { quality: [0.65, 0.9], speed: 4 }],
            ],
          },
        },
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
};
