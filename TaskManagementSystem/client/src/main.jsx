import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/styles/index.css'
import RouterApp from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterApp />
    </AuthProvider>
  </React.StrictMode>,
)
