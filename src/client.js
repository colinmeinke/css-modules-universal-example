import React from 'react';
import { render } from 'react-dom';

import Hello from './components/Hello';
import World from './components/World';

const HELLO = 'HELLO';
const WORLD = 'WORLD';

let state = HELLO;

const updateState = () => {
  switch ( state ) {
    case HELLO:
      state = WORLD;
      break;
    case WORLD:
    default:
      state = HELLO;
  }
};

const navigate = () => {
  let page;

  switch ( state ) {
    case HELLO:
      page = <Hello />;
      break;
    case WORLD:
      page = <World />;
      break;
    default:
      page = <h1>Not found</h1>;
  }

  render( page, document.querySelector( '.app' ));
};

document.body.addEventListener( 'click', () => {
  updateState();
  navigate();
});

navigate();
