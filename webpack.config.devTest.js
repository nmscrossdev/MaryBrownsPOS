var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var webpack = require('webpack')

const fs = require('fs'); // to check if the file exists


const dotenv = require('dotenv');

  // call dotenv and it will return an Object with a parsed key 
  const env = dotenv.config().parsed;
  
  // reduce it to a nice object, the same as before
  

const currentPath = path.join(__dirname);

// Create the fallback path (the production .env)
const basePath = currentPath + '/devTest.env';

// We're concatenating the environment name to our filename to specify the correct env file!
const envPath = basePath ;//+ '.' + 'development';

// Check if the file exists, otherwise fall back to the production .env
const finalPath = fs.existsSync(envPath) ? envPath : basePath;

// Set the path parameter in the dotenv config
const fileEnv = dotenv.config({ path: finalPath }).parsed;
const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
  return prev;
}, {});

console.log("Build in devTest mode")

//console.log("fileEnv",fileEnv);
module.exports = {
    
    devtool: 'source-map',
    entry: "index.js",
    mode: "development",
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
                  sourceMap: true
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
        new webpack.DefinePlugin(envKeys)//
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

