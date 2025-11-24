import { useEffect, useState } from 'react'
import { NavLink } from "react-router-dom"
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { HomeCities } from '../cmps/HomeCities'
import { HomeProperties } from '../cmps/HomeProperties'
import { HomeBestYields } from '../cmps/HomeBestYields'
import { Overlay } from '../cmps/Overlay'
import { utilService } from '../services/util.service'
import { useNavigate } from 'react-router-dom'
import { getHome, onDeletingPropertyStart, onAboutDeletingProperty, onDeletingPropertyDone, onDeleteProperty } from '../store/actions/user.actions.js'
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'
import { useSelector } from 'react-redux'
import { LoadingIcon } from '../cmps/LoadingIcon'
import { useSplash } from "../contexts/SplashContext"
import imgLetsStart from '../assets/images/lets_start.png'
import { FormField } from '../cmps/FormField.jsx'
import { useHomeWorker } from '../hooks/useHomeWorker'
import { AdMob } from '@capacitor-community/admob'
import { config } from '../config.js'
import WebAdBanner from '../cmps/WebAdBanner.jsx'
import { Promotion } from '../cmps/Promotion.jsx'
import { LazyLoadMedia } from '../cmps/LazyLoadMedia.jsx'

export function HomePage() {
    const [showOverlay, setShowOverlay] = useState(false)
    const [swipingToRefresh, setSwipeToRefresh] = useState('')
    const [selectedCity, setSelectedCity] = useState(null)
    const [bestYield, setBestYield] = useState(null)
    const letsStartButton = {
            text: "התחל", 
            isDisabled: false,
            isLoading: false
        }

    const [mediaLetsStart, setMediaLetsStart] = useState({
        width: { web: 504, tablet: 354, mobile: 250 },
        height: { web: 504, tablet: 354, mobile: 250 },
        url: imgLetsStart
    })
    const [isFirstUse, setIsFirstUse] = useState(true) 
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    const homeState = useSelector(storeState => storeState.userModule.home)
    
    const navigate = useNavigate()

    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters
    const calculators = splash?.calculators

    const [citiesNames, setCitiesNames] = useState()
    const { postMessage } = useHomeWorker(true)
    
    const MIN_DELETE_PROPERTY_AWAIT_SEC = 3
    
    useEffect(() => {
    
        // check if user
        const checkIfFirstUse = async () => {
            const email = await utilService.getFromStorage("email")
            setIsFirstUse(email == null || email === "")
        }
    
        checkIfFirstUse()
        

        // app ads
        const loadAd = async () => {
            await AdMob.initialize()
            await AdMob.prepareInterstitial({
                adId: config.ADMOB_INTERSTITIAL_ID, 
                isTesting: config.ADMOB_IS_TESTING, 
            })
    
            await AdMob.showInterstitial()
        }
    
        loadAd()

        // app touch event
        document.addEventListener('touchstart', handleTouchStart, { passive: true })
        return () => document.removeEventListener('touchstart', handleTouchStart)
    }, [])

    useEffect(() => {
        if (!phrases || !fixedParameters || !calculators) {
            onLoadingStart()  
        } else {
            setCitiesNames(utilService.getFixedParameter("cities", fixedParameters))
            fetchHomeData() 
        }

    }, [splash])

    useEffect(() => {
        if (homeState && homeState.bestYields?.length > 0) {
            setBestYield(homeState.bestYields[0])
            onLoadingDone() 
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
                
                fetchFullHomeData()
            }

            fetchInitialData()
        } catch (error) {
            console.error(`Error fetching home data:`, error)
            setShowOverlay(false)
            onLoadingDone() 
        } 
    }

    const fetchFullHomeData = async () => {
        const jwt_token = await utilService.getFromStorage("token")
        postMessage({ type: 'fetchFullData', getHomeFunc: getHome.toString(), token: jwt_token })
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

        fetchFullHomeData()
    }

    // best yield
    const bestYieldTitle = !isLoadingState && phrases && fixedParameters
                            ? utilService.getPhrase("home_best_yield_title", phrases)
                                         .replace("%1$d", utilService.getFixedParameter("bestYield", fixedParameters)
                                                                     .find(item => item.key === "yearsPeriod").value)
                            : ''
                            
    const bestYieldClass = isLoadingState ? 'loading0' : ''
 
    // swipe to refresh (mobile)
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

    if (isLoadingState && isFirstUse) {
        return (<main className='home first-use'></main>)
    }

    if (!isLoadingState && homeState.properties?.length === 0) {
        return (<>
            <Header />
            <main className="home container start" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                {swipingToRefresh !== '' && <div className={swipeToRefreshClass}><LoadingIcon /></div>}
                {false && <WebAdBanner />}
                {false && <Promotion />}
                {true && <LazyLoadMedia customClass={'desktop'} mediaUrl={mediaLetsStart.url} mediaWidth={mediaLetsStart.width.web} mediaHeight={mediaLetsStart.height.web} isVideo={false} alt={''} />}
                {false && <img className='desktop' src={mediaLetsStart.url} alt='' />}
                <section>
                    <h2>{utilService.getPhrase("home_start_title", phrases)}</h2>
                    <hr />
                    <LazyLoadMedia customClass={'tablet'} mediaUrl={mediaLetsStart.url} mediaWidth={mediaLetsStart.width.tablet} mediaHeight={mediaLetsStart.height.tablet} isVideo={false} alt={''} />
                    <LazyLoadMedia customClass={'mobile'} mediaUrl={mediaLetsStart.url} mediaWidth={mediaLetsStart.width.mobile} mediaHeight={mediaLetsStart.height.mobile} isVideo={false} alt={''} />
                    <h3>{utilService.getPhrase("home_start_subtitle", phrases)}</h3>
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
            {false && <WebAdBanner />}
            {false && <Promotion />}
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
