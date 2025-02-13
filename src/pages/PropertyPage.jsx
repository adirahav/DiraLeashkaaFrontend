import React, { useEffect, useState } from 'react'
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
import { ZoomOut } from '../assets/icons'
import { utilService } from '../services/util.service'
import { Overlay } from '../cmps/Overlay'
import Lottie from "lottie-react"
import animCalculating from '../assets/images/anim_calculating.json'
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'
import { authService } from '../services/auth.service'
import { useSplash } from '../contexts/SplashContext.jsx'
import { useSelector } from 'react-redux'

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

    const loggedinUser = authService.getLoggedinUser()
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    
    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters
    const calculators = splash?.calculators

    const navigate = useNavigate()

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

    const handleIconStatus = (fragmentName) => {
        return showInterestsContainer 
                ? fragment === fragmentName
                    ? 'on'
                    : 'off' 
                : 'disable'
    } 

    const handleDisplayInterests = async () => {
        setShowInterestsContainer(!showInterestsContainer)
    } 

    const mainClass = `property container ${!showInterestsContainer ? "lock" : ""} ${showMobileData}`
    const menuClass = `menu ${fragment === "form" ? 'bottom' : 'side'} ${property?.showMortgagePrepayment ? '' : 'no-mortgage'}`
    const iconYieldForecast = `/src/assets/images/icon_yield_forecast_${handleIconStatus('yield-forecast')}.png`
    const iconAmortizationSchedule = `/src/assets/images/icon_amortization_schedule_${handleIconStatus('amortization-schedule')}.png`
    const iconChart = `/src/assets/images/icon_chart_${handleIconStatus('chart')}.png`
    
    const yieldForecastLabelClass = `label-${fragment === 'yield-forecast' ? 'on' : 'off'}`
    const amortizationScheduleLabelClass = `label-${fragment === 'amortization-schedule' ? 'on' : 'off'}`
    const chartLabelClass = `label-${fragment === 'chart' ? 'on' : 'off'}`
    const dataClass = `data ${fragment} /*${isFirstLoading ? 'loading3' : ''}*/`
    
    const titleClass = isLoadingState ? 'loading0' : '' 

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
            <section className={dataClass}>
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
            <div className={menuClass}>
                    <ZoomOut className='zoom-out' onClick={handleDisplayInterests} />
                    <article onClick={onYieldForecastPress}><img src={iconYieldForecast} /><h3 className={yieldForecastLabelClass}>{utilService.getPhrase('property_yield_forecast_label', phrases)}</h3></article>
                    {property?.showMortgagePrepayment && <article onClick={onAmortizationSchedulePress}><img src={iconAmortizationSchedule} /><h3 className={amortizationScheduleLabelClass}>{utilService.getPhrase('property_amortization_schedule_label', phrases)}</h3></article>}
                    <article onClick={onChartPress}><img src={iconChart} /><h3 className={chartLabelClass}>{utilService.getPhrase('property_actions_menu_graph_label', phrases)}</h3></article>
                    {lockYields && <img src={iconLock} />}
                </div>
        </main>
        {showMobileData === "" && <Footer />}
    </>)
}
