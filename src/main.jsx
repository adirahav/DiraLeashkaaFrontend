import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router, } from 'react-router-dom'
import { store } from './store/store.js'
import { Provider } from 'react-redux'
import './assets/css/main.scss'

import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}> 
      <Router>
          <App />
      </Router>
  </Provider>
)