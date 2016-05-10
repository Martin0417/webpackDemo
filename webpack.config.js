console.info('--------------------------------------------------------------------------------------------------------------------');
console.info('---------------------------------start webpack to bundle entry javascript files-------------------------------------');
console.info('--------------------------------------------------------------------------------------------------------------------')

var webpack = require('webpack');
var gulp = require('gulp');
var clean = require('gulp-clean');
var through2 = require('through2');

var path = require('path');
var fs = require('fs');
var env = (process.env.WEBPACK_ENV||'').trim();
// 插件
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
// HtmlWebpackPlugin 多个entry入口的时候不好解决
// 和CommonsChunkPlugin 不能同时用
// var HtmlWebpackPlugin = require('html-webpack-plugin');
// var HtmlWebpackPluginConfig = {
//     title : 'a webpack demo',
//     filename:'html/hole.html',    //生成的html存放路径，相对于 path
//     template:'./src/html/hole.html',    //html模板路径
//     inject:'body',    //允许插件修改哪些内容，包括head与body
//     hash:true,    //为静态资源生成hash值
//     minify:{    //压缩HTML文件
//         removeComments:true,    //移除HTML中的注释
//         collapseWhitespace:false    //删除空白符与换行符
//     }
// };

var libraryName = '';
var publicPath = '';//静态资源
var suffix;
var outputPath = '';
var plugins = [];
// Array.prototype.push.apply(plugins,[new ExtractTextPlugin('css/[name].css'),new HtmlWebpackPlugin(HtmlWebpackPluginConfig)]);
Array.prototype.push.apply(plugins,[new ExtractTextPlugin('css/[name].css',{allChunks:true})]);
// ,new webpack.optimize.CommonsChunkPlugin({
//     name: "commons",
//     filename: "commons.js",
// })
if(env === 'build'){
    //clean build directory
    gulp.src('dist_build').pipe(clean());
    // plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new webpack.optimize.UglifyJsPlugin({//压缩代码
            compress: {
                warnings: false
            },
            minimize : true,
            except: ['$super', '$', 'exports', 'require']//排除关键字
        }));
    suffix = libraryName+'.js';
    outputPath = './dist_build';
    // publicPath = '/dist_build/';
    publicPath = 'http://martin0417.github.io/webpackDemo/dist_build/';
}else{
    // gulp.src('dist').pipe(clean());
    suffix = libraryName + '.js';
    outputPath = './dist';
    // publicPath = '/dist/';
    publicPath = 'http://martin0417.github.io/webpackDemo/dist/';
}


function getEntry() {
  var jsPath = path.join(__dirname, 'src/javascript/pages');
  var matchs = [], files = {};
  function walk(jsPathArg){
    var dirs = fs.readdirSync(jsPathArg);
    dirs.forEach(function (item) {
        if(item.match(/\.js$/)){
            matchs = item.match(/(.+\.entry)\.js$/);
            if (matchs) {
              files[matchs[1]] = '.\\'+path.join(path.relative(__dirname,jsPathArg), item);
            }
        }else{
            walk(path.join(jsPathArg,item));
        }
    });
  }
  walk(jsPath);
  return files;
}

console.dir(path.join(__dirname,outputPath));

module.exports = {
    devtool: "source-map",
	entry: getEntry(),
	output: {
	    path: path.join(__dirname,outputPath),
	    filename: "js/[name]"+suffix,
        chunkFilename: "js/[hash:6].chunk.js",
        library:"[name]",
        libraryTarget:'umd',
        publicPath:publicPath,
        sourceMapFilename:'cheap-module-inline-source-map'
	},
    module: {
        loaders: [
        {
            test: /\.mcss$/,
            loader: ExtractTextPlugin.extract(['css','mcss'])
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