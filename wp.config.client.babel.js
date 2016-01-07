import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import baseConfig from './wp.config.babel';

export default {
  ...baseConfig,
  entry: [ './src/client' ],
  output: {
    ...baseConfig.output,
    filename: 'client.js',
  },
  plugins: [
    new ExtractTextPlugin( 'styles.css' ),
  ],
};
