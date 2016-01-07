import express from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';

import Hello from './components/Hello';

const app = express();

app.get( '/', ( req, res ) => {
  res.send(
    `<!DOCTYPE html>
     <html style="height: 100%">
       <head>
         <title>CSS modules example</title>
         <link rel="stylesheet" href="/styles.css">
       </head>
       <body style="height: 100%; margin: 0">
         <div
           class="app"
           style="height: 100%"
         >${ renderToString( <Hello /> )}</div>
       </body>
       <script defer src="/client.js" /></script>
     </html>`
  );
});

app.get( '/client.js', ( req, res ) => {
  res.sendFile( path.join( __dirname, '..', 'dist', 'client.js' ));
});

app.get( '/styles.css', ( req, res ) => {
  res.sendFile( path.join( __dirname, '..', 'dist', 'styles.css' ));
});

app.listen( 3000 );
