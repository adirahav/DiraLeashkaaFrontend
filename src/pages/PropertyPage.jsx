import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { PropertyForm } from '../cmps/PropertyForm'
import { PropertyInterests } from '../cmps/PropertyInterests'
import { PropertyYieldForecast } from '../cmps/PropertyYieldForecast'
import { propertyService } from '../services/property.service'
import { PropertyAmortizationSchedule } from '../cmps/PropertyAmortizationSchedule'
import { PropertyChart } from '../cmps/PropertyChart'
import iconMissingData from '../assets/images/missing_data.png'
import 'react-tabs/style/react-tabs.css'
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
import { IconSizes, ZoomOut, DoubleArrowDownIcon } from '../assets/icons'
import { utilService } from '../services/util.service'
import { Overlay } from '../cmps/Overlay'
import Lottie from "lottie-react"
import animCalculating from '../assets/images/anim_calculating.json'
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'
import { authService } from '../services/auth.service'
import { useSplash } from '../contexts/SplashContext.jsx'
import { useSelector } from 'react-redux'
import { PropertyMedia } from '../cmps/PropertyMedia.jsx'

export function PropertyPage() {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    let propertyId = queryParams.get('propertyId')
    const city = queryParams.get('city')
    
    const [property, setProperty] = useState(null)
    const [showInterestsContainer, setShowInterestsContainer] = useState(null)
    const [lockYields, setLockYields] = useState(false)
    const [isFirstLoading, setIsFirstLoading] = useState(true)
    const [showOverlay, setShowOverlay] = useState(false)
    const [showMobileData, setShowMobileData] = useState("")
    const [fragment, setFragment] = useState("form")
    const [preventUpdateServer, setPreventUpdateServer] = useState(city !== null)
    const [isBlocked, setIsBlocked] = useState(false)
    const [showGoToResults, setShowGoToResults] = useState(false)
    const [isDataVisible, setIsDataVisible] = useState(false)
    
    const loggedinUser = authService.getLoggedinUser()
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    
    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters
    const calculators = splash?.calculators

    const navigate = useNavigate()

    const dataRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            setIsDataVisible(entry.isIntersecting)
          },
          { threshold: 0.1 } 
        )
    
        if (dataRef.current) {
          observer.observe(dataRef.current);
        }
    
        return () => {
          if (dataRef.current) {
            observer.unobserve(dataRef.current)
          }
        }
      }, [])

    useEffect(() => {
        if (!phrases || !fixedParameters || !calculators) {
            onLoadingStart()  
        } else {
            onLoadingDone()  

            if (propertyId) {
                fetchProperty() 
            } else {
                setIsFirstLoading(false)
                setShowInterestsContainer(true) 
                setLockYields(true)
            }
        }
    }, [splash, propertyId])

    useEffect(() => {
        if (city) {
            setProperty({city})
        }
    }, [city])

    useEffect(() => {
        if (property && !hasOnlyCity(property)) {
            if (showInterestsContainer === null) {
                setShowInterestsContainer(property.showInterestsContainer) 
            }
            
            setLockYields(property.calcYieldForecast === null) 
        } 

        if (!propertyId && property?._id) {
            propertyId = property?._id
            window.history.pushState(null, '', `/property?propertyId=${propertyId}`)
        }
    }, [property])

    useEffect(() => {
        const propertyToUpdate = { 
            propertyId,
            fieldName: 'showInterestsContainer',
            fieldValue: showInterestsContainer
        }
        
        if (!preventUpdateServer && propertyId) {
            propertyService.save(propertyToUpdate)
        }

        setPreventUpdateServer(false)
        
    }, [showInterestsContainer])

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

                window.onpopstate = function() {
                    setFragment('form')
                    setShowMobileData('')
                } 
                history.pushState({}, '')
                
                break
        }
    }, [fragment])

    useEffect(() => {
        setShowGoToResults(!lockYields && !isLoadingState && !isFirstLoading && !isDataVisible)
    }, [lockYields, isLoadingState, isFirstLoading, isDataVisible])

    const hasOnlyCity = (property) => {
        return Object.keys(property).length === 1 && property.hasOwnProperty('city')
    }

    const fetchProperty = async () => {
        try {
            onLoadingStart()  
            setShowOverlay(true)
            const property = await propertyService.getById(propertyId)
            setProperty(property)   
            setIsFirstLoading(false)
            setShowOverlay(false)
        } catch (error) {
            console.error(`Error fetching property ${propertyId}:`, error)
            navigate("/home") 
        } 
        finally {
            onLoadingDone()  
        }
    }

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
                propertyId: property?._id,
                fieldName,
                fieldValue: fieldValue === '' || fieldValue === 'choose' ? null : fieldValue
            }
            
            setShowOverlay(true)
            const savedProperty = await propertyService.save(propertyToUpdate)
            setProperty({...savedProperty, updatedByField: fieldName})
            setShowOverlay(false) 
        } catch (error) {
            console.error(`Error update property ${propertyId}:`, error)
        } 
    }
    
    const [focusedElement, setFocusedElement] = useState(null)

    useEffect(() => {
        if (isBlocked) {
            const currentActiveElement = document.activeElement
            if (currentActiveElement && currentActiveElement.focus) {
                setFocusedElement(currentActiveElement)
            }
        } else {
            window.removeEventListener("keydown", preventDefault)
            window.removeEventListener("click", preventDefault)
            window.removeEventListener("scroll", preventScroll)
            
            if (focusedElement) {
                const timeoutId = setTimeout(() => {
                    if (focusedElement && typeof focusedElement.focus === "function") {
                        focusedElement.focus()
                        setFocusedElement(null)
                    }
                }, 1000);
    
                return () => clearTimeout(timeoutId)
            }
            
        }

        return () => {
            window.removeEventListener("keydown", preventDefault)
            window.removeEventListener("click", preventDefault)
            window.removeEventListener("scroll", preventScroll)
            document.removeEventListener("focusin", keepFocus)
        }
    }, [isBlocked])

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
        setShowInterestsContainer(!showInterestsContainer)
    } 

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

    const mainClass = `property container ${!showInterestsContainer ? "lock" : ""} ${showMobileData}`
    const menuClass = `menu ${fragment === "form" ? 'bottom' : 'side'} ${property?.showMortgagePrepayment ? '' : 'no-mortgage'}`
    const yieldForecastLabelClass = `label-${fragment === 'yield-forecast' ? 'on' : 'off'}`
    const amortizationScheduleLabelClass = `label-${fragment === 'amortization-schedule' ? 'on' : 'off'}`
    const chartLabelClass = `label-${fragment === 'chart' ? 'on' : 'off'}`
    const dataClass = `data ${fragment} /*${isFirstLoading ? 'loading3' : ''}*/`
    
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
            <h1 className={titleClass}>הערכת עלויות ותשואה לרכישת נכס</h1>
            <PropertyForm property={property} user={loggedinUser} isFirstLoading={isFirstLoading} onUpdate={updateProperty} queryPropertyId={propertyId} />
            {property?.showMortgagePrepayment && <>
                <h2>ריביות ומדדים</h2>
                <PropertyInterests fragment={fragment} property={property} display={showInterestsContainer} onUpdate={updateProperty} onCloseInterests={handleDisplayInterests} />
            </>}
            {!isFirstLoading && !lockYields && <h1 className={titleClass}>תחזית פיננסית</h1>}
            <section className={dataClass} ref={dataRef}>
                {!showInterestsContainer && <div className="unavailable-overlay">
                    <img src={iconMissingData} />
                    <div>
                        חסרים נתונים לחישוב
                    </div>
                </div>}
                {!isFirstLoading && !lockYields && <PropertyYieldForecast data={property?.calcYieldForecast} />}
                {!isFirstLoading && !lockYields && property?.showMortgagePrepayment && <PropertyAmortizationSchedule data={property?.calcAmortizationSchedule} />}
                {!isFirstLoading && !lockYields && <PropertyChart data={property?.calcYieldForecast} />}
                {lockYields && <section className='lock-yields'>
                    {/*<h3>{utilService.getPhrase('property_lock_yields_missing_data', phrases)}</h3>*/}
                    <h3>אין מספיק נתונים כדי להציג תחזיות פיננסיות. אנא מלא את כל השדות הנדרשים.</h3>
                    <img src={iconMissingData} />
                </section>}
                {isFirstLoading && <section className='loading-calc-yields'>
                    <h3>{utilService.getPhrase('property_calc_yields', phrases)}</h3>
                    <Lottie animationData={animCalculating} loop={true} />
                </section>}
                
            </section>
            <h1 className={titleClass}>תמונות של הנכס</h1>
            <PropertyMedia list={property?.media} onUpload={handleMediaUpload} onRemove={handleMediaRemove} />
            <div className={menuClass}>
                <ZoomOut className='zoom-out' onClick={handleDisplayInterests} />
                <article onClick={onYieldForecastPress}><img src={iconYieldForecast} /><h3 className={yieldForecastLabelClass}>{utilService.getPhrase('property_yield_forecast_label', phrases)}</h3></article>
                {property?.showMortgagePrepayment && <article onClick={onAmortizationSchedulePress}><img src={iconAmortizationSchedule} /><h3 className={amortizationScheduleLabelClass}>{utilService.getPhrase('property_amortization_schedule_label', phrases)}</h3></article>}
                <article onClick={onChartPress}><img src={iconChart} /><h3 className={chartLabelClass}>{utilService.getPhrase('property_actions_menu_graph_label', phrases)}</h3></article>
                {lockYields && <img src={iconLock} />}
            </div>
            {showGoToResults && <DoubleArrowDownIcon className='goto-results' onClick={handleGotoResults} />}
        </main>
        {showMobileData === "" && <Footer />}
    </>)
}
