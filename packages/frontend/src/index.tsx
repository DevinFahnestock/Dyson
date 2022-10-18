import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

import AuthenticationProvider from './lib/firebase/authenticationProvider'
import { PlanetsProvider } from './lib/hooks/usePlanets'
import { WarehouseProvider } from './lib/hooks/useWarehouse'
import { TokenProvider } from './lib/hooks/useToken'

const firebaseConfig = {
  apiKey: 'AIzaSyCVlFMqt9BuAiu-tX7TFa4x8sUwxqxmc7g',
  authDomain: 'dyson-game.firebaseapp.com',
  projectId: 'dyson-game',
  storageBucket: 'dyson-game.appspot.com',
  messagingSenderId: '257383001172',
  appId: '1:257383001172:web:3e16938ed632aa28ff11c1',
  measurementId: 'G-FPXP0ZX3H3',
}

const rootElement = document.getElementById('root')

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement)
  const firebaseApp = initializeApp(firebaseConfig)

  root.render(
    // <React.StrictMode>
    <AuthenticationProvider value={getAuth(firebaseApp)}>
      <TokenProvider>
        <PlanetsProvider>
          <WarehouseProvider>
            <App />
          </WarehouseProvider>
        </PlanetsProvider>
      </TokenProvider>
    </AuthenticationProvider>
    // </React.StrictMode>
  )
}
reportWebVitals()
