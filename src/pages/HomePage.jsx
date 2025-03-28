import React, { useEffect, useState } from 'react'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { HomeCities } from '../cmps/HomeCities'
import { HomeProperties } from '../cmps/HomeProperties'
import { HomeBestYields } from '../cmps/HomeBestYields'
import { Overlay } from '../cmps/Overlay'
import { utilService } from '../services/util.service'
import { NavLink, useNavigate } from 'react-router-dom'
import { getHome, onDeletingPropertyStart, onAboutDeletingProperty, saveHome, onDeletingPropertyDone, onDeleteProperty } from '../store/actions/user.actions.js'
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'
import { useSelector } from 'react-redux'
import { IconSizes, AddPropertyIcon, LoadingIcon, DoubleArrowDownIcon } from "../assets/icons"
import { useSplash } from '../contexts/SplashContext.jsx'
import imgLetsStart from '../assets/images/lets_start.png'
import { FormField } from '../cmps/FormField.jsx'

export function HomePage() {
    const [showOverlay, setShowOverlay] = useState(false)
    const [swipingToRefresh, setSwipeToRefresh] = useState('')
    const [selectedCity, setSelectedCity] = useState(null)
    const [bestYield, setBestYield] = useState(null)
    const [letsStartButton, setLetsStartButton] = useState(
        {
            text: "התחל", 
            isDisabled: false,
            isLoading: false
        }
    )

    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    
    const homeState = useSelector(storeState => storeState.userModule.home)
    
    const navigate = useNavigate()

    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters
    const calculators = splash?.calculators

    const [citiesNames, setCitiesNames] = useState()
    const [worker, setWorker] = useState(null)
    
    const MIN_DELETE_PROPERTY_AWAIT_SEC = 3
    
    useEffect(() => {
        document.addEventListener('touchstart', handleTouchStart, { passive: true })
        return () => document.removeEventListener('touchstart', handleTouchStart)
    }, [])

    useEffect(() => {
        if (!phrases || !fixedParameters || !calculators) {
            onLoadingStart()  
        } else {
            onLoadingDone() 
            setCitiesNames(utilService.getFixedParameter("cities", fixedParameters))
            fetchHomeData() 
        }

    }, [splash])

    useEffect(() => {
        
        if (homeState && homeState.bestYields?.length > 0) {
            setBestYield(homeState.bestYields[0])
        }
    }, [homeState])

    const fetchHomeData = async () => {
        try {
            onLoadingStart() 
            setShowOverlay(true)

            const fetchInitialData = async () => {
                await getHome(false)
                setSwipeToRefresh('')
                setShowOverlay(false)
                onLoadingDone() 
                
                newWorker.postMessage({ type: 'fetchFullData', getHomeFunc: getHome.toString() })
            }

            fetchInitialData()

            // get home full data in another thread
            let newWorker = new Worker(
                new URL('../workers/home.worker.js', import.meta.url), 
                { type: 'module' }
            )
            setWorker(newWorker)

            newWorker.onmessage = (event) => {
                if (event.data.type === 'fullData') {
                    saveHome(event.data.data)
                } else if (event.data.type === 'error') {
                    console.error('Worker error:', event.data.error)
                }
            }

            return () => {
                newWorker.terminate()
            }
        } catch (error) {
            console.error(`Error fetching home data:`, error)
            setShowOverlay(false)
            onLoadingDone() 
        } 
        
    }

    // my cities
    function onCityPress(city) {
        onAboutDeletingProperty(null)
        setSelectedCity(city)
    }

    const citiesTitle = isLoadingState ? '' : utilService.getPhrase("home_cities_title", phrases)
    const citiesClass = isLoadingState ? 'loading0' : '' 

    const propertiesTitle = !isLoadingState && selectedCity 
                                ? selectedCity === "else"
                                    ? utilService.getPhrase("home_properties_title_else", phrases)
                                    : utilService.getPhrase("home_properties_title", phrases)
                                             .replace("%1$s", citiesNames?.find(city => city.key === selectedCity).value)
                                : ''
    const propertiesClass = isLoadingState ? 'loading0' : ''
    
    // city properties
    function onPropertyPress(ev, property) {
        if (property._id === homeState.aboutDeleteId && !homeState.isDeleting) {
            ev.preventDefault()
            ev.stopPropagation()
            onDeletingProperty(property)
        } else if (!property._id) {
            navigate(`/property?city=${property.city}`)
        } else {
            navigate(`/property?propertyId=${property._id}`)
        }
    }

    async function onDeletingProperty(property) {
        const propertyId = property._id
        const city = property.city
        
        onDeletingPropertyStart()
        

        const deleteStartTime = new Date()
    
        await onDeleteProperty(propertyId)
    
        const deleteEndTime = new Date()
    
        const diffSeconds = (deleteEndTime.getTime() - deleteStartTime.getTime()) / 1000
    
        if (diffSeconds < MIN_DELETE_PROPERTY_AWAIT_SEC) {
            await new Promise(resolve => setTimeout(resolve, (MIN_DELETE_PROPERTY_AWAIT_SEC - diffSeconds) * 1000))
        }

        const sameCityCount = city === "else" || !city
                                ? homeState.properties?.filter(property => property.city === city || !property.city).length
                                : homeState.properties?.filter(property => property.city === city).length
        
        if (sameCityCount === 1) {
            setSelectedCity(null)
        }
        
        onAboutDeletingProperty(null)
        onDeletingPropertyDone()

    }

    // best yield
    const bestYieldTitle = !isLoadingState && phrases && fixedParameters
                            ? utilService.getPhrase("home_best_yield_title", phrases)
                                         .replace("%1$d", utilService.getFixedParameter("bestYield", fixedParameters)
                                                                     .find(item => item.key === "yearsPeriod").value)
                            : ''
                            
    const bestYieldClass = isLoadingState ? 'loading0' : ''
 
    // swipe to refresh
    const handleTouchStart = (event) => {
        const startY = event.touches[0].clientY
        if (window.scrollY === 0 && startY < 100) {
            setSwipeToRefresh('swiping')
        } 
    }

    const handleTouchEnd = () => {
        if (swipingToRefresh === "swiping") {
            setSwipeToRefresh('refreshing')
            fetchHomeData()
        }
    }

    const mainClass = `home container ${!isLoadingState && homeState.properties?.length === 0 ? 'start' : ''}`
    const swipeToRefreshClass = `swiping-to-refresh ${swipingToRefresh}`

    if (!isLoadingState && homeState.properties?.length === 0) {
        return (<>
            <Header />
            <main className="home container start" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                {swipingToRefresh !== '' && <div className={swipeToRefreshClass}><LoadingIcon /></div>}
                <img className='desktop' src={imgLetsStart} />
                <section>
                    <h2>דירה להשקעה</h2>
                    <hr />
                    <img className='tablet' src={imgLetsStart} />
                    <img className='mobile' src={imgLetsStart} />
                    <h3>מצא את הדירה בעלת הפוטנציאל לתשואה הגבוהה ביותר בקלות וביעילות!</h3>
                    <hr />
                    <FormField type={"BUTTON_LONG"} params={letsStartButton} onPress={() =>  navigate(`/property`)} />
                </section>
            </main>
            <Footer />
        </>)
    }

    return (<>
        <Header />
        <main className={mainClass} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            {swipingToRefresh !== '' && <div className={swipeToRefreshClass}><LoadingIcon /></div>}
            {showOverlay && <Overlay />}
            <h1 className={citiesClass}>{citiesTitle}</h1>
            <HomeCities citiesNames={citiesNames} selectedCity={selectedCity} onCityPress={onCityPress} />
            
            <h2 className={propertiesClass} dangerouslySetInnerHTML={{ __html: propertiesTitle}}></h2>
            <HomeProperties 
                selectedCity={selectedCity}
                bestYield={bestYield} 
                fullData={homeState?.fullData}
                onPropertyPress={onPropertyPress} />

            <h1 className={bestYieldClass} dangerouslySetInnerHTML={{ __html: bestYieldTitle}}></h1>
            <HomeBestYields properties={homeState?.bestYields} fullData={homeState?.fullData} />
        </main>
        <Footer />
    </>)
}
