const path = require('path');

module.exports = {
  entry: './index.js',
  target: 'node',
  resolve: {
    extensions: ['.js', '.ts', '.json', '.cjs']
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'production'
};