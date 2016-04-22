var webpack = require('webpack');
var path = require('path');
var env = process.env.WEBPACK_ENV.trim();

var libraryName = '';
var publicPath = '';//静态资源
var suffix;
var plugins = [];

if(env === 'build'){
    plugins.push(new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            minimize : true
        }));
    suffix = libraryName+'.min.js';
    publicPath = 'http://martin0417.github.io/webpackDemo/src/dist/';
}else{
    suffix = libraryName + '.js';
    publicPath = '';
}


module.exports = {
	entry: {
        entry:'./src/entry.js'
    },
	output: {
	    path: path.resolve('./src/dist'),
	    filename: "[name]"+suffix,
        library:"[name]",
        libraryTarget:'umd',
        publicPath:publicPath
	},
    module: {
        loaders: [
        {
            test: /\.mcss$/,
            loader: 'style!css!mcss'
        },
        {
            test: /\.(jpg|png)$/,
            loader: 'file?name=[hash].[ext]'
        }
        ]
    },
    resolve:{
        root:path.resolve('./src'),
        alias:{
            'root' : path.resolve('./src/')
        },
        extensions:["",".js"]
    },
    plugins:plugins
}