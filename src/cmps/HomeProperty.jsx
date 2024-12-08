import React, { useEffect, useRef, useState } from 'react'
import { utilService } from '../services/util.service'
import { IconSizes, MedaltIcon, MissDataIcon, AddPropertyIcon } from '../assets/icons'
import propertyImage from '../assets/images/property.jpg'
import addIcon from '../assets/images/icon_big_add.png'
import deleteIcon from '../assets/images/icon_delete.png'
import deleteIconDisable from '../assets/images/icon_delete_disable.png'
import deletingIcon from '../assets/images/anim_delete.gif'
import { useSelector } from 'react-redux'
import { onAboutDeletingProperty, onLongPressProperty } from '../store/actions/user.actions'
import { useSplash } from '../contexts/SplashContext'

export function HomeProperty({ index, property, isBestYield, onPropertyPress }) {   
    const { splash } = useSplash()
    const phrases = splash?.phrases

    const [status, setStatus] = useState('')
    const propertyRef = useRef()

    const isDeletingState = useSelector(storeState => storeState.userModule.home.isDeleting)
    const isDeletingRef = useRef(isDeletingState)

    const aboutDeleteIdState = useSelector(storeState => storeState.userModule.home.aboutDeleteId)
    const aboutDeleteIdRef = useRef(aboutDeleteIdState)

    /*const [isLongPress, setIsLongPress] = useState(false)
    const longPressedIdState = useSelector(storeState => storeState.userModule.home.longPressedId)
    const longPressedIdRef = useRef(longPressedIdState)
    let longPressTimeout*/

    useEffect(() => {
        isDeletingRef.current = isDeletingState
    }, [isDeletingState])

    useEffect(() => {
        aboutDeleteIdRef.current = aboutDeleteIdState
        if (property && aboutDeleteIdRef.current !== property?._id /*&& longPressedIdRef.current !== property?._id*/) {
            setStatus('')
        }
    }, [aboutDeleteIdState])

    /*useEffect(() => {
        longPressedIdRef.current = longPressedIdState
        if (property && longPressedIdRef.current !== property?._id) {
            setStatus('')
        }
    }, [longPressedIdState])*/

    useEffect(() => { 
        if (index || property) {
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside)

                /*document.addEventListener('mousedown', handleLongPressStart)
                document.addEventListener('mouseup', handleLongPressEnd)
                document.addEventListener('mouseleave', handleLongPressEnd)

                document.addEventListener('touchstart', handleLongPressStart)
                document.addEventListener('touchend', handleLongPressEnd)
                document.addEventListener('touchmove', handleLongPressEnd)*/
            }, 0)
        }

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [index, property])

    const handlePropertyPress = (ev, property) => {
        /*if (isLongPress) {
            return
        }*/

        if (!isDeletingRef.current) {
            if (ev.target.className === 'icon-delete') {
                ev.stopPropagation()
                setStatus('before-deleting')
                onAboutDeletingProperty(property._id) 
                //onLongPressProperty(null)  
            } else {
                setStatus('deleting')
                onPropertyPress(ev, property)
            } 
        } 
    }

    function handleClickOutside(ev) {
        if (propertyRef.current && !propertyRef.current.contains(ev.target) && !isDeletingRef.current /*&& longPressedIdRef.current !== property?._id*/) {
            setStatus('')
            onAboutDeletingProperty(null)
            //onLongPressProperty(null)
        }
    }

    /*function handleLongPressStart(ev) {
        console.log("handleLongPressStart")
        if (propertyRef.current && propertyRef.current.contains(ev.target) && !isDeletingRef.current) {
            if (property?._id && longPressedIdRef.current !== property?._id) {
                ev.stopPropagation()
                setStatus('before-deleting')
                onLongPressProperty(property._id)  
                longPressTimeout = setTimeout(() => {
                    setIsLongPress(true)
                }, 500)
            } 
        }
    }

    function handleLongPressEnd(ev) {
        clearTimeout(longPressTimeout)

        if (isLongPress) {
            ev.stopPropagation()
            setIsLongPress(false)
        }
    }*/

    const articleClass = (!property
                            ? `loading${index}`
                            : !property._id 
                                ? 'add-new'
                                : '')
                       + (status)

    const deleteIconSrc = property && aboutDeleteIdState === property?._id
                            ? null
                            : property?._id && isDeletingState
                                ? deleteIconDisable
                                : deleteIcon

    const address =  (!property?.city || property?.city === "else") 
                        ? property?.cityElse 
                            ? property?.address
                                ? utilService.getPhrase("home_properties_city_else", phrases).replace("%1$s", property?.address).replace("%2$s", property?.cityElse)
                                : property?.cityElse
                            : property?.address
                        : property?.address 
    
    return (
        <article ref={propertyRef} className={articleClass} onClick={(ev) => handlePropertyPress(ev, property)}>
            <div className='container'>
                <div>
                    {isBestYield && <MedaltIcon sx={IconSizes.Small} />}
                    {property?.calcYieldForecast && <MissDataIcon sx={IconSizes.Small} />}
                    <h2>{address}</h2>
                </div>
                {property && property._id && <img src={propertyImage} />}
                {/*property && !property._id && <img src={addIcon} />*/}
                {property && !property._id && <div><AddPropertyIcon sx={IconSizes.Small} /></div>}
            </div>
            {property && property._id && <div className='delete-overlay'>
                <div>
                    {status === 'before-deleting' && <img src={deleteIcon} />}
                    {status === 'deleting' && <img src={deletingIcon} />}
                    {status === 'before-deleting' && <span>{utilService.getPhrase("home_properties_menu_delete", phrases)}</span>}
                </div>
            </div>}
            {property && 
                <span className='footer'>
                    {property?.price ? utilService.priceFormat(property?.price) : ''}
                    {property?._id && deleteIconSrc && <img  className='icon-delete' src={deleteIconSrc} />}
                </span>}
        </article>
    )
}
