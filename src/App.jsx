import { useEffect, useState } from 'react'
import { Provider, useSelector } from 'react-redux'     
import { Routes, Route, Navigate } from 'react-router-dom'

import { SplashProvider } from './contexts/SplashContext.jsx'

import { store } from './store/store.js'   
import { useInternetStatus } from './hooks/useInternetStatus.jsx'

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
import { Toast } from './cmps/Toast.jsx'
import { Dialog, } from './cmps/Dialog.jsx'
import { CopyrightPage } from './pages/CopyrightPage.jsx'

function RouteGuard({ children }) {
  const [isOnline, setIsOnline] = useState(true)
  const [isLoggedIn, setLoggedIn] = useState(true)

  const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)

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

  // logged in
  useEffect(() => {
    setLoggedIn(loggedinUser !== null)
  }, [loggedinUser])

  if (loggedinUser === null && !allowAnonymous()) {
    const navigate = localStorage.getItem("email")
                        ? '/login'
                        : '/signup' 

    return <Navigate to={`${navigate}`} />
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
  const mainLayoutClass = `main-layout ${allowAnonymous() && !loggedinUser ? 'logout' : ''}`

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
                  <Route path="/personal-info" element={<RouteGuard><PersonalInfoPage /></RouteGuard>} />
                  <Route path="/financial-details" element={<RouteGuard><FinancialDetailsPage /></RouteGuard>} />
                  <Route path="/terms-of-use" element={<RouteGuard><TermsOfUsePage /></RouteGuard>} />
                  <Route path="/copyright" element={<RouteGuard><CopyrightPage /></RouteGuard>} />
                  <Route path="/contact-us" element={<RouteGuard><ContactUsPage /></RouteGuard>} />
              </Routes>
              
              <Alert />
              <Toast />
              <Dialog />
          </section>
      </Provider>
    </SplashProvider>
    )
}

export default App

/*
+ פרטים אישיים
+ נתונים כלכליים
+ שלום אורח
+ לנקות את הקוד
+ חזור במובייל

+ לתקן לוגין שמוביל לרישום
+ במובייל לסדר את התפרטי העליון
+ תנאי שימוש מובייל
+ זכויות יוצרים 
+ phrases - event bus

+ ה-DEBOUND משובש
+ צור קשר
+ עמוד הבית כשאין נכסים
+ ה-PROERTY לגמרי משובש
+ brokerMortgage 0 לא עובד

+ תמיד מופיע ROLLBACK
+ כשמייצרים נכס חדש ומרפרשים, אז נוצר עוד אחד
+ כשלוחצים על HOME יש שגיאה
+ שגיאה בשרת בגלל נכס לא קיים מורידה אותו

- לשים פרסומות
? עמוד הבית - מחיקה משובש

- בהרשמה אין רווח למעלה
- הרבה נכסים מעטים מאד את קצב העליה
- לינק לאפליקציה
- שתף
- מחשבונים
- לעצב מחדש
- micro services
- lazy load
- image upload
*/