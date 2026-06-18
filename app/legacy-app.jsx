'use client';

import App from '../frontend/src/App';
import { AppProvider } from '../frontend/src/context/AppContext';

export default function LegacyApp() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
