import { useEffect, useState } from 'react'
import { Provider, useSelector } from 'react-redux'     
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'

import { SplashProvider } from './contexts/SplashContext.jsx'

import { store } from './store/store.js'   
import { useInternetStatus } from './hooks/useInternetStatus.jsx'
import { useNativeBackButton } from './hooks/useNativeBackButton.jsx'
import { App as CapacitorApp } from '@capacitor/app'

import { HomePage } from './pages/HomePage'
import { CalculatorsPage } from './pages/CalculatorsPage.jsx'
import { PersonalInfoPage } from './pages/PersonalInfoPage.jsx'
import { FinancialDetailsPage } from './pages/FinancialDetailsPage.jsx'
import { TermsOfUsePage } from './pages/TermsOfUsePage.jsx'
import { ContactUsPage } from './pages/ContactUsPage.jsx'
import { PropertyPage } from './pages/PropertyPage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { SignUpPage } from './pages/SignUpPage.jsx'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.jsx'
import { ErrorPage } from './pages/ErrorPage.jsx'

import { Alert } from './cmps/Alert'
import { Dialog, } from './cmps/Dialog.jsx'
import { CalculatorPage } from './pages/CalculatorPage.jsx'

import { SplashScreen } from '@capacitor/splash-screen'
import { Capacitor } from '@capacitor/core'

function RouteGuard({ children }) {
  const [isOnline, setIsOnline] = useState(true)
  const [isLoggedIn, setLoggedIn] = useState(true)

  const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
  const isLoggedinUserCompleted = useSelector(storeState => storeState.userModule.isLoggedinUserCompleted)
  // internet connection
  /*useInternetStatus((isConnected) => {
    setIsOnline(isConnected)
  }, [])*/

  if (!isOnline) {
    if (!location.pathname.includes('/error')) {
      const redirect = new URL(window.location.href).pathname
      return <Navigate to={`/error?redirect=${encodeURIComponent(redirect)}&errorType=noInternet`} />
    }
  } 

  useEffect(() => {
    SplashScreen.hide()
  }, [])

  
  useEffect(() => {
    setLoggedIn(loggedinUser !== null)
  }, [loggedinUser])

  if (loggedinUser === null && !allowAnonymous()) {
    const navigate = localStorage.getItem("email")
                        ? '/login'
                        : '/signup' 

    return <Navigate to={`${navigate}`} />
  }

  if (loggedinUser && 
      !window.location.toString().includes("signup") && 
      !window.location.toString().includes("login") && 
      !window.location.toString().includes("forgot-password") && 
      !window.location.toString().includes("terms-of-use") && 
      !window.location.toString().includes("contact-us")
    ) {
    if (!isLoggedinUserCompleted) {
          return <Navigate to='/signup' />
    } 
  }

  return children
}

function Orientation({ children }) {
  function setOrientation() {
    if (!document.body.classList.contains('portrate') && !document.body.classList.contains('landscape')) {
      document.body.classList.add("portrate")
    }
  }

  setOrientation()

  return children
}

function allowAnonymous() {
  const pathname = new URL(window.location.href).pathname
  if (pathname === "/error") return true
  if (pathname === "/login") return true
  if (pathname === "/forgot-password") return true
  if (pathname === "/signup") return true
  if (pathname === "/terms-of-use") return true
  if (pathname === "/contact-us") return true
  return false
}

function App() {
  const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
  const mainLayoutClass = `main-layout ${allowAnonymous() && !loggedinUser ? 'logout' : ''} ${Capacitor.getPlatform()}`
  const navigate = useNavigate()
  const location = useLocation()

  useNativeBackButton(() => {
    if (location.pathname === '/home' || location.pathname === '/login') {
      CapacitorApp.exitApp()
    } else {
      navigate(-1)
    }
  })

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const initAdMobConsent = () => {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.consent) {
          window.cordova.plugins.consent.requestInfoUpdate(() => {
            window.cordova.plugins.consent.showForm((status) => {
              console.log("Consent form status:", status)
            })
          })
        }
      }

      document.addEventListener("deviceready", initAdMobConsent, false)
    }
  }, [])

  return (    
    <SplashProvider>
      <Provider store={store}>    
          <section className={mainLayoutClass}>
              <Routes>
                  <Route path="/" element={<RouteGuard><HomePage /></RouteGuard>} />
                  <Route path="/error" element={<RouteGuard><ErrorPage /></RouteGuard>} />
                  <Route path="/login" element={<RouteGuard><LoginPage /></RouteGuard>} />
                  <Route path="/signup" element={<RouteGuard><SignUpPage /></RouteGuard>} />
                  <Route path="/forgot-password" element={<RouteGuard><ForgotPasswordPage /></RouteGuard>} />
                  <Route path="/home" element={<RouteGuard><HomePage /></RouteGuard>} />
                  <Route path="/property" element={<RouteGuard><Orientation><PropertyPage /></Orientation></RouteGuard>} />
                  <Route path="/calculators" element={<RouteGuard><CalculatorsPage /></RouteGuard>} />
                  <Route path="/calculator" element={<RouteGuard><CalculatorPage /></RouteGuard>} />
                  <Route path="/personal-info" element={<RouteGuard><PersonalInfoPage /></RouteGuard>} />
                  <Route path="/financial-details" element={<RouteGuard><FinancialDetailsPage /></RouteGuard>} />
                  <Route path="/terms-of-use" element={<RouteGuard><TermsOfUsePage /></RouteGuard>} />
                  <Route path="/contact-us" element={<RouteGuard><ContactUsPage /></RouteGuard>} />
              </Routes>
              
              <Alert />
              <Dialog />
          </section>
      </Provider>
    </SplashProvider>
    )
}

export default App

/*

- mobile delete - cancel delete the property
- הוצאות נלוות נוספות

- במעבר ל-HOME תמיד יש קפיצה כפולה

- sign up loading when no phrases not looks good - desktop / tablet
- sign up not show title after complete and before move on
- home page - when no items the image show slow
- calculators - transparent cities icons

- app - in menu - web link not opening
- app - learn native lifesycle

- adirahav76@gmail.com and adi_rahav@yahoo.com - not login properly

- לשים פרסומות
- lazy load
- סדר במונחים - continue from header

- camera upload not work
- max price - missing years

- delete image from cloudinary
- לינק לאפליקציה
- micro services
- Grpc - proto files
- Graph api
- cicd
+ compile to android app

*/
