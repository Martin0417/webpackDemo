var webpack = require('webpack');

var path = require('path');
var env = (process.env.WEBPACK_ENV||'').trim();
// 插件
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = {
    title : 'a webpack demo',
    filename:'../../index.html',    //生成的html存放路径，相对于 path
    template:'./src/index.html',    //html模板路径
    inject:true,    //允许插件修改哪些内容，包括head与body
    hash:true,    //为静态资源生成hash值
    minify:{    //压缩HTML文件
        removeComments:true,    //移除HTML中的注释
        collapseWhitespace:false    //删除空白符与换行符
    }
};

var libraryName = '';
var publicPath = '';//静态资源
var suffix;
var plugins = [];
// var plugins = [new ExtractTextPlugin('[name].css'),new HtmlWebpackPlugin(HtmlWebpackPluginConfig)];
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
        entry:'./src/entry.js'
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
            loader: 'url?name=[hash].[ext]&limit=24576'
        },
        {
            test: /\.html$/,
            loader: 'html'
        }
        ]
    },
    resolve:{
        // root:path.resolve('./src'),
        alias:{
            'root' : path.resolve('./src/')
        },
        extensions:["",".js"]
    },
    plugins:plugins
}