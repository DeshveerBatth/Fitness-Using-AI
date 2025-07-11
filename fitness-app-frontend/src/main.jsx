import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';

import { AuthProvider } from 'react-oauth2-code-pkce'; 
import {authConfig} from './authConfig';     

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <AuthProvider authConfig={authConfig}
                  loadingComponent = {<div> Loading...</div>}>
      <Provider store={store}>
        <App />
      </Provider>
    </AuthProvider>
  </StrictMode>
);
