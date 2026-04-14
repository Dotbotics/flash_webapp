/**
 * MAIN.TSX
 * 
 * What it does:
 * The entry point for the React application. It mounts the root 
 * 'App' component into the DOM.
 * 
 * Why it exists:
 * To bootstrap the React application and provide a global context 
 * (like the HelmetProvider for SEO).
 * 
 * How it works:
 * - Imports the global CSS file.
 * - Uses React 18's 'createRoot' to render the application.
 * 
 * Connections:
 * - Imports 'App.tsx'.
 * - Mounts into the 'root' element in 'index.html'.
 * 
 * Module: App / Entry
 */

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import '../styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
