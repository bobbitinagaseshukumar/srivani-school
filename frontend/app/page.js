'use client';

import React from 'react';
import App from '../src/App';
import { AppProvider } from '../src/context/AppContext';

export default function Page() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
