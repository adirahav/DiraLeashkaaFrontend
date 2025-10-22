import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router, } from 'react-router-dom'
import { store } from './store/store.js'
import { Provider } from 'react-redux'
import './assets/css/main.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}> 
      <Router>
          <App />
      </Router>
  </Provider>
)


// רישום Service Worker אחרי הרינדור
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.log('SW registration failed:', err));
  });
}