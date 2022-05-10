import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"

import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

import AuthenticationProvider from './lib/firebase/authenticationProvider'

const firebaseConfig = {
  apiKey: "AIzaSyCVlFMqt9BuAiu-tX7TFa4x8sUwxqxmc7g",
  authDomain: "dyson-game.firebaseapp.com",
  projectId: "dyson-game",
  storageBucket: "dyson-game.appspot.com",
  messagingSenderId: "257383001172",
  appId: "1:257383001172:web:3e16938ed632aa28ff11c1",
  measurementId: "G-FPXP0ZX3H3",
}


const firebaseApp = initializeApp(firebaseConfig)

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <AuthenticationProvider value={getAuth(firebaseApp)}>
      <App />
    </AuthenticationProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
