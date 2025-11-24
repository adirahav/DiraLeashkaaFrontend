import { useEffect, useState } from 'react'
import { Provider, useSelector } from 'react-redux'     
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'

import { SplashProvider } from './contexts/SplashContext.jsx'

import { store } from './store/store.js'   
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
import { LandingPage } from './pages/LandingPage.jsx'
import { AccessibilityStatementPage } from './pages/AccessibilityStatementPage.jsx'
import { AccessibilityPanel } from './cmps/AccessibilityPanel'
import PropTypes from 'prop-types'
import { getFromStorage, utilService } from './services/util.service.js'
import { setLoggedinUser } from './store/actions/user.actions.js'
import jwt_decode from "jwt-decode"
import { authService } from './services/auth.service.js'

function RouteGuard({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [isLoggeinUserInit, setIsLoggeinUserInit] = useState(false)

  const loggedinUserState = useSelector(storeState => storeState.userModule.loggedinUser)
  const isLoggedinUserCompleted = useSelector(storeState => storeState.userModule.isLoggedinUserCompleted)

  useEffect(() => {
    if (SplashScreen && typeof SplashScreen.hide === 'function') {
      SplashScreen.hide()
        .catch(err => console.warn('Failed to hide splash screen:', err))
    }

    (async () => {
      const token = await getFromStorage('token')
      if (token) {
        const loggedinUser = jwt_decode(token)
        const isTokenExoired = utilService.isTokenExoired(loggedinUser.exp)
        setLoggedinUser(isTokenExoired ? null : loggedinUser)
      }

      setIsLoggeinUserInit(true)
    })()
  }, [])

  useEffect(() => {
    if (isLoggedinUserCompleted && loggedinUserState === null && !allowAnonymous()) {
      (async () => {
        try {
          const email = await utilService.getFromStorage("email")
          navigate(email ? '/login' : '/landing', { replace: true })
        } catch (err) {
          navigate('/landing', { replace: true })
        }
      })()
    }
  }, [loggedinUserState, isLoggedinUserCompleted])

  // If logged in but user not completed
  useEffect(() => {
    if (!isLoggeinUserInit) {
      return
    }

    if (!loggedinUserState && !allowAnonymous()) {
      navigate('/login', { replace: true })
    } else if (loggedinUserState && !allowAnonymous() && !isLoggedinUserCompleted) {
      navigate('/signup', { replace: true })
    }

  }, [loggedinUserState, isLoggedinUserCompleted, isLoggeinUserInit])

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
  if (pathname === "/landing") return true
  return false
}

function App() {
  const loggedinUserState = useSelector(storeState => storeState.userModule.loggedinUser)
  const mainLayoutClass = `main-layout ${allowAnonymous() && !loggedinUserState ? 'logout' : ''} ${Capacitor.getPlatform()}`
  const navigate = useNavigate()
  const location = useLocation()

  const showAccessibilityPanelState = useSelector(storeState => storeState.appModule.accessibility.showAccessibilityPanel)
  const customeFontSizeState = useSelector(storeState => storeState.appModule.accessibility.customeFontSize)
  const [customeFontSize, setCustomeFontSize] = useState(customeFontSizeState)

  useEffect(() => {
    if (customeFontSize) {
      document.documentElement.style.fontSize = `${customeFontSize}px`
      document.documentElement.style.setProperty('--custome-font-size', `${customeFontSize}px`)
    }
  }, [customeFontSize])

  useEffect(() => {
    if (customeFontSizeState) {
      setCustomeFontSize(customeFontSizeState)
    }
  }, [customeFontSizeState])

  useNativeBackButton(() => {
    if (location.pathname === '/home' || location.pathname === '/login') {
      CapacitorApp.exitApp()
    } else {
      navigate(-1)
    }
  })

  useEffect(() => {
    if (["/login", "/landing", "/signup"].includes(location.pathname)) return

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
  }, [location.pathname])

  return (    
    <SplashProvider>
      <Provider store={store}>    
          <section className={mainLayoutClass}>
              <Routes>
                  <Route path="/" element={<RouteGuard><HomePage /></RouteGuard>} />
                  <Route path="/error" element={<RouteGuard><ErrorPage /></RouteGuard>} />
                  <Route path="/login" element={<RouteGuard><LoginPage /></RouteGuard>} />
                  <Route path="/signup" element={<RouteGuard><SignUpPage /></RouteGuard>} />
                  <Route path="/landing" element={<RouteGuard><LandingPage /></RouteGuard>} />
                  <Route path="/forgot-password" element={<RouteGuard><ForgotPasswordPage /></RouteGuard>} />
                  <Route path="/home" element={<RouteGuard><HomePage /></RouteGuard>} />
                  <Route path="/property" element={<RouteGuard><Orientation><PropertyPage key={location.search} /></Orientation></RouteGuard>} />
                  <Route path="/calculators" element={<RouteGuard><CalculatorsPage /></RouteGuard>} />
                  <Route path="/calculator" element={<RouteGuard><CalculatorPage /></RouteGuard>} />
                  <Route path="/personal-info" element={<RouteGuard><PersonalInfoPage /></RouteGuard>} />
                  <Route path="/financial-details" element={<RouteGuard><FinancialDetailsPage /></RouteGuard>} />
                  <Route path="/terms-of-use" element={<RouteGuard><TermsOfUsePage /></RouteGuard>} />
                  <Route path="/contact-us" element={<RouteGuard><ContactUsPage /></RouteGuard>} />
                  <Route path="/accessibility-statement" element={<RouteGuard><AccessibilityStatementPage /></RouteGuard>} />
              </Routes>
              
              <Alert />
              <Dialog />
              {showAccessibilityPanelState && <AccessibilityPanel />}
          </section>
      </Provider>
    </SplashProvider>
    )
}

export default App

RouteGuard.propTypes = {
  children: PropTypes.node.isRequired
}

Orientation.propTypes = {
  children: PropTypes.node.isRequired
}

/*
- db indexes
- mobile delete - cancel delete the property
- הוצאות נלוות נוספות
- להוסיף הון עצמי מהלוואה/מקור אחר
- להוסיף שמירה של השוואות
- ברירום נעלמה הכותרת
- הוסף נכס בתוך נכס דורס אותו
- בפרטים אישיים השנת לידה לא נשמרת
- ב-FOOTER האייקונים בצבע שחור
- במחשבון השוואות ה-LOADING לא נראה טוב
- change PUT to PETCH in relevant routes
- using externalId
- במעבר ל-HOME תמיד יש קפיצה כפולה

- sign up loading when no phrases not looks good - desktop / tablet
- calculators - transparent cities icons

- app - in menu - web link not opening
- app - learn native lifesycle

- web לשים פרסומות

- camera upload not work

- delete image from cloudinary
- micro services
- Grpc - proto files
- Graph api
- cicd
- cache
+ authentication - JWT    
- docker
- ENE Testing
- PWA

https://www.youtube.com/watch?v=acFKylH0rc4
https://www.youtube.com/watch?v=H_8XHnaoA6s

~ רווח פרסומת ב-LOADING

Coding Academy Live - Mastering The Backend - Part1
https://www.youtube.com/watch?v=mXdAhchL-SQ

Coding Academy Live - Mastering The Backend - Part2
https://www.youtube.com/watch?v=9VzJtckenYg
*/