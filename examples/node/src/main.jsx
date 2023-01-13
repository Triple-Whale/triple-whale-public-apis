import React from 'react'
import ReactDOM from 'react-dom/client'

import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';

import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppProvider i18n={enTranslations}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </AppProvider>
)
