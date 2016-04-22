var webpack = require('webpack');
var path = require('path');
var env = process.env.WEBPACK_ENV.trim();

var libraryName = '';
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
}else{
    suffix = libraryName + '.js';
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
        publicPath:'http://localhost:8080/src/dist/'
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
        extensions:["",".js"]
    },
    plugins:plugins
}