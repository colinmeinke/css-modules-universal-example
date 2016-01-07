import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
  output: {
    path: './dist',
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      loaders: [ 'babel' ],
      test: /\.js$/,
    },
    {
      loader: ExtractTextPlugin.extract( 'style', 'css?modules' ),
      test: /\.css$/,
    }],
  },
};
