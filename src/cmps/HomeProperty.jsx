import React, { useEffect, useRef, useState } from 'react'
import { utilService } from '../services/util.service'
import { IconSizes, MedaltIcon, MissDataIcon, AddPropertyIcon, DeleteIcon, EditIcon } from '../assets/icons'
import missingPictureImage from '../assets/images/missing_picture.png'
import deletingIcon from '../assets/images/anim_delete.gif'
import { useSelector } from 'react-redux'
import { onAboutDeletingProperty, onAboutActingProperty } from '../store/actions/user.actions'
import { useSplash } from '../contexts/SplashContext'
import { FormField } from './FormField'

export function HomeProperty({ index, property, isBestYield, fullData, onPropertyPress }) {   
    const defultButtonState = (textKey) => {
        return {
            text: utilService.getPhrase(textKey, phrases), 
            isDisabled: true,
            isLoading: false
        }
    }
    
    const [picturesCounter, setPicturesCounter] = useState(1)
    const [picturesClasses, setPicturesClasses] = useState(1)
    const PICTURES_IMAGES_SIZE = (property?.media || []).length

    const { splash } = useSplash()
    const phrases = splash?.phrases

    const [deleteStatus, setDeleteStatus] = useState('')
    const [actionStatus, setActionStatus] = useState('')
    const propertyRef = useRef()

    const [deleteButtons, setDeleteButtons] = useState({
        confirm: defultButtonState("button_delete"),
        cancel: defultButtonState("button_cancel")
    })


    const isDeletingState = useSelector(storeState => storeState.userModule.home.isDeleting)
    const isDeletingRef = useRef(isDeletingState)

    const aboutDeleteIdState = useSelector(storeState => storeState.userModule.home.aboutDeleteId)
    const aboutDeleteIdRef = useRef(aboutDeleteIdState)

    const isActingState = useSelector(storeState => storeState.userModule.home.isActing)
    const isActingRef = useRef(isActingState)

    const aboutActionIdState = useSelector(storeState => storeState.userModule.home.aboutActionId)
    const aboutActionIdRef = useRef(aboutActionIdState)

    const startTouchX = useRef(null)

    const [awaitOnLoading, setAwaitOnLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setAwaitOnLoading(false)
        }, 500)
    }, [])

    useEffect(() => {
        isDeletingRef.current = isDeletingState
    }, [isDeletingState])

    useEffect(() => {
        aboutDeleteIdRef.current = aboutDeleteIdState
        if (property && aboutDeleteIdRef.current !== property?._id /*&& longPressedIdRef.current !== property?._id*/) {
            setDeleteStatus('')
        }
    }, [aboutDeleteIdState])

    useEffect(() => {
        isActingRef.current = isActingState
    }, [isActingState])

    useEffect(() => {
        aboutActionIdRef.current = aboutActionIdState
        if (property && aboutActionIdRef.current !== property?._id) {
            setActionStatus('')
        }
    }, [aboutActionIdState])

    useEffect(() => {
        if (!property) return
        
        const intervalId = setInterval(() => {
            setPicturesCounter((prev) => (prev === PICTURES_IMAGES_SIZE ? 1 : prev + 1))
        }, 4000)
    
        return () => clearInterval(intervalId)
    }, [property])
    
    useEffect(() => {
        if (index || property) {
            document.addEventListener('click', handleClickOutside)
        }
    
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [index, property])

    useEffect(() => {
        setPicturesClasses(
            (picturesClasses) => {
                return Array.from({ length: PICTURES_IMAGES_SIZE }, (_, index) =>
                    picturesCounter === index + 1 ? "show" : "hide"
                )
            }
        )
    }, [picturesCounter])

    // edit
    const handleEdit = (ev) => {
        if (!isDeletingRef.current && !aboutDeleteIdRef.current) {
            onPropertyPress(ev, property)
        }
    }

    // delete
    const handleBeforeDelete = () => {
        if (!isDeletingRef.current) {
            setDeleteStatus('before-deleting')
            onAboutDeletingProperty(property._id) 
            setDeleteButtons((prevDeleteButtons) => {
                return {
                    confirm: { ...prevDeleteButtons.confirm, text: utilService.getPhrase("button_delete", phrases), isDisabled: false, isLoading: false },
                    cancel: { ...prevDeleteButtons.cancel, text: utilService.getPhrase("button_cancel", phrases), isDisabled: false, isLoading: false }
                }
            })
        }
    }

    const handleConfirmDelete = (ev) => {
        if (property._id === aboutDeleteIdRef.current && !isDeletingRef.current) {
            setDeleteButtons((prevDeleteButtons) => {
                return {
                    confirm: { ...prevDeleteButtons.confirm, isLoading: true },
                    cancel: { ...prevDeleteButtons.cancel, isDisabled: true }
                }
            })
            
            onPropertyPress(ev, property)
        }

    }

    const handleCancleDelete = () => {
        if (property._id === aboutDeleteIdRef.current) {
            setDeleteStatus('')
            onAboutDeletingProperty(null)
        }
    }

    function handleClickOutside(ev) {
        if (property?._id === aboutDeleteIdRef.current && 
            !isDeletingRef.current &&
            !ev.target.closest('.delete-overlay') && 
            !ev.target.parentElement.className.baseVal?.includes("icon-delete") &&
            !ev.target.parentElement.className.baseVal?.includes("icon-edit")) {
            handleCancleDelete(ev)
        }

        if (property?._id === aboutActionIdRef.current && 
            !isActingRef.current &&
            !ev.target.closest('.actions-overlay') && 
            !ev.target.parentElement.className.baseVal?.includes("icon-delete") &&
            !ev.target.parentElement.className.baseVal?.includes("label-delete")) {
            handleCancleAction(ev)
        }
    }

    // swipe actions (mobile)
    const handleTouchStart = (event) => {
        startTouchX.current = event.touches[0].clientX
    }

    const handleTouchEnd = (event) => {
        const startX = startTouchX.current
        const endX = event.changedTouches[0].clientX
        
        if (startX === endX && actionStatus === '') {
            handleEdit(event)
        } else if (window.scrollX === 0 && startX < 80 && actionStatus === '') {
            if (!isActingRef.current) {
                setDeleteStatus('')
                onAboutDeletingProperty(null)
                setActionStatus('before-acting')
                onAboutActingProperty(property._id) 
            }   
        } else if (startX >= 80 && actionStatus === 'before-acting') {
            handleCancleDelete(event)
        } 
    }

    const handleCancleAction = () => {
        if (property._id === aboutActionIdRef.current) {
            setActionStatus('')
            onAboutActingProperty(null)
        }
    }

    const handleActionPress = () => {
        handleCancleAction()
        setTimeout(() => {
            handleBeforeDelete()
        }, 0)
    }

    const articleClass = (!property
                            ? `loading${index} `
                            : !property._id 
                                ? 'add-new '
                                : '')
                       + (awaitOnLoading ? 'await ' : '')
                       + (`${deleteStatus} `) 
                       + (`${actionStatus} `)

    const actionsClass = 'actions' 
                       + (isDeletingState ? ' disabled' : '')

    const address =  (!property?.city || property?.city === "else") 
                        ? property?.cityElse 
                            ? property?.address
                                ? utilService.getPhrase("home_properties_city_else", phrases).replace("%1$s", property?.address).replace("%2$s", property?.cityElse)
                                : property?.cityElse
                            : property?.address
                        : property?.address 
    
    const keys = {
        confirmDelete: "confirmDelete",
        cancelDelete: "cancelDelete"
    }

    const showMedaltIcon = property && isBestYield && fullData
    const showMissDataIcon = property && !property?.calcYieldForecast && fullData
    
    const note = property?.note?.replace(/\n/g, "<br />")

    return (
        <article ref={propertyRef} className={articleClass} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div className='container'>
                {property && property._id && 
                    <div className='media'>
                        {(property?.media || [{url:missingPictureImage}]).map((media, index) => (
                            <img key={index} src={media.url} className={picturesClasses[index]} />
                        ))}
                </div>}  
                <div className='details'>
                    <div>
                        <h2>{address}</h2>
                        {property && <div className='price'>{property?.price ? utilService.priceFormat(property?.price) : ''}</div>}
                    </div>
                    {property && note && <div>
                        <div className='note' dangerouslySetInnerHTML={{ __html: note }}></div>
                    </div>}
                </div>
                <div className='actions'>
                    <div className='indications'>
                        {showMedaltIcon && <MedaltIcon sx={IconSizes.Small} titleAccess='התשואה הטובה ביותר' />}
                        {showMissDataIcon && <MissDataIcon sx={IconSizes.Small} titleAccess='חסרים נתונים' />}
                    </div>
                    <div className={actionsClass}>
                        {property && property?._id && <DeleteIcon className='icon-delete' sx={IconSizes.Small} title='מחק' onClick={handleBeforeDelete} />}  
                        {property && property?._id && <EditIcon className='icon-edit' sx={IconSizes.Small} title='ערוך' onClick={handleEdit} />}  
                    </div>
                </div>
            </div>
            {property && property._id && <div className='delete-overlay'>
                <div>
                    {deleteStatus === 'before-deleting' && 
                        <div>
                            <h2>האם למחוק?</h2>
                            <div className='buttons'>
                                <FormField type={"BUTTON"} key={keys.confirmDelete} params={deleteButtons.confirm} onPress={handleConfirmDelete} />
                                <FormField type={"BUTTON"} key={keys.cancelDelete} params={deleteButtons.cancel} onPress={handleCancleDelete} />
                            </div>
                        </div>}
                    {deleteStatus === 'deleting' && <img src={deletingIcon} />}
                </div>
            </div>}
            {property && property._id && <div className='mobile actions-overlay'>
                {actionStatus === 'before-acting' && 
                    <div>
                        <div onClick={handleActionPress}>
                            {property && property?._id && <>
                                <DeleteIcon className='icon-delete' sx={IconSizes.Small} title='מחק'  /> 
                                <span className='label-delete' >מחק</span>
                            </>}     
                        </div>
                    </div>}
                {actionStatus === 'acting' && <img src={deletingIcon} />}
            </div>}
            
        </article>
    )
}
