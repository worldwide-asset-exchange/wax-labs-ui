import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Anchor } from 'ual-anchor'
import { Scatter } from 'ual-scatter'
import { Wax } from '@eosdacio/ual-wax'

import { JsonRpc } from 'eosjs'
import { UALProvider, withUAL } from 'ual-reactjs-renderer'

const waxChain = {
  chainId: process.env.REACT_APP_WAX_CHAINID,
  rpcEndpoints: [{
    protocol: process.env.REACT_APP_WAX_PROTOCOL,
    host: process.env.REACT_APP_WAX_HOST,
    port: process.env.REACT_APP_WAX_PORT,
  }]
}
 
const AppWithUAL = withUAL(App)

const appName = process.env.REACT_APP_NAME
const scatter = new Scatter([waxChain], { appName: appName });
const anchor = new Anchor([waxChain], { appName: appName });
const waxcloud = new Wax([waxChain], { appName: appName });

ReactDOM.render(
  <React.StrictMode>
    <UALProvider chains={[waxChain]} authenticators={[waxcloud, anchor, scatter ]} appName={appName}>
      <AppwWithUAL />
    </UALProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
