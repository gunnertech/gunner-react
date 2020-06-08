const path = require('path');


module.exports = {
  // 1
  entry: './src/index.js',
  // 2
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  // 3
  devServer: {
    contentBase: './dist'
  },
  node: {
    fs: "empty"
  },
  resolve: {
    alias: {
      'gunner/core': path.resolve(__dirname, 'dist/'),
      'gunner/core/*': path.resolve(__dirname, 'dist/*'),
      'gunner/react': path.resolve(__dirname, 'dist/React'),
      'gunner/react/*': path.resolve(__dirname, 'dist/React/*')
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ["@babel/plugin-proposal-optional-chaining", "@babel/plugin-proposal-nullish-coalescing-operator", "source-map-support", "@babel/plugin-transform-react-jsx", "@babel/plugin-proposal-export-default-from", '@babel/plugin-proposal-object-rest-spread']
          }
        }
      }
    ]
  }
  
};
