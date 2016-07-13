var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var ExtractTextPlugin = require("extract-text-webpack-plugin"); // 提取文件的webpack插件

// 全局依赖
var deps = [
  'jquery/dist/jquery.js'
];

var config = {
  // 配置输入模块
  entry: {
    'index': './js/index.js',
    'article': './js/article.js',
    'tag': './js/tag.js',
    '500': './js/500.js',
    'search': './js/search.js',
    'data-view': './js/data-view.js'
  },
  // 配置加载的默认搜索的路径
  resolve: {
    extensions: ["", ".js"],
    modulesDirectories: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'css'),
      path.resolve(__dirname, 'js')
    ],
    alias: {}
  },
  // 配置输出
  output: {
    filename: "js/[name].js?[hash]-[hash]",
    chunkFilename: "[name].js?[hash]-[hash]",
    path: __dirname + "/assets/",
    publicPath: "/assets/"
  },
  module: {
    noParse: [],
    loaders: [
      // 因为less现存在数学运算的问题（如calc无法计算），所以将其与css分离
      { test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          "style-loader",
          "css-loader!less-loader?sourceMap",
          {
            // 图片、字体资源打包到css上级目录
            publicPath: "../"
          }
        )
      },
      { test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          "style-loader",
          "css-loader?sourceMap",
          {
            // 图片、字体资源打包到css上级目录
            publicPath: "../"
          }
        )
      },
      // babel处理es6
      {
        test: /\.js?$/,
        exclude: [
          node_modules
        ],
        loader: 'babel'
      },
      // 导出全局依赖
      {
        test: path.resolve(node_modules, deps[0]),
        loader: 'expose?jQuery'
      },
      // 图片及字体打包
      {
        test: /\.(ttf|eot|svg|png|gif|woff(2)?)(\?.*?)?$/,
        loader: "file-loader"
      }
    ]
  },
  plugins: [
    // 配置以文件形式打包css
    new ExtractTextPlugin("css/[name].css?[hash]-[chunkhash]-[contenthash]-[name]", {
      disable: false,
      allChunks: true
    })
  ]
};

// 其它
deps.forEach(function (dep) {
  var depPath = path.resolve(node_modules, dep);
  config.resolve.alias[dep.split(path.sep)[0].split('\/')[0]] = depPath; // 设置替换模块名称与路径
  config.module.noParse.push(depPath); // 设置不解析的文件
});

module.exports = config;