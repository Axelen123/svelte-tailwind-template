const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');

const postcss = require('postcss');
const postcssPresetenv = require('postcss-preset-env');
const postcssImport = require('postcss-import');
const tailwindCss = require('tailwindcss');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
  entry: {
    bundle: [ './src/main.js' ]
  },
  resolve: {
    extensions: [ '.mjs', '.js', '.svelte' ]
  },
  output: {
    path: __dirname + '/public',
    filename: '[name].js',
    chunkFilename: '[name].[id].js'
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            hotReload: true,
            preprocess: {
              style: ({ content, filename }) => {
                return postcss([
                  postcssImport,
                  postcssPresetenv({
                    browsers: [ 'Last 2 versions', 'IE >= 11' ]
                  }),
                  tailwindCss
                ])
                  .process(content, { from: filename })
                  .then((result) => {
                    return { code: result.css, map: null };
                  })
                  .catch((err) => {
                    console.log('failed to preprocess style', err);
                    return;
                  });
              }
            }
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          /**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
          prod ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  devtool: prod ? false : 'source-map'
};
