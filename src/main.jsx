import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@fontsource-variable/plus-jakarta-sans'; // self-hosted font, no CDN needed
import './index.css';

// Entry point: mounts the app into <div id="root"> (see index.html).
// BrowserRouter gives every component access to React Router's hooks and links.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);