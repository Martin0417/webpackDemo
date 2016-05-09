var webpack = require('webpack');

var path = require('path');
var env = (process.env.WEBPACK_ENV||'').trim();
// 插件
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = {
    title : 'a webpack demo',
    filename:'html/hole.html',    //生成的html存放路径，相对于 path
    template:'./src/html/hole.html',    //html模板路径
    inject:'body',    //允许插件修改哪些内容，包括head与body
    hash:true,    //为静态资源生成hash值
    minify:{    //压缩HTML文件
        removeComments:true,    //移除HTML中的注释
        collapseWhitespace:false    //删除空白符与换行符
    }
};

var libraryName = '';
var publicPath = '';//静态资源
var suffix;
var outputPath = '';
var plugins = [];
Array.prototype.push.apply(plugins,[new ExtractTextPlugin('css/[name].css'),new HtmlWebpackPlugin(HtmlWebpackPluginConfig)]);
if(env === 'build'){
    // plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new webpack.optimize.UglifyJsPlugin({//压缩代码
            compress: {
                warnings: false
            },
            minimize : true,
            except: ['$super', '$', 'exports', 'require']//排除关键字
        }));
    suffix = libraryName+'.min.js';
    outputPath = './src/dist_build';
    // publicPath = '/dist_build/';
    publicPath = 'http://martin0417.github.io/webpackDemo/src/dist_build/';
}else{
    suffix = libraryName + '.js';
    outputPath = './src/dist';
    publicPath = '/dist/';
}


module.exports = {
	entry: {
        entry:'./src/javascript/pages/hole/hole.js'
    },
	output: {
	    path: path.join(__dirname,outputPath),
	    filename: "js/[name]"+suffix,
        chunkFilename: "js/[hash:6].chunk.js",
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
            loader: 'url?name=image/[name][hash:6].[ext]&limit=24576'
        },
        {
            test: /\.html$/,
            loader: 'html'
        }
        ]
    },
    resolve:{
        // root:path.join(__dirname,'./src'),
        alias:{
            'root' : path.join(__dirname,'./src/')
        },
        extensions:["",".js"]
    },
    plugins:plugins
}