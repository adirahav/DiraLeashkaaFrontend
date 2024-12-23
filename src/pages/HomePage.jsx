import React, { useEffect, useState } from 'react'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { HomeCities } from '../cmps/HomeCities'
import { HomeProperties } from '../cmps/HomeProperties'
import { HomeBestYields } from '../cmps/HomeBestYields'
import { Overlay } from '../cmps/Overlay'
import { utilService } from '../services/util.service'
import { NavLink, useNavigate } from 'react-router-dom'
import { getHome, onDeletingPropertyDone, onDeletingPropertyStart, onDeleteProperty, onAboutDeletingProperty } from '../store/actions/user.actions.js'
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'
import { useSelector } from 'react-redux'
import { IconSizes, AddPropertyIcon } from "../assets/icons"
import { useSplash } from '../contexts/SplashContext.jsx'
import imgArrowDown from '../assets/images/lottie_arrow_down.json'
import Lottie from 'lottie-react'

export function HomePage() {
    const [showOverlay, setShowOverlay] = useState(false)
    const [selectedCity, setSelectedCity] = useState(null)
    const [bestYield, setBestYield] = useState(null)

    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    
    const homeState = useSelector(storeState => storeState.userModule.home)
    
    const navigate = useNavigate()

    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters
    const calculators = splash?.calculators

    const [citiesNames, setCitiesNames] = useState()

    const MIN_DELETE_PROPERTY_AWAIT_SEC = 3

    useEffect(() => {
        if (!phrases || !fixedParameters || !calculators) {
            onLoadingStart()  
        } else {
            onLoadingDone() 
            setCitiesNames(utilService.getFixedParameter("cities", fixedParameters))
            fetchHome() 
        }

    }, [splash])

    useEffect(() => {
        if (homeState && homeState.bestYields?.length > 0) {
            setBestYield(homeState.bestYields[0])
        }
    }, [homeState])

    const fetchHome = async () => {
        try {
            onLoadingStart() 
            setShowOverlay(true)
            await getHome()
        } catch (error) {
            console.error(`Error fetching home data:`, error)
        } 
        finally {
            setShowOverlay(false)
            onLoadingDone() 
        }
    }
 
    // my cities
    function onCityPress(city) {
        setSelectedCity(city)
    }

    const citiesTitle = isLoadingState ? '' : utilService.getPhrase("home_cities_title", phrases)
    const citiesClass = isLoadingState ? 'loading0' : '' 

    const propertiesTitle = selectedCity 
                                ? selectedCity === "else"
                                    ? utilService.getPhrase("home_properties_title_else", phrases)
                                    : utilService.getPhrase("home_properties_title", phrases)
                                             .replace("%1$s", citiesNames?.find(city => city.key === selectedCity).value)
                                : ''
    const propertiesClass = isLoadingState ? 'loading0' : ''
    
    // city properties
    function onPropertyPress(ev, property) {
        
        if ((ev.target.offsetParent.className === 'before-deleting' || ev.target.offsetParent.className === 'delete-overlay') && !homeState.isDeleting) {
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

    // add property
    const addPropertyClass = isLoadingState ? 'hide' : 'add-button'
    
    if (!isLoadingState && homeState.properties?.length === 0) {
        return (<>
            <Header />
            <main className="home container start">
                <h2>{utilService.getPhrase("home_lets_start", phrases)}</h2>
                <Lottie 
                    animationData={imgArrowDown} 
                    loop={true} 
                    autoplay={true} 
                    onClick={() =>  navigate(`/property`)}  />
                <div>
                    <NavLink to="/property" className={addPropertyClass}><AddPropertyIcon sx={IconSizes.Small} /></NavLink>
                </div>
            </main>
            <Footer />
        </>)
    }

    return (<>
        <Header />
        <main className="home container">
            {showOverlay && <Overlay />}
            <h1 className={citiesClass}>{citiesTitle}</h1>
            <HomeCities citiesNames={citiesNames} selectedCity={selectedCity} onCityPress={onCityPress} />
            
            <h2 className={propertiesClass} dangerouslySetInnerHTML={{ __html: propertiesTitle}}></h2>
            <HomeProperties 
                selectedCity={selectedCity}
                bestYield={bestYield} 
                onPropertyPress={onPropertyPress} />

            <h1 className={bestYieldClass} dangerouslySetInnerHTML={{ __html: bestYieldTitle}}></h1>
            <HomeBestYields properties={homeState?.bestYields} />
            <NavLink to="/property" className={addPropertyClass}><AddPropertyIcon sx={IconSizes.Small} /><span>הוסף נכס</span></NavLink>
        </main>
        <Footer />
    </>)
}
