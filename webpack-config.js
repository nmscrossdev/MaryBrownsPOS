//var HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
var path = require('path');
var webpack = require('webpack')

const fs = require('fs'); // to check if the file exists


const dotenv = require('dotenv');

  // call dotenv and it will return an Object with a parsed key 
  const env = dotenv.config().parsed;
  console.log("env",env);
 // reduce it to a nice object, the same as before
 const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});
console.log("Build in production mode")

//console.log("fileEnv",fileEnv);
module.exports = {
    
  devtool: 'source-map',
  entry: ["regenerator-runtime/runtime.js", "index.js"],
  mode: "production",
//mode: "development",
output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "./app-bundle.js",
        publicPath: '/'

    },
    resolve: {
        extensions: ['.Webpack.js', '.web.js', '.ts', '.js', '.jsx', '.tsx']
    },
    module: {
      rules: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
               presets: ["@babel/preset-env"]
            }
         }
      ]
   },
    plugins: [
        new webpack.DefinePlugin({
          __isBrowser__: "true"
        })
      ],
    plugins: [
        new webpack.DefinePlugin(envKeys)//
        ,new HtmlWebPackPlugin({
          title: 'webpack Boilerplate',
          template: path.resolve('./index.html'),
          filename: 'index.html', // output file
          inject: 'body',
        })
       ],
    devServer: {
        historyApiFallback: true,
        open: true,
    compress: true,
    hot: true,
    port: 3000,
    },
 

    // externals: {
    //     "react": "React",
    //     "react-dom": "ReactDOM"
    // },
    // plugins: [new HtmlWebpackPlugin({
    //     template: './index.html',
    //     filename: './index.html',
    //     inject: 'body'
    // })],

}

