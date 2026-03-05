import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { PropertyForm } from '../cmps/PropertyForm'
import { PropertyInterests } from '../cmps/PropertyInterests'
import { PropertyYieldForecast } from '../cmps/PropertyYieldForecast'
import { propertyService } from '../services/property.service'
import { PropertyAmortizationSchedule } from '../cmps/PropertyAmortizationSchedule'
import { PropertyChart } from '../cmps/PropertyChart'
import { utilService } from '../services/util.service'
import { Overlay } from '../cmps/Overlay'
import Lottie from "lottie-react"
import animCalculating from '../assets/images/anim_calculating.json'
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'
import { authService } from '../services/auth.service'
import { useSplash } from '../contexts/SplashContext.jsx'
import { useSelector } from 'react-redux'
import { PropertyMedia } from '../cmps/PropertyMedia.jsx'
import { useNativeBackButton } from '../hooks/useNativeBackButton.jsx'

import iconMissingData from '../assets/images/missing_data.png'
import iconLock from '../assets/images/icon_lock.svg'
import iconYieldForecastOff from '../assets/images/icon_yield_forecast_off.png'
import iconYieldForecastOn from '../assets/images/icon_yield_forecast_on.png'
import iconYieldForecastDisable from '../assets/images/icon_yield_forecast_disable.png'
import iconAmortizationScheduleOff from '../assets/images/icon_amortization_schedule_off.png'
import iconAmortizationScheduleOn from '../assets/images/icon_amortization_schedule_on.png'
import iconAmortizationScheduleDisable from '../assets/images/icon_amortization_schedule_disable.png'
import iconChartOff from '../assets/images/icon_chart_off.png'
import iconChartOn from '../assets/images/icon_chart_on.png'
import iconChartDisable from '../assets/images/icon_chart_disable.png'
import { ZoomOutIcon, DoubleArrowDownIcon } from '../assets/icons'
import { Capacitor } from '@capacitor/core'


export function PropertyPage() {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    let propertyUUID = queryParams.get('propertyUUID')
    const city = queryParams.get('city')
    
    const [property, setProperty] = useState(null)
    const [showInterestsContainer, setShowInterestsContainer] = useState(null)
    const [lockYields, setLockYields] = useState(false)
    const [isFirstLoading, setIsFirstLoading] = useState(true)
    const [showOverlay, setShowOverlay] = useState(false)
    const [showMobileData, setShowMobileData] = useState("")
    const [fragment, setFragment] = useState("form")
    const [preventUpdateServer, setPreventUpdateServer] = useState(city !== null)
    //const [isBlocked, setIsBlocked] = useState(false)
    const [showGoToResults, setShowGoToResults] = useState(false)
    const [isDataVisible, setIsDataVisible] = useState(false)
    
    const loggedinUserState = useSelector(storeState => storeState.userModule.loggedinUser)
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    
    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters
    //const calculators = splash?.calculators

    const [isWaitingSplash, setIsWaitingSplash] = useState(!phrases || !fixedParameters/* || !calculators*/)
    
    const navigate = useNavigate()

    const dataRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            setIsDataVisible(entry.isIntersecting)
          },
          { threshold: 0.1 } 
        )
    
        const currentElement = dataRef.current
        if (currentElement) {
          observer.observe(currentElement)
        }
    
        return () => {
          if (currentElement) {
            observer.unobserve(currentElement)
          }
        }
      }, [])

    useNativeBackButton((superBack) => {
        if (fragment !== "form") {
          setFragment("form")
          setShowMobileData('')
        } else {
          superBack()
        }
    })

    useEffect(() => {
        setIsWaitingSplash(!phrases || !fixedParameters /*|| !calculators*/)
    }, [phrases])

    useEffect(() => {
        setIsWaitingSplash(!phrases || !fixedParameters /*|| !calculators*/)
    
        if (!isWaitingSplash) {
            onLoadingDone()  
            
            if (propertyUUID) {
                fetchProperty() 
            } else {
                setProperty(null)
                setIsFirstLoading(false)
                setPreventUpdateServer(true)
                setShowInterestsContainer(true) 
                setLockYields(true)
            }
        }
    }, [isWaitingSplash])

    useEffect(() => {
        if (city) {
            setProperty({city})
        }
    }, [city])

    useEffect(() => {
        if (property && !hasOnlyCity(property)) {
            if (showInterestsContainer === null) {
                setPreventUpdateServer(true)
                setShowInterestsContainer(property.showInterestsContainer) 
            }
            
            setLockYields(property.calcYieldForecast === null) 
        } 

        if (!propertyUUID && property?.uuid) {
            propertyUUID = property?.uuid
            window.history.pushState(null, '', `/property?propertyUUID=${propertyUUID}`)
        }
    }, [property, propertyUUID])

    useEffect(() => {
        if (showInterestsContainer === null || preventUpdateServer) {
            return
        }

        const propertyToUpdate = { 
            propertyUUID,
            fieldName: 'showInterestsContainer',
            fieldValue: showInterestsContainer
        }
        
        if (!preventUpdateServer && propertyUUID) {
            propertyService.save(propertyToUpdate)
        }

        setPreventUpdateServer(false)
        
    }, [showInterestsContainer, preventUpdateServer, propertyUUID])

    useEffect(() => {
        switch (fragment) {
            case "form": 
                document.body.classList.remove("landscape")
                if (!document.body.classList.contains('portrate')) {
                    document.body.classList.add("portrate")
                }

                window.onpopstate = function() {
                    window.location.href = "/home"
                } 
                history.pushState({}, '')
                
                break
            case "yield-forecast":
            case "amortization-schedule":
            case "chart":
                document.body.classList.remove("portrate")
                if (!document.body.classList.contains('landscape')) {
                    document.body.classList.add("landscape")
                }

                if (Capacitor.getPlatform() !== 'android') {
                    window.onpopstate = function() {
                        setFragment('form')
                        setShowMobileData('')
                    } 
                    history.pushState({}, '')
                }
                
                break
        }
    }, [fragment])

    useEffect(() => {
        setShowGoToResults(!lockYields && !isLoadingState && !isFirstLoading && !isDataVisible)
    }, [lockYields, isLoadingState, isFirstLoading, isDataVisible])

    /*const hasOnlyCity = (property) => {
        return Object.keys(property).length === 1 && property.hasOwnProperty('city')
    }*/
    const hasOnlyCity = (property) => {
        return Object.keys(property).length === 1 && Object.prototype.hasOwnProperty.call(property, 'city')
    }

    const fetchProperty = useCallback(async () => {
        try {
          onLoadingStart()  
          setShowOverlay(true)
          const property = await propertyService.getById(propertyUUID)
          setProperty(property)   
          setIsFirstLoading(false)
          setShowOverlay(false)
        } catch (error) {
          console.error(`Error fetching property ${propertyUUID}:`, error)
          navigate("/home") 
        } finally {
          onLoadingDone()  
        }
    }, [propertyUUID, navigate, onLoadingStart, onLoadingDone])

    const updateProperty = async (fieldName, fieldValue) => {
        try {
            if (fieldName === "city") {
                setProperty((prevProperty) => {
                    return {
                        ...prevProperty,
                        city: fieldValue
                    }
                })                
            }

            const propertyToUpdate = { 
                propertyUUID: property?.uuid,
                fieldName,
                fieldValue: fieldValue === '' || fieldValue === 'choose' || Array.isArray(fieldValue) && fieldValue.length === 0 ? null : fieldValue
            }
            
            onLoadingStart()  
            setShowOverlay(true)
            const savedProperty = await propertyService.save(propertyToUpdate)
            setProperty({...savedProperty, updatedByField: fieldName})
            setShowOverlay(false)
            onLoadingDone()   
        } catch (error) {
            console.error(`Error update property ${propertyUUID}:`, error)
        } 
    }
    
    //const [focusedElement, setFocusedElement] = useState(null)

    useEffect(() => {
        //if (isBlocked) {
        //    const currentActiveElement = document.activeElement
        //    if (currentActiveElement && currentActiveElement.focus) {
        //        setFocusedElement(currentActiveElement)
        //    }
        //} else {
            window.removeEventListener("keydown", preventDefault)
            window.removeEventListener("click", preventDefault)
            window.removeEventListener("scroll", preventScroll)
            
            /*if (focusedElement) {
                const timeoutId = setTimeout(() => {
                    if (focusedElement && typeof focusedElement.focus === "function") {
                        focusedElement.focus()
                        setFocusedElement(null)
                    }
                }, 1000)
    
                return () => clearTimeout(timeoutId)
            }*/
            
        //}

        return () => {
            window.removeEventListener("keydown", preventDefault)
            window.removeEventListener("click", preventDefault)
            window.removeEventListener("scroll", preventScroll)
            document.removeEventListener("focusin", keepFocus)
        }
    }, [/*isBlocked*/])

    const preventDefault = (event) => {
        event.preventDefault()
        event.stopPropagation()
    }

    const preventScroll = (event) => {
        event.preventDefault()
    }

    const keepFocus = (event) => {
        const focusedElement = document.activeElement
        event.preventDefault()
        focusedElement.focus()
    }

    const onYieldForecastPress = () => {
        if (!lockYields) {
            setFragment('yield-forecast')
            setShowMobileData('show-mobile-data yield-forecast')
        }
    }

    const onAmortizationSchedulePress = () => {
        if (!lockYields) {
            setFragment('amortization-schedule')
            setShowMobileData('show-mobile-data amortization-schedule')
        }
    }

    const onChartPress = () => {
        if (!lockYields) {
            setFragment('chart')
            setShowMobileData('show-mobile-data chart')
        }
    }

    const handleDisplayInterests = async () => {
        setPreventUpdateServer(false)
        setShowInterestsContainer(!showInterestsContainer)
    } 

    /*const handleBackToForm = () => {
        setFragment('form')
        setShowMobileData('')
    }*/

    const handleMediaUpload = (media) => {
        const mediaToUpload = !property.media 
                                ? [media] 
                                : [...property.media, media]
        updateProperty("media", mediaToUpload)
        
    }

    const handleMediaRemove = (mediaPublicId) => {
        const mediaToUpload = property.media.filter(item => item.publicId !== mediaPublicId)
        updateProperty("media", mediaToUpload)
    }

    const handleGotoResults = () => {
        dataRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const mainClass = `property container ${lockYields ? "lock" : ""} ${showMobileData}`
    const menuClass = `menu ${fragment === "form" ? 'bottom' : 'side'} ${property?.showMortgagePrepayment ? '' : 'no-mortgage'}`
    const yieldForecastLabelClass = `label-${fragment === 'yield-forecast' ? 'on' : 'off'}`
    const amortizationScheduleLabelClass = `label-${fragment === 'amortization-schedule' ? 'on' : 'off'}`
    const chartLabelClass = `label-${fragment === 'chart' ? 'on' : 'off'}`
    const dataClass = `data ${fragment} ${lockYields ? 'lock-yields' : ''}`
    
    const titleClass = isLoadingState ? 'loading0' : '' 
    
    const iconYieldForecast = !lockYields && !isLoadingState && property
                    ? fragment === 'yield-forecast' 
                        ? iconYieldForecastOn 
                        : iconYieldForecastOff
                    : iconYieldForecastDisable
    const iconAmortizationSchedule = !lockYields && !isLoadingState && property
                    ? fragment === 'amortization-schedule' 
                        ? iconAmortizationScheduleOn 
                        : iconAmortizationScheduleOff
                    : iconAmortizationScheduleDisable
    const iconChart = !lockYields && !isLoadingState && property
                    ? fragment === 'chart' 
                        ? iconChartOn 
                        : iconChartOff
                    : iconChartDisable

    return (<>
        {showMobileData === "" && <Header />}
        <main className={mainClass}>
            {(showOverlay || isFirstLoading) && <Overlay />}
            <h1 className={titleClass}>{utilService.getPhrase('property_cost_estimate_title', phrases)}</h1>
            <PropertyForm property={property} user={loggedinUserState} isFirstLoading={isFirstLoading} onUpdate={updateProperty} queryPropertyUUID={propertyUUID} />
            {property?.showMortgagePrepayment && <>
                <h2>{utilService.getPhrase('property_indexes_and_interests_title', phrases)}</h2>
                <PropertyInterests fragment={fragment} property={property} display={showInterestsContainer} onUpdate={updateProperty} onCloseInterests={handleDisplayInterests} />
            </>}
            {!isFirstLoading && !lockYields && <h1 className={titleClass}>{utilService.getPhrase('property_financial_forecast_title', phrases)}</h1>}
            <section className={dataClass} ref={dataRef}>
                {!showInterestsContainer && <div className="unavailable-overlay">
                    <img src={iconMissingData} alt='' />
                    <div>
                        {utilService.getPhrase('property_calc_missing_data', phrases)}
                    </div>
                </div>}
                {!isFirstLoading && !lockYields && <PropertyYieldForecast data={property?.calcYieldForecast} />}
                {!isFirstLoading && !lockYields && property?.showMortgagePrepayment && <PropertyAmortizationSchedule data={property?.calcAmortizationSchedule} />}
                {!isFirstLoading && !lockYields && <PropertyChart data={property?.calcYieldForecast} />}
                {lockYields && <section className='lock-yields'>
                    <h3>{utilService.getPhrase('property_lock_yields_missing_data', phrases)}</h3>
                    <img src={iconMissingData} alt='' />
                </section>}
                {isFirstLoading && <section className='loading-calc-yields'>
                    <h3>{utilService.getPhrase('property_calc_yields', phrases)}</h3>
                    <Lottie animationData={animCalculating} loop={true} />
                </section>}
                
            </section>
            <h1 className={titleClass}>{utilService.getPhrase('property_images_title', phrases)}</h1>
            <PropertyMedia list={property?.media} onUpload={handleMediaUpload} onRemove={handleMediaRemove} />
            <div className={menuClass}>
                <ZoomOutIcon className='zoom-out' onClick={handleDisplayInterests} />
                <article>
                    <button type="button" onClick={onYieldForecastPress} className="yield-forecast-btn">
                        <img src={iconYieldForecast} alt="" /><h3 className={yieldForecastLabelClass}>{utilService.getPhrase('property_yield_forecast_label', phrases)}</h3>
                    </button>
                </article>
                {property?.showMortgagePrepayment && <article>
                    <button type="button" onClick={onAmortizationSchedulePress}>
                        <img src={iconAmortizationSchedule} alt='' /><h3 className={amortizationScheduleLabelClass}>{utilService.getPhrase('property_amortization_schedule_label', phrases)}</h3>
                    </button>
                </article>}
                <article>
                    <button type="button" onClick={onChartPress}>
                        <img src={iconChart} alt='' /><h3 className={chartLabelClass}>{utilService.getPhrase('property_actions_menu_graph_label', phrases)}</h3>
                    </button>
                </article>
                {lockYields && <img src={iconLock} alt={utilService.getPhrase('property_lock_yields_missing_data_alt', phrases)} />}
            </div>
            {showGoToResults && <DoubleArrowDownIcon className='goto-results' onClick={handleGotoResults} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { handleGotoResults() }}} />}
        </main>
        {showMobileData === "" && <Footer />}
    </>)
}
