import fs from 'fs';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import baseConfig from './wp.config.babel';

let nodeModules = {};

fs.readdirSync( 'node_modules' )
  .filter( file => {
    return !file.includes( '.bin' );
  })
  .forEach( module => {
    nodeModules[ module ] = `commonjs ${ module }`;
  });

export default {
  ...baseConfig,
  entry: './src/server',
  externals: nodeModules,
  node: {
    __dirname: false,
  },
  output: {
    ...baseConfig.output,
    filename: 'server.js',
  },
  plugins: [
    new ExtractTextPlugin( 'tmp.css' ),
  ],
  target: 'node',
};
