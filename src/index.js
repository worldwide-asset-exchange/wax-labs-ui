import './index.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { register } from './serviceWorker';

import { Anchor } from 'ual-anchor';
import { Wax } from '@eosdacio/ual-wax';

import { UALProvider, withUAL } from 'ual-reactjs-renderer';

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');

const waxChain = {
    chainId: process.env.REACT_APP_WAX_CHAINID,
    rpcEndpoints: [
        {
            protocol: process.env.REACT_APP_WAX_PROTOCOL,
            host: process.env.REACT_APP_WAX_HOST,
            port: process.env.REACT_APP_WAX_PORT
        }
    ]
};

const AppWithUAL = withUAL(App);
const appName = 'Wax Labs';
const anchor = new Anchor([waxChain], { appName: appName });
const waxcloud = new Wax([waxChain], { appName: appName });

const root = createRoot(container);
root.render(
    <UALProvider
        chains={[waxChain]}
        authenticators={[waxcloud, anchor]}
        appName={appName}
    >
        <Router>
            <AppWithUAL />
        </Router>
    </UALProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
register();
