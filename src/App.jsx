import { Suspense, lazy } from 'react'
import { HomePage } from './pages/HomePage'
import { Alert } from './cmps/Alert'
import { Routes, Route, Navigate } from 'react-router-dom'
import { DynamicModalPage } from './pages/DynamicModalPage'
import { DynamicModal } from './cmps/DynamicModal'
import { ReactOptimizationPage } from './pages/ReactOptimizationPage'
import { InfiniteScrollPage } from './pages/InfiniteScrollPage'
const LazyLoadPage = lazy(() => import('./pages/LazyLoadPage'))
import { ImageUploadPage } from './pages/ImageUploadPage'
import { AlertPage } from './pages/AlertPage'
import { LoadingPage } from './pages/LoadingPage'
import { DebouncePage } from './pages/DebouncePage'
import { FilterPage } from './pages/FilterPage'
import { CoockiePage } from './pages/CoockiePage'
import { RouteGuardPage } from './pages/RouteGuardPage'
import { store } from './store/store.js'    /* STORE: [ALL] STEP 1 */
import { Provider } from 'react-redux'      /* STORE: [ALL] STEP 2 */
import { AuthPage } from './pages/AuthPage.jsx'
import { CrudlPage } from './pages/CrudlePage.jsx'
import { CalculatorsPage } from './pages/CalculatorsPage.jsx'
import { PersonalInfoPage } from './pages/PersonalInfoPage.jsx'
import { FinancialInfoPage } from './pages/FinancialInfoPage.jsx'
import { RegistrationDetailsPage } from './pages/RegistrationDetailsPage.jsx'
import { TermsOfUsePage } from './pages/TermsOfUsePage.jsx'
import { ContactUsPage } from './pages/ContactUsPage.jsx'
import { PropertyPage } from './pages/PropertyPage.jsx'

function RouteGuard({ children }) {
    function isAllow() { 
      //return true
      return false
    }
  
    if (!isAllow()) {
      return <Navigate to="/" />
    }
  
    return children
  }

function App() {
  return (    
    <Provider store={store}>    
        <section className='main-layout'>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/property" element={<PropertyPage />} />
                <Route path="/calculators" element={<CalculatorsPage />} />
                <Route path="/personal-info" element={<PersonalInfoPage />} />
                <Route path="/financial-info" element={<FinancialInfoPage />} />
                <Route path="/registration-details" element={<RegistrationDetailsPage />} />
                <Route path="/terms-of-use" element={<TermsOfUsePage />} />
                <Route path="/contact-us" element={<ContactUsPage />} />
                
                <Route path="/alert" element={<AlertPage />} />
                <Route path="/dynamic-modal" element={<DynamicModalPage />} />
                <Route path="/react-optimization" element={<ReactOptimizationPage />} />
                <Route path="/infinite-scroll" element={<InfiniteScrollPage />} />
                <Route path="/lazy-load" element={ <Suspense fallback={<div>Loading LazyLoadPage...</div>}><LazyLoadPage /> </Suspense>} ></Route>
                <Route path="/image-upload" element={<ImageUploadPage />} />
                <Route path="/crudl" element={<CrudlPage />} />
                <Route path="/loading" element={<LoadingPage />} />
                <Route path="/debounce" element={<DebouncePage />} />
                <Route path="/filter" element={<FilterPage />} />
                <Route path="/coockie" element={<CoockiePage />} />
                <Route path="/route-guard" element={<RouteGuard><RouteGuardPage /></RouteGuard>} />
                <Route path="/auth" element={<AuthPage />} />
            </Routes>
            
            <DynamicModal />
            <Alert />
        </section>
    </Provider>
    )
}

export default App