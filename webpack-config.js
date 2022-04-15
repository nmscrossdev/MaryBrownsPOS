var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var webpack = require('webpack')


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
module.exports = {
    
   // devtool: 'source-map',
    entry: "index.js",
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
                test: /\.tsx$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'ts-loader'
                }
            },
            {test: /\.js$/,
            // loader: 'babel-loader',
            use: {
                loader: 'babel-loader',
                options: {
                    // babelrc: true,
                    presets: ['react', 'stage-2']
                    // plugins: ['react-hot-loader/babel']
                }
            },
            // query: {
            //     presets:[ 'es2015', 'react', 'stage-2' ]
            // },
            exclude: /node_modules/
         },
         {
            test: /\.css$/,
            use: [
              {
                loader: 'style-loader'
              },
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  camelCase: true,
                  sourceMap: false
                }
              }
            ]
          }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
          __isBrowser__: "true"
        })
      ],
    plugins: [
        new webpack.DefinePlugin(envKeys)
        ,new HtmlWebpackPlugin({
        template: 'index.html',
        filename: 'index.html',
        inject: 'body',
    })],
    devServer: {
        historyApiFallback: true,
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

