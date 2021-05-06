import React from 'react';
import { AuthContextProvider } from './src/Contexts/AuthContext';

import Routes from './src/routes';


export default function App() {
  return ( 
    <AuthContextProvider>
      <Routes/>
    </AuthContextProvider>
  );
}


