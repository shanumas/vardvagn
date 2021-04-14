const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const project = require('./aurelia_project/aurelia.json');
const { AureliaPlugin, ModuleDependenciesPlugin } = require('aurelia-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// config helpers:
const ensureArray = (config) => config && (Array.isArray(config) ? config : [config]) || [];
const when = (condition, config, negativeConfig) =>
  condition ? ensureArray(config) : ensureArray(negativeConfig);

// primary config:
const outDir = path.resolve(__dirname, project.platform.output);
const srcDir = path.resolve(__dirname, 'src');
const baseUrl = '';

const cssRules = [
  {
    loader: 'css-loader',
    options: {
      esModule: false
    }
  }
];


module.exports = (
  { production, local } = {},
  {extractCss, analyze, tests, hmr, port, host } = {}) => {

    console.log(local, arguments[0]);

    return {
      target: local ? "web" : "electron-renderer",
      resolve: {
        extensions: ['.ts', '.js'],
        modules: [srcDir, 'node_modules'],

        alias: {
          'aurelia-binding': path.resolve(__dirname, 'node_modules/aurelia-binding')
        }
      },
      entry: {
        app: [
          'aurelia-bootstrapper'
        ]
      },
      mode: production ? 'production' : 'development',
      output: {
        path: outDir,
        publicPath: baseUrl,
        filename: production ? '[name].[chunkhash].bundle.js' : '[name].[hash].bundle.js',
        sourceMapFilename: production ? '[name].[chunkhash].bundle.map' : '[name].[hash].bundle.map',
        chunkFilename: production ? '[name].[chunkhash].chunk.js' : '[name].[hash].chunk.js'
      },
      optimization: {
        runtimeChunk: true,
        moduleIds: 'hashed',
        splitChunks: {
          hidePathInfo: true,
          chunks: "initial",
          maxSize: 250000,
          cacheGroups: {
            default: false,
            vendors: { // picks up everything from node_modules as long as the sum of node modules is larger than minSize
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 19,
              enforce: true, // causes maxInitialRequests to be ignored, minSize still respected if specified in cacheGroup
              minSize: 30000 // use the default minSize
            },
            vendorsAsync: { // vendors async chunk, remaining asynchronously used node modules as single chunk file
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors.async',
              chunks: 'async',
              priority: 9,
              reuseExistingChunk: true,
              minSize: 10000  // use smaller minSize to avoid too much potential bundle bloat due to module duplication.
            },
            commonsAsync: { // commons async chunk, remaining asynchronously used modules as single chunk file
              name: 'commons.async',
              minChunks: 2, // Minimum number of chunks that must share a module before splitting
              chunks: 'async',
              priority: 0,
              reuseExistingChunk: true,
              minSize: 10000  // use smaller minSize to avoid too much potential bundle bloat due to module duplication.
            }
          }
        }
      },
      performance: { hints: false },
      devServer: {
        contentBase: outDir,
        // serve index.html for all 404 (required for push-state)
        historyApiFallback: true,
        open: project.platform.open,
        hot: hmr || project.platform.hmr,
        port: port || project.platform.port,
        host: host
      },
      devtool: production ? 'nosources-source-map' : 'cheap-module-eval-source-map',
      module: {
        rules: [
          {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
          issuer: /\.[tj]s$/i
        },
        {
          test: /\.scss$/,
          use: ['css-loader', 'sass-loader'],
          issuer: /\.html?$/i
        },
          {
            test: /\.css$/i,
            issuer: [{ not: [{ test: /\.html$/i }] }],
            use: extractCss ? [{
              loader: MiniCssExtractPlugin.loader
            }, ...cssRules
            ] : ['style-loader', ...cssRules]
          },
          {
            test: /\.css$/i,
            issuer: [{ test: /\.html$/i }],
            // CSS required in templates cannot be extracted safely
            // because Aurelia would try to require it again in runtime
            use: cssRules
          },
          { test: /\.html$/i, loader: 'html-loader' },
          { test: /\.ts$/, loader: "ts-loader" },
          // embed small images and fonts as Data Urls and larger ones as files:
          { test: /\.(png|gif|jpg|cur)$/i, loader: 'url-loader', options: { limit: 8192 } },
          { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff2' } },
          { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff' } },
          // load these fonts normally, as files:
          { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'file-loader' },
          { test: /environment\.json$/i, use: [
            {loader: "app-settings-loader", options: {env: production ? 'production' : 'development' }},
          ]},
          ...when(tests, {
            test: /\.[jt]s$/i, loader: 'istanbul-instrumenter-loader',
            include: srcDir, exclude: [/\.(spec|test)\.[jt]s$/i],
            enforce: 'post', options: { esModules: true },
          })
        ]
      },
      plugins: [
        ...when(!tests, new DuplicatePackageCheckerPlugin()),
        new AureliaPlugin(),
        new ModuleDependenciesPlugin({
          'aurelia-testing': ['./compile-spy', './view-spy']
        }),
        new HtmlWebpackPlugin({
          template: 'index.ejs',
          metadata: {
            // available in index.ejs //
            baseUrl
          }
        }),
        // ref: https://webpack.js.org/plugins/mini-css-extract-plugin/
        ...when(extractCss, new MiniCssExtractPlugin({ // updated to match the naming conventions for the js files
          filename: production ? '[name].[contenthash].bundle.css' : '[name].[hash].bundle.css',
          chunkFilename: production ? '[name].[contenthash].chunk.css' : '[name].[hash].chunk.css'
        })),
        ...when(!tests, new CopyWebpackPlugin({
          patterns: [
            { from: 'static', to: outDir, globOptions: { ignore: ['.*'] } }
          ]
        })), // ignore dot (hidden) files
        ...when(analyze, new BundleAnalyzerPlugin()),
        /**
         * Note that the usage of following plugin cleans the webpack output directory before build.
         * In case you want to generate any file in the output path as a part of pre-build step, this plugin will likely
         * remove those before the webpack build. In that case consider disabling the plugin, and instead use something like
         * `del` (https://www.npmjs.com/package/del), or `rimraf` (https://www.npmjs.com/package/rimraf).
         */
        new CleanWebpackPlugin()
      ]
    }
};
