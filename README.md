# 浅谈webpack

> webpack, the flexible (unbiased,extensible,production,open source) module bundler.
 
![modules with dependencies ---webpack---> static assets](http://webpack.github.io/assets/what-is-webpack.png)


> Webpack 是德国开发者 Tobias Koppers 开发的模块加载器
Instagram 工程师认为这个方案很棒, 似乎还把作者招过去了

[官方文档入口](http://webpack.github.io/docs/)
内容挺多，学习成本有点高，但是坚持看下来的话肯定还是很有收获的，里面不单单是webpack的介绍、教程，还有对[各种模块化实现的优缺点比较](https://webpack.github.io/docs/motivation.html)，对其他打包器的看法见解，以及很多其他相关知识。

## 各种模块化实现的优缺点比较
- 英文：https://webpack.github.io/docs/motivation.html
- 中文：http://zhaoda.net/webpack-handbook/module-system.html

## webpack要实现的目标
- Split the dependency tree into chunks loaded on demand 
- Keep initial loading time low 
- Every static asset should be able to be a module
- Ability to integrate 3rd-party libraries as modules
- Ability to customize nearly every part of the module bundler
- Suited for big projects

----------

- 将依赖打包进另外的代码块中，在需要的时候才加载进来
- 减少页面初始化的时间
- 任何资源都应该可以被当做模块
- 能够将第三方库当做模块整合进来
- 能够让开发者几乎定制打包器的每个部分
- 更适用于大型单页面应用

## 安装与使用
**全局**：$ npm install webpack -g
**工程中**：$ npm install webpack --save-dev
**Dev Tools**：$ npm install webpack-dev-server --save-dev

**通常的用法**：webpack --progress --color --watch --display-error-details
- --config 指定config文件，默认寻找webpack.config.js
- --watch 有文件修改时自动重新打包
- --progress 显示打包进度
- --color 控制台来点颜色
- --display-error-detail 展示更多报错信息

## 亮点介绍
- 任何东西都可以被require
- Loader
- Code splitting
- 插件系统
- web-dev-server


## 任何资源都可以被require
在以前的印象中，似乎只有js文件可以被require，毕竟是在js的运行环境中，随意加载一些js解析不了的东西，肯定分分钟报错，这样想想也是合情合理。但是webpack希望的是能将模块所有的依赖、相关的资源都通过require方法在js文件中引进来，比如以下资源：
- stylesheets
- images
- webfonts
- html for templating
- etc.

当然还包括其他一些前端相关语言：
- coffeescript
- less
- jade
- etc.

这样做能够更清晰、方便地管理模块的所有依赖，可以做到更彻底的模块化。
代码看起来会是下面这个样子：
``` javascript
require("./style.css");
require("./style.less");
require("./template.jade");
require("./image.png");
```
webpack是如何实现这种奇特的想法的呢？主要还是通过下文的**Loader**实现。

## Loader
官方介绍：
>Loaders are transformations that are applied on a resource file of your app. They are functions (running in node.js) that take the source of a resource file as the parameter and return the new source.

顾名思义，加载器。它的作用是将上文提到的各种资源加载进来的同时，对其进行解析处理，转化为可以进一步处理的形式（有点像pipe方法，传入一种资源，处理后返回另一种希望的资源）。

要使用loader，首先是需要通过npm安装的。
``` javascript
$ npm install xxx-loader --save-dev
```
然后，我们一般在webpack的配置文件中，对loader进行配置。配置文件局部如下：
``` javascript
{
    module: {
        loaders: [
            { test: /\.jade$/, loader: "jade" },
            // => 用jade-loader处理.jade文件

            { test: /\.css$/, loader: "style!css" },
            // => 用css-loader处理.css文件，处理的结果再通过style-loader处理
            // 另一种写法:
            { test: /\.css$/, loaders: ["style", "css"] },
            
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
            // => 用url-loader处理图片文件
        ]
    }
}
```
从上面的配置文件可以得到以下信息：
- loader可以被链式调用（鼓励）
- loader可以加参数进行进一步的配置，如
`{test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}`
或
`{test: /\.png$/,loader: "url-loader",query: { mimetype: "image/png" }}`
- 可以在test中写正则匹配要通过loader进行处理的文件

loader还可以通过其他形式配置，如下：
- 在require中配置（不推荐，但优先级高）
``` javascript
require("./loader!./dir/file.txt");//指定加载器文件进行加载
require("jade!./template.jade");
```
- CLI
``` javascript
$ webpack --module-bind 'css=style!css'
```

资源的类型很多，因此loader也对应的会需要很多，我们可以到github中去搜索，也可以到官方提供的[loader大全](https://webpack.github.io/docs/list-of-loaders.html)中查找需要的loader。

**mcss处理流程 参见webpack demo**
**[页面 http://martin0417.github.io/webpackDemo/](http://martin0417.github.io/webpackDemo/)**
**[源码 https://github.com/Martin0417/webpackDemo/tree/gh-pages)](https://github.com/Martin0417/webpackDemo/tree/gh-pages)**

**loader配置**
``` javascript
module.exports = {
    module: {
        loaders: [
        {
            test: /\.mcss$/,
            loader: 'style-loader!css-loader!mcss'
        },
        {
            test: /\.(jpg|png)$/,
            loader: 'file-loader?name=[hash].[ext]'
        }
        ]
    }
}
```

**mcss处理流程**
mcss ---([mcss-loader](https://github.com/zjzhome/mcss-loader) 语法解析)---> css
css ---(css-loader 将CSS以及其中的依赖写进一个JSON)---> js中的css JSON
js中的css JSON ---(style-loader 插入到页面中)---> 页面中的css

### css-loader
> [css-loader](https://github.com/webpack/css-loader)  `@import `and `url(...)` are interpreted like require() and will be resolved by the css-loader. Good loaders for requiring your assets are the **file-loader** and the **url-loader** which you should specify in your config (see below).

处理css文件中对其他外部资源的依赖，写进js对象中以便进一步处理。
还有定义局部变量名等其他功能。。。

css-loader一般搭配 [url-loader](https://github.com/webpack/url-loader)和[file-loader](https://github.com/webpack/file-loader)一起配置使用。
- url-loader：如果文件的大小小于限制，会返回[Data Url](http://www.webhek.com/data-url)。
- file-loader：处理css中引用的文件。默认会生成一个新文件，文件名=内容的MD5 Hash + 原始的后缀。支持很多文件名的配置。

## Code splitting
字面意思，代码分割，将代码分块。那么为什么我们需要将代码分块呢？
假设有这样一种场景：页面中有个按钮，当点击按钮以后会触发一些操作（比如弹出一个对话框，里面有**一些比较复杂的逻辑、资源，代码量还不少**），但是点击的操作不是强制的，用户可以不点也可以随时跳出页面。这时候，为了节约这部分不一定会执行的代码，我们希望**相关资源是点击按钮以后异步加载的，相关逻辑是点击以后才开始试行的**。Code splitting就是用来处理这些情况的。

想想看以前有这种需求的时候，我们是怎么处理的。其实online工程之前有过实现，具体代码如下：
``` javascript
/*
 * 对话框组件二次包装
 */
dialog : function( op ){
    this.loadCdnJS("js/dialog.js", function(){
        return !!$.dialog;
    }, function(){
        $.dialog( op );
    });
}
```
通过loadCdnJs方法异步的加载相关脚本，其中需要处理多次加载、加载进度等等问题。
webpack已经为我们做好了这些事情，而且它会将相关的依赖资源提前打包成一个js文件，到时候一次加载即可。示例代码如下：

``` javascript
require.ensure(["module-a", "module-b"], function(require) {
    var a = require("module-a");
    // ...
});
```
通过require.ensure告诉webpack需要异步加载的资源，webpack会把这段代码中提及的相关依赖统统打成一个包，在需要的时候立马加载执行。

**code splitting 参见webpack demo（点击‘地球破洞相关资讯’）**
**[页面 http://martin0417.github.io/webpackDemo/](http://martin0417.github.io/webpackDemo/)**
**[源码 https://github.com/Martin0417/webpackDemo/tree/gh-pages)](https://github.com/Martin0417/webpackDemo/tree/gh-pages)**

可以在Network中发现异步加载了一个`1.chunk.js`文件，弹窗相关的资源（mcss、js、html）都被webpack打在这一个文件里了，是不是很方便？至于这个文件的命名，是在webpack的配置文件中配置的，如下：
``` javascript
module.exports = {
    entry: {..},
    output: {
        ..,
        chunkFilename: "[id].chunk.js"
    },
    module: {
        loaders: [..]
    }
}
```

## 插件系统
插件是在webpack在打包的过程中增加一些额外的处理功能。
webpack的插件分为两种：和。
- **内建插件**：webpack自带的一些比较常用的插件，方便使用
- **其他插件**：由其他开发者开发，对webpack功能的补充

插件通过在配置文件中配置plugins参数使用，配置方法如下：
``` javascript
var webpack = require('webpack');
module.exports = {
    entry: {..},
    output: {..},
    module: {..},
    plugins : [new webpack.optimize.UglifyJsPlugin({//内建的压缩代码插件
            compress: {
                warnings: false
            }
        })]
}
```

官方文档中提供了[插件列表](https://webpack.github.io/docs/list-of-plugins.html)，这里挑几个插件简介：
- 代码压缩插件`new webpack.optimize.UglifyJsPlugin(options)`
对webpack打包生成的代码块进行混淆、压缩。相关配置参见[UglifyJS options](https://github.com/mishoo/UglifyJS2#usage)。
- 共用代码块提取插件 `new webpack.optimize.CommonsChunkPlugin(options)`
当有多个入口脚本时，可以配置该插件对这些脚本的公共依赖进行提取，避免公共依赖重复打包。
- 动态html模板插件 `new html-webpack-plugin(options)`
根据入口脚本，动态的再页面中插入css、script，同时还有压缩html、删除注释、其他动态数据等功能。

## web-dev-server
webpack提供的开发工具，启动后会默认监听8080端口，支持监测资源变动刷新页面、热替换、代理等功能，当资源变动时会重新打包，方便本地开发调试。
使用方法：
- CLI `webpack-dev-server --hot --inline` 
    - hot 热替换 
    - inline 自动刷新页面
- 也可在config配置文件中配置：
``` javascript
var server = new WebpackDevServer(compiler, {
  contentBase: "/path/to/directory",
  hot: true,
  historyApiFallback: false,
  // Set this if you want to enable gzip compression for assets
  compress: true,
  proxy: {
    "*": "http://localhost:9090"
  },
  staticOptions: {
  },
  // webpack-dev-middleware options
  quiet: false,
  noInfo: false,
  lazy: true,
  filename: "bundle.js",
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  publicPath: "/assets/",
  headers: { "X-Custom-Header": "yes" },
  stats: { colors: true }
});
server.listen(8080, "localhost", function() {});
```

更多介绍点这里 https://webpack.github.io/docs/webpack-dev-server.html

## DEMO的配置文件解析
**DEMO目录结构参见源码**
**[页面 http://martin0417.github.io/webpackDemo/](http://martin0417.github.io/webpackDemo/)**
**[源码 https://github.com/Martin0417/webpackDemo/tree/gh-pages)](https://github.com/Martin0417/webpackDemo/tree/gh-pages)**

#### webpack.config.js
``` javascript
var webpack = require('webpack');

var path = require('path');
// 执行环境
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

var publicPath = '';//静态资源路径
var suffix;//文件名后缀
var plugins = [];//插件数组

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
        entry:'./src/entry.js'//入口脚本
    },
    output: {
        path: path.resolve('./src/dist'),//打包后脚本的输出路径
        filename: "[name]"+suffix,//打包后脚本的名字
        chunkFilename: "[id].chunk.js",//分割脚本块的名字
        library:"[name]",
        libraryTarget:'umd',
        publicPath:publicPath//静态资源路径
    },
    module: {
        //加载器
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
        //require路径的别名
        alias:{
            'root' : path.resolve('./src/')
        },
        extensions:["",".js"]//解析文件的默认后缀
    },
    plugins:plugins//插件
}
```

### 循环加载处理


### 应用的工程
[kaola-fed-lib](https://g.hz.netease.com/haitao/kaola-fed-lib)应用了webpack进行打包。
github：ssh://git@g.hz.netease.com:22222/haitao/kaola-fed-lib.git


## 参考文档
- [webpack官方文档](https://webpack.github.io/docs/)
- [[译] 基于 Webpack 和 ES6 打造 JavaScript 类库 #56](https://github.com/cssmagic/blog/issues/56)
- [Webpack 一探究竟](http://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651220238&idx=1&sn=ebdba528f199e10f6b273c3a6fd04650&scene=1&srcid=0419dAU9wBzpuMeoPVOqaM83&from=singlemessage&isappinstalled=0#wechat_redirect)
- [基于webpack的前端工程化开发解决方案探索](http://www.cnblogs.com/souvenir/p/5015418.html)
