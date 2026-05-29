import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.js';
import store from './store.js';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

(async () => {
  let stripePromise = null;
  
  try {
    const res = await fetch('/api/v1/stripe-publishable-key');
    if (res.ok) {
      const data = await res.json();
      if (data && data.stripePK) {
        stripePromise = loadStripe(data.stripePK);
      }
    }
  } catch (error) {
    console.error("Failed to load Stripe Publishable Key:", error);
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  root.render(
    <React.StrictMode>
      <ReduxProvider store={store}>
        <HelmetProvider>
          <BrowserRouter>
            {stripePromise ? (
              <Elements stripe={stripePromise}>
                <App /> 
              </Elements>
            ) : (
              <App />
            )}
          </BrowserRouter>
        </HelmetProvider>
      </ReduxProvider>
    </React.StrictMode>
  );
})();
