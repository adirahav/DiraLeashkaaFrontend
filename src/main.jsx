import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router, } from 'react-router-dom'
import { store } from './store/store.js'
import { Provider } from 'react-redux'
import './assets/css/main.scss'

import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'

console.log("ADITEST Capacitor platform:", Capacitor.getPlatform())

if (Capacitor.getPlatform() === 'android') {
  console.log("ADITEST Global registering backButton listener")

  CapacitorApp.addListener('backButton', () => {
    console.log("ADITEST Global back button pressed")

    const path = window.location.pathname
    console.log("ADITEST Global Current path:", path)

    if (path === '/' || path === '/home') {
      console.log("ADITEST Global exiting app")
      CapacitorApp.exitApp()
    } else {
      console.log("ADITEST Global navigating back")
      window.history.back()
    }
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}> 
      <Router>
          <App />
      </Router>
  </Provider>
)