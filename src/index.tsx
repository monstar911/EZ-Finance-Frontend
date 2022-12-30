import React from 'react';
import ReactDOM from 'react-dom/client';
import { Theme } from '@mui/material/styles';
import App from './App';
import './index.css';

declare global {
    interface Window {
        aptos: any;
    }
}

declare global {
    interface Window {
        martian: any;
    }
}

declare global {
    interface Window {
        pontem: any;
    }
}

declare module '@mui/styles/defaultTheme' {
    interface DefaultTheme extends Theme {
        borderRadius: '4px',
    }
}

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
