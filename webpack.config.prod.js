const path = require('path') // requireはnode.jsでモジュールをインストールする構文
const CleanPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/app.ts', // ブラウザで初めに読み込まれるモジュールを指定、ルートノード？？
  output: {
    filename: 'bundle.js', // 任意の名前でOK!!
    path: path.resolve(__dirname, 'dist'), // 絶対pathなので注意！！
  },
  devtool: 'false',
  devServer: {
    static:[
      {
        directory: path.resolve(__dirname, 'dist'),
        publicPath: '/dist',
      },
      {
        directory: __dirname,
        publicPath: '/',
      },
    ],
  },
  devtool: 'eval',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'] // import文からtsとjs拡張子のファイルを探す
  },
  plugins: [
    new CleanPlugin.CleanWebpackPlugin(),
  ]
};
