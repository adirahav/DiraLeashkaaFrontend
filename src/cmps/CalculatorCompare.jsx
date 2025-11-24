import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { PropertyField } from './PropertyField.jsx'
import { utilService } from '../services/util.service.js'
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'
import { useSplash } from "../contexts/SplashContext"
import { useSelector } from 'react-redux'
import { authService } from '../services/auth.service.js'
import { Overlay } from './Overlay.jsx'
import { PropertyForm } from './PropertyForm.jsx'
import { propertyService } from '../services/property.service.js'
import { getCompare, saveCompare, resetCompare } from '../store/actions/user.actions.js'
import missingPictureImage from '../assets/images/missing_picture_white.png'
import chooseApartments from '../assets/images/choose_apartments.png'
import chooseApartmentsMobile from '../assets/images/choose_apartments_mobile.png'
import { FormField } from './FormField.jsx'
import { ViewComfyIcon, ViewCompactIcon, ScrollArrowLeftIcon, ScrollArrowRightIcon } from '../assets/icons'
import PropTypes from "prop-types"
import { Navigate } from 'react-router-dom'
import { useWindowSize } from '../hooks/useWindowSize'

export function CalculatorCompare() {  
    const MAX_APARTMENTS_TO_COMPARE = 4
    const LOADING_PROPERTIES_COUNT = 3

    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters

    const [cityFilter, setCityFilter] = useState({
        selectedValue: null, 
        options: [] 
    })

    const [maxPropertiesToCompare, setMaxPropertiesToCompare] = useState(MAX_APARTMENTS_TO_COMPARE)

    const [propertyFilter, setPropertyFilter] = useState({
        selectedValue: null, 
        options: [],
        texts: {
            any: 'בחר דירות',
            one: 'דירה אחת <span>נבחרה</span>',
            many: `<span>נבחרו</span> %1$s דירות`
        }
    })

    const [resetFilter, setResetFilter] = useState({
        isDisabled: true,
        isLoading: false,
        isLinkView: false,
        text: "נקה"
    })
    
    const [keys, setKeys] = useState({
        cityFilter: "cityFilterEmpty",
        propertyFilter: "propertyFilterEmpty",
        resetFilter: "resetFilter"
    })

    const [properties, setProperties] = useState(null)
    const [showOverlay, setShowOverlay] = useState(false)
    const [isFirstLoading, setIsFirstLoading] = useState(true)
    const [viewState, setViewState] = useState('') // comfy | compact | comfying | compacting
    
    const { screenWidth, screenHeight } = useWindowSize()

    const loggedinUserState = useSelector(storeState => storeState.userModule.loggedinUser)
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    const compareState = useSelector(storeState => storeState.userModule.compare)

    // scroll
    const mainRef = useRef(null)
    const [scroll, setScroll] = useState({
        hasScroll: true,//false,
        canScrollRight: false,
        canScrollLeft: false
    })
    
    const scrollPositionRef = useRef(0)

    const SCROLL_AMOUNT = 100

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const alertModal = document.querySelector('.alert')
            const accessibilityModal = document.querySelector('.accessibility-modal')
            const customDropdown = document.querySelectorAll('.custom-dropdown')
    
            if (alertModal || accessibilityModal) {
                document.querySelectorAll('.custom-dropdown.open')?.forEach(el => el.classList.remove('open'))
                customDropdown.forEach(el => el.classList.add('disable'))
            } else {
                customDropdown.forEach(el => el.classList.remove('disable'))
            }
        })
    
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        })
    
        return () => observer.disconnect()
    }, [])
    

    /*useEffect(() => {
        const handleClick = (e) => {
            if (e.target.closest('.property-field.warning')) {
                document.querySelectorAll('.custom-dropdown.open')?.forEach(el => {
                    el.classList.remove('open')
                })
            }
        }
        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])*/

    //
    useEffect(() => {
        if (!isLoadingState && properties && properties.length > 0) {
            updateScrollButtons()
        }
    }, [isLoadingState, properties])
      
    useEffect(() => {
        const init = async () => {
            if (!phrases || !fixedParameters) {
                onLoadingStart()  
            } else {
                const calculators = utilService.getFixedParameter("calculators", fixedParameters)
                const comoareMaxProperties = calculators.find(c => c.key === "comoareMaxProperties")?.value
                if (comoareMaxProperties) {
                    setMaxPropertiesToCompare(comoareMaxProperties)
                }
                
                onLoadingStart() 
                setShowOverlay(true)
                await getCompare()
            }   
        }

        init()
    }, [phrases, fixedParameters])
    
    useEffect(() => {
        const init = async () => {
            if (compareState.comparedPropertyIds) {
                onLoadingStart() 
                setShowOverlay(true)
                await fetchProperties() 
            }
            
            onLoadingDone()  
            setShowOverlay(false)
            setIsFirstLoading(false)
        }

        init()
    }, [compareState.comparedPropertyIds])

    useEffect(() => {
        const loadCities = async () => {
            if (compareState && compareState.allProperties?.length > 0) {
                const normalizedCities = compareState.allProperties.map(property => ({
                    ...property,
                    city: property.city || 'else',
                }))
                
                const uniqueCities = [...new Set(normalizedCities.map(cityObj => cityObj.city))]
            
                uniqueCities.sort((a, b) => {
                    if (a === 'else') return 1
                    if (b === 'else') return -1
                    return a.localeCompare(b)
                })
            
                const allCities = utilService.getFixedParameter("cities", fixedParameters)
                 
                const mappedCities = await Promise.all(
                    uniqueCities
                    .filter(city => city !== "else")
                    .map(async (cityKey) => {
                        const city = allCities.find(c => c.key === cityKey)
                        if (!city) return null
            
                        try {
                            const image = (await import(`../assets/images/icon_city_${city.key}.png`)).default
                            return { ...city, image }
                        } catch (err) {
                            console.warn(`Image not found for city: ${city.key}`, err)
                            return { ...city, image: null }
                        }
                    })
                )
                
                setCityFilter(prevCity => ({
                    ...prevCity,
                    options: mappedCities.filter(Boolean),
                    selectedValue: "choose",
                }))
            }
        }
        
        loadCities()
    }, [compareState.allProperties])

    useEffect(() => {
        const loadProperties = async () => {
            if (compareState && compareState.allProperties?.length > 0) {
                
                const allCities = utilService.getFixedParameter("cities", fixedParameters)
            
                const handleGetValue = (city, cityElse, address) => {
                    if (city && city !== "else" && address) {
                        return utilService.getPhrase("home_properties_city_else", phrases)
                            .replace("%1$s", address)
                            .replace("%2$s", allCities.find(c => c.key === city)?.value) 
                    } 

                    if (city === "else" && cityElse && address) {
                        return utilService.getPhrase("home_properties_city_else", phrases)
                            .replace("%1$s", address)
                            .replace("%2$s", cityElse) 
                    } 

                    if (city && city !== "else" && !cityElse && !address) { 
                        return allCities.find(c => c.key === city)?.value 
                    }

                    if (city === "else" && cityElse && !address) {
                        return cityElse 
                    } 

                    if (!city && address) {
                        return address
                    } 

                    return ""
                }
                    
                const selectedCityProperties = 
                    !cityFilter.selectedValue || cityFilter.selectedValue === 'choose' 
                        ? compareState.allProperties  
                        : compareState.allProperties?.filter(property => 
                            cityFilter.selectedValue === 'else' 
                                ? !property.city || property.city === "else" 
                                : property.city === cityFilter.selectedValue)
                
                setPropertyFilter(prevPropertyFilter => ({
                    ...prevPropertyFilter,
                    options: selectedCityProperties?.map(property => ({
                        key: property._id,
                        value: handleGetValue(property?.city, property?.cityElse, property?.address),
                        info: property.note,
                        image: property?.media && property?.media.length > 0 
                                ? property?.media[0].url 
                                : missingPictureImage,
                        enable: compareState.comparedPropertyIds?.includes(property._id) || compareState.comparedPropertyIds?.length < maxPropertiesToCompare,
                        checked: compareState.comparedPropertyIds?.includes(property._id)
                    })),
                    selectedValue: compareState.comparedPropertyIds,
                }))
            }
        }
        
        loadProperties()
    }, [cityFilter.selectedValue])

    useEffect(() => {
        setResetFilter(prevResetFilter => ({
            ...prevResetFilter,
            isDisabled: !propertyFilter || !propertyFilter.selectedValue || propertyFilter.selectedValue.length === 0,
        }))
        
    }, [propertyFilter.selectedValue])
    
    useEffect(() => {
        setKeys({
            cityFilter: "cityFilter" + (cityFilter.selectedValue ? cityFilter.selectedValue : "Choose"),
            propertyFilter: "propertyFilter" //+ /*(cityFilter.selectedValue ? cityFilter.selectedValue : "Choose") + */(propertyFilter.options.filter(option => option.checked).map(option => option.key).join('_'))
        })
    }, [cityFilter.selectedValue, propertyFilter/*, compareState.comparedPropertyIds*/])

    // filter
    /*const fetchCompareData = async () => {
        try {
            await getCompare()
        } catch (error) {
            console.error(`Error fetching compare data:`, error)
        } 
    }*/
   
    function onCityChanged(city) {
        setCityFilter(prevCity => ({
            ...prevCity,
            selectedValue: city,
        }))
    }

    async function onPropertyCheckedChanged(checked, propertyId) {
        setPropertyFilter(prevPropertyFilter => ({
            ...prevPropertyFilter,
            options: prevPropertyFilter.options.map(option =>
              option.key === propertyId
                ? { ...option, checked, enable: true }
                : { ...option, enable: option.checked || !checked || (checked && compareState.comparedPropertyIds?.length + 1 < maxPropertiesToCompare) }
            ),
            selectedValue: prevPropertyFilter.selectedValue.includes(propertyId) && !checked
                                ? prevPropertyFilter.selectedValue.filter(id => id !== propertyId)
                                : !prevPropertyFilter.selectedValue.includes(propertyId) && checked
                                    ? [...prevPropertyFilter.selectedValue, propertyId]
                                    : prevPropertyFilter.selectedValue
       
        }))
 
        await saveCompare(checked, propertyId)
    }

    const onResetFilter = async () => {
        await resetCompare()

        setPropertyFilter(prevPropertyFilter => ({
            ...prevPropertyFilter,
            selectedValue: null,
        }))

        setCityFilter(prevCityFilter => ({
            ...prevCityFilter,
            selectedValue: null,
        }))
    }

    // scroll
    const updateScrollState = () => {
        const main = mainRef.current
        if (!main) return
      
        setScroll((prevScroll) => ({
            ...prevScroll,
            hasScroll: main.scrollWidth > main.clientWidth
        }))
    }

    useEffect(() => {
        const main = mainRef.current
        if (!main) return
      
        main.scrollTo({ left: 0, behavior: 'smooth' })
      
        const handleScroll = () => {
          updateScrollButtons()
        }
      
        main.addEventListener('scroll', handleScroll)
      
        updateScrollButtons()
        //updateScrollState()
      
        return () => {
          main.removeEventListener('scroll', handleScroll)
        }
      }, [viewState, properties, screenWidth])

    const updateScrollButtons = () => {
        const main = mainRef.current
        if (!main) return
        
        /*console.log("============================================")
        console.log("canScrollRight=" + (main.scrollLeft < 0))
        console.log("canScrollLeft=" + (Math.round(main.scrollLeft - 1) > Math.round(main.clientWidth - main.scrollWidth)))
        console.log("             =" + main.scrollLeft)
        console.log("             =" + main.clientWidth)
        console.log("             =" + main.scrollWidth)*/
       
        
        setScroll((prevScroll) => ({
            ...prevScroll,
            canScrollRight: main.scrollLeft < 0,
            canScrollLeft: Math.round(main.scrollLeft - 1) > Math.round(main.clientWidth - main.scrollWidth)
        }))
    }
    
    const scrollLeft = () => {
        if (!scroll.canScrollLeft) return
        
        const main = mainRef.current
        if (!main) return
        
        main.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' })
        setTimeout(updateScrollButtons, 200)
    }
    
    const scrollRight = () => {
        if (!scroll.canScrollRight) return

        const main = mainRef.current
        if (!main) return
        
        main.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' })
        setTimeout(updateScrollButtons, 200)
    }

    const saveScrollPosition = () => {
        if (mainRef.current) {
            scrollPositionRef.current = mainRef.current.scrollLeft
        }
    }

    const restoreScrollPosition = () => {
        const el = mainRef.current
        const pos = scrollPositionRef.current ?? 0
      
        if (!el) return
      
        el.scrollLeft = pos
      
        requestAnimationFrame(() => {
          const max = Math.max(0, el.scrollWidth - el.clientWidth)
          const target = Math.min(pos, max)
          el.scrollTo({ left: target, behavior: 'auto' })
        })
      
        setTimeout(() => {
          const max = Math.max(0, el.scrollWidth - el.clientWidth)
          const target = Math.min(pos, max)
          if (el.scrollLeft !== target) el.scrollLeft = target
        }, 100)
      }
      

    useLayoutEffect(() => {
        setTimeout(() => restoreScrollPosition(), 0)
    }, [properties])

    // view state
    const changeViewState = (view) => {
        if (view === "comfy" && viewState !== "compact") {
            return
        }

        if (view === "compact" && viewState !== "comfy") {
            return
        }

        setViewState((prevViewState) => {
            return prevViewState === "comfy"
                        ? "compacting"
                        : "comfying"
        })
    }
    
    useEffect(() => {
        const main = mainRef.current
        if (main) {
            main.scrollTo({ left: 0, behavior: 'smooth' })

            const handleScroll = () => {
                updateScrollButtons()
            }
        
            main.addEventListener('scroll', handleScroll)
        
            return () => {
                main.removeEventListener('scroll', handleScroll)
            }
        }

        setTimeout(updateScrollButtons, 200)
    }, [viewState])
    
    const handleViewStateTransitionEnd = () => {
        setViewState((prevViewState) => {
            const newState =
              prevViewState === "compacting" ? "compact" :
              prevViewState === "comfying" ? "comfy" :
              prevViewState
            setTimeout(updateScrollButtons, 100) // wait for layout update
            return newState
          })
    }

    // main
    const fetchProperties = async () => {
        try {
            const comparedProperties = await Promise.all(compareState.comparedPropertyIds.map(propertyId => propertyService.getById(propertyId, true)))
            setProperties(comparedProperties) 
            
            setViewState(prevViewState => {
                return properties?.length > 0
                    ? prevViewState || 'comfy'
                    : 'comfy'
            })
        } catch (error) {
            console.error(`Error fetching properties ${JSON.stringify(compareState.comparedPropertyIds)}:`, error)
            Navigate("/home") 
        } 
    }

    const updateProperty = async (propertyId, fieldName, fieldValue) => {
        try {
            if (fieldName === "city") {
                setProperties(prevProperties =>
                    prevProperties.map(property =>
                        property.propertyId === propertyId
                            ? {...property, city: fieldName}
                            : property
                    )
                )
            }

            const propertyToUpdate = { 
                propertyId,
                fieldName,
                fieldValue: fieldValue === '' || fieldValue === 'choose' ? null : fieldValue
            }
            
            //onLoadingStart()
            setShowOverlay(true)

            saveScrollPosition()
            
            const savedProperty = await propertyService.save(propertyToUpdate)
            setProperties(prevProperties =>
                prevProperties.map(property => 
                    property._id === propertyId
                        ? {...savedProperty, updatedByField: fieldName}
                        : property
                )
            )
            
            setShowOverlay(false) 
        } catch (error) {
            console.error(`Error update property ${propertyId}:`, error)
        } finally {
            //onLoadingDone()
        }
    }

    const titleClass = `${isLoadingState ? "loading0" : ""}`
    const filterClass = `filter ${isLoadingState ? "loading1" : ""}`
    
    return (<>
        {(showOverlay || isFirstLoading) && <Overlay />}
        <h1 className={titleClass}>{utilService.getPhrase(`calculator_compare_title`, phrases)}</h1>
        <section className={filterClass}>
            <article className='header'>
                <h2>{utilService.getPhrase(`calculator_compare_choose`, phrases)}</h2>  
                <FormField type={"BUTTON"} key={keys.resetFilter} params={{...resetFilter, isLinkView: true}} onPress={onResetFilter} />  
            </article>
            <article className='elements'>
                <PropertyField type={"VISUAL_DROP_DOWN"} key={keys.cityFilter} params={cityFilter} isFirstLoading={isFirstLoading} onValueChanged={(value) => onCityChanged(value)} />   
                <PropertyField type={"BEAUTIFIED_MULTIPLE_DROP_DOWN"} key={keys.propertyFilter} params={propertyFilter} isFirstLoading={isFirstLoading} onValueChanged={(checked, propertyId) => onPropertyCheckedChanged(checked, propertyId)} />   
                <FormField type={"BUTTON"} key={keys.resetFilter} params={resetFilter} onPress={onResetFilter} />
            </article>
        </section>
        {!isLoadingState && properties !== null && properties.length === 0 && <div className={`main-content no-compared-properties`}>
            <h3>{utilService.getPhrase(`calculator_compare_no_apartments`, phrases)}</h3>
            <img srcSet={`${chooseApartmentsMobile} 767w, ${chooseApartments} 1600w`}
                 sizes="(max-width: 767px) 100vw, 1600px"
                 src={chooseApartments}
                 alt="" />
        </div>}
        {isLoadingState && <div className={`main-content ${viewState} loading`}>
            {[...Array(LOADING_PROPERTIES_COUNT)].map((_, index) => (
                <PropertyForm isFirstLoading={true} key={`loading-property-${index}`} index={index} />
            ))}
        </div>}
        {!isLoadingState && properties && properties.length > 0 && <>
            <div className={`view-controller ${scroll.hasScroll ? 'has-scroll': ''} ${showOverlay ? "overlay" : ""}`}>
                <div className={`view-buttons ${viewState}`}>
                    <h2>תצוגה:</h2>
                    <ViewComfyIcon className='comfy' onClick={() => changeViewState('comfy')} />
                    <ViewCompactIcon className='compact' onClick={() => changeViewState('compact')} />
                </div>
                <div className={`scroll-buttons ${scroll.canScrollRight ? 'scroll-right' : ''} ${scroll.canScrollLeft ? 'scroll-left' : ''}`}>
                    <ScrollArrowRightIcon onClick={scrollRight} />
                    <ScrollArrowLeftIcon onClick={scrollLeft} />
                </div>
            </div>
            <div className={`main-content ${viewState}`} ref={mainRef} onTransitionEnd={handleViewStateTransitionEnd}>
                {properties.map((property, index) => (
                    <PropertyForm key={`property-${index}`} property={property} isFirstLoading={isFirstLoading} onUpdate={(fieldName, fieldValue) => updateProperty(property._id, fieldName, fieldValue)} queryPropertyId={property._id} />
                ))}
            </div>
        </>}
    </>)
}

CalculatorCompare.propTypes = {
    index: PropTypes.number,
    calculator: PropTypes.shape({
      isLock: PropTypes.bool,
      isComingSoon: PropTypes.bool,
      type: PropTypes.string,
    }),
    onCalculatorPress: PropTypes.func,
    setEnterButton: PropTypes.func,
  }