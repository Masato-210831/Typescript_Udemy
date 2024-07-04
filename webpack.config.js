const path = require('path') // requireはnode.jsでモジュールをインストールする構文
const Dotenv =require('dotenv-webpack')


module.exports = {
  mode: 'development',
  entry: './src/app.ts', // ブラウザで初めに読み込まれるモジュールを指定、ルートノード？？
  output: {
    filename: 'bundle.js', // 任意の名前でOK!!
    path: path.resolve(__dirname, 'dist'), // 絶対pathなので注意！！
    publicPath: '/dist' // dev-serverからの相対パス、紐付け
  },
  devtool: 'inline-source-map',
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
  devtool: 'source-map',
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
  plugins:[
    new Dotenv(),
  ]
};
