import { useState, useEffect, useRef } from 'react'
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
import { FormField } from './FormField.jsx'
import { ViewComfyIcon, ViewCompactIcon, ScrollArrowLeftIcon, ScrollArrowRightIcon } from '../assets/icons'
import PropTypes from "prop-types"
import { Navigate } from 'react-router-dom'

export function CalculatorCompare() {  
    const MAX_APARTMENTS_TO_COMPARE = 3
    const LOADING_PROPERTIES_COUNT = 3

    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters

    const [cityFilter, setCityFilter] = useState({
        selectedValue: null, 
        options: [] 
    })

    const [propertyFilter, setPropertyFilter] = useState({
        selectedValue: null, 
        options: [],
        texts: {
            any: 'בחר דירות',
            one: 'דירה אחת נבחרה',
            many: `נבחרו %1$s דירות`
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
    
    const loggedinUser = authService.getLoggedinUser()
    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    const compareState = useSelector(storeState => storeState.userModule.compare)

    // scroll
    const mainRef = useRef(null)
    const [canScrollRight, setCanScrollRight] = useState(false)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const SCROLL_AMOUNT = 100

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
                        enable: compareState.comparedPropertyIds?.includes(property._id) || compareState.comparedPropertyIds?.length < MAX_APARTMENTS_TO_COMPARE,
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
                : { ...option, enable: option.checked || !checked || (checked && compareState.comparedPropertyIds?.length + 1 < MAX_APARTMENTS_TO_COMPARE) }
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
    /*const updateScrollButtons_new = () => {
        const main = mainRef.current
        if (!main) return
    
        const scrollLeftPos = main.scrollLeft
        const maxScrollLeft = main.scrollWidth - main.clientWidth
    
        setCanScrollLeft(scrollLeftPos > 0)
        setCanScrollRight(scrollLeftPos < maxScrollLeft)
    }*/

    const updateScrollButtons = () => {
        const main = mainRef.current
        if (!main) return
        console.log(main.scrollLeft)
        setCanScrollRight(main.scrollLeft < 0)
        setCanScrollLeft(Math.round(main.scrollLeft - 1) > Math.round(main.clientWidth - main.scrollWidth))
    }
    
    const scrollLeft = () => {
        if (!canScrollLeft) return
        
        const main = mainRef.current
        if (!main) return
        
        main.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' })
        setTimeout(updateScrollButtons, 200)
    }
    
    const scrollRight = () => {
        if (!canScrollRight) return

        const main = mainRef.current
        if (!main) return
        
        main.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' })
        setTimeout(updateScrollButtons, 200)
    }

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
            return prevViewState === "compacting"
                    ? "compact"
                    : prevViewState === "comfying"
                        ? "comfy"
                        : prevViewState
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
            
            setShowOverlay(true)

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
        } 
    }

    return (<>
        {(showOverlay || isFirstLoading) && <Overlay />}
        <h1>{utilService.getPhrase(`calculator_title_compare`, phrases)}</h1>
        <section className='filter'>
            <article className='header'>
                <h2>בחר דירות להשוואה</h2>  
                <FormField type={"BUTTON"} key={keys.resetFilter} params={{...resetFilter, isLinkView: true}} onPress={onResetFilter} />  
            </article>
            <article className='elements'>
                <PropertyField type={"VISUAL_DROP_DOWN"} key={keys.cityFilter} params={cityFilter} isFirstLoading={isFirstLoading} onValueChanged={(value) => onCityChanged(value)} />   
                <PropertyField type={"MULTIPLE_DROP_DOWN"} key={keys.propertyFilter} params={propertyFilter} isFirstLoading={isFirstLoading} onValueChanged={(checked, propertyId) => onPropertyCheckedChanged(checked, propertyId)} />   
                <FormField type={"BUTTON"} key={keys.resetFilter} params={resetFilter} onPress={onResetFilter} />
            </article>
        </section>
        {!isLoadingState && properties !== null && properties.length === 0 && <div className={`main-content no-compared-properties`}>
            <h3>אין עדיין דירות להשוואה – בחר 2-3 דירות כדי לראות את ההבדלים.</h3>
            <img src={chooseApartments} alt='' />
        </div>}
        {isLoadingState && <div className={`main-content ${viewState} loading`}>
            {[...Array(LOADING_PROPERTIES_COUNT)].map((_, index) => (
                <PropertyForm isFirstLoading={true} key={`loading-property-${index}`} index={index} />
            ))}
        </div>}
        {!isLoadingState && properties && properties.length > 0 && <>
            <div className={`view-buttons ${viewState} ('count' + properties?.length) ?? 0}`}>
                <h2>תצוגה:</h2>
                <ViewComfyIcon className='comfy' onClick={() => changeViewState('comfy')} />
                <ViewCompactIcon className='compact' onClick={() => changeViewState('compact')} />
            </div>
            <div className={`scroll-buttons ${canScrollRight ? 'scroll-right' : ''} ${canScrollLeft ? 'scroll-left' : ''} count${properties?.length ?? 0}`}>
                <ScrollArrowRightIcon onClick={scrollRight} />
                <ScrollArrowLeftIcon onClick={scrollLeft} />
            </div>
            <div className={`main-content ${viewState}`} ref={mainRef} onTransitionEnd={handleViewStateTransitionEnd}>
                {properties.map((property, index) => (
                    <PropertyForm key={`property-${index}`} property={property} user={loggedinUser} isFirstLoading={isFirstLoading} onUpdate={(fieldName, fieldValue) => updateProperty(property._id, fieldName, fieldValue)} queryPropertyId={property._id} />
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