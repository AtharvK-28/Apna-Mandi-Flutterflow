import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Routes from './Routes';
import ConnectionStatus from './components/ui/ConnectionStatus';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { VoiceProvider } from './contexts/VoiceContext';
import { WorkProvider } from './contexts/WorkContext';

// AuthProvider sits outermost because routing, navigation and the cart all
// depend on knowing who is signed in. The floating cart button used to be
// mounted here, outside the router — which is why it appeared over the login
// screen and the supplier dashboard. It now lives inside the pages that sell.
function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <VoiceProvider>
          <ToastProvider>
            <AuthProvider>
              <WorkProvider>
                <CartProvider>
                  <Routes />
                  {/* Outside the router: losing the network is a fact about the
                      whole app, not about whichever page happens to be open. */}
                  <ConnectionStatus />
                </CartProvider>
              </WorkProvider>
            </AuthProvider>
          </ToastProvider>
        </VoiceProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
