var webpack = require('webpack');
var path = require('path');
var env = process.env.WEBPACK_ENV.trim();

var libraryName = '';
var publicPath = '';//静态资源
var suffix;
var plugins = [];
// var plugins = [new webpack.optimize.CommonsChunkPlugin('commons.js',['entry','entry1'])];

if(env === 'build'){
    plugins.push(new webpack.optimize.UglifyJsPlugin({//压缩代码
            compress: {
                warnings: false
            },
            minimize : true,
            except: ['$super', '$', 'exports', 'require']//排除关键字
        }));
    suffix = libraryName+'.min.js';
    publicPath = 'http://martin0417.github.io/webpackDemo/src/dist/';
}else{
    suffix = libraryName + '.js';
    publicPath = '/src/dist/';
}


module.exports = {
	entry: {
        entry:'./src/entry.js',
        entry1:'./src/entry1.js'
    },
	output: {
	    path: path.resolve('./src/dist'),
	    filename: "[name]"+suffix,
        chunkFilename: "[id].chunk.js",
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
        },
        {
            test: /\.html$/,
            loader: 'html'
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