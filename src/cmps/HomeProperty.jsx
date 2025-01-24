import React, { useEffect, useRef, useState } from 'react'
import { utilService } from '../services/util.service'
import { IconSizes, MedaltIcon, MissDataIcon, AddPropertyIcon, DeleteIcon, EditIcon } from '../assets/icons'
import propertyImage from '../assets/images/property.jpg'
import deletingIcon from '../assets/images/anim_delete.gif'
import { useSelector } from 'react-redux'
import { onAboutDeletingProperty, onLongPressProperty } from '../store/actions/user.actions'
import { useSplash } from '../contexts/SplashContext'
import { FormField } from './FormField'

export function HomeProperty({ index, property, isBestYield, onPropertyPress }) {   
    const defultButtonState = (textKey) => {
        return {
            text: utilService.getPhrase(textKey, phrases), 
            isDisabled: true,
            isLoading: false
        }
    }
    
    const { splash } = useSplash()
    const phrases = splash?.phrases

    const [status, setStatus] = useState('')
    const propertyRef = useRef()

    const [deleteButtons, setDeleteButtons] = useState({
        confirm: defultButtonState("button_delete"),
        cancel: defultButtonState("button_cancel")
    })


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

    useEffect(() => { 
        if (index || property) {
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside)
            }, 0)
        }

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [index, property])

    const handleEdit = (ev) => {
        if (!isDeletingRef.current) {
            onPropertyPress(ev, property)
        }
    }

    const handleBeforeDelete = () => {
        if (!isDeletingRef.current) {
            setStatus('before-deleting')
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

    const handleCancleDelete = (ev) => {
        if (property._id === aboutDeleteIdRef.current) {
            setStatus('')
            onAboutDeletingProperty(null)
        }
    }

    function handleClickOutside(ev) {
        if (property._id === aboutDeleteIdRef.current && 
            !isDeletingRef.current &&
            !ev.target.closest('.delete-overlay') && 
            !ev.target.parentElement.className.baseVal?.includes("icon-delete") &&
            !ev.target.parentElement.className.baseVal?.includes("icon-edit")) {
            console.log("outside") 
            handleCancleDelete(ev)
        }
    }

    const articleClass = (!property
                            ? `loading${index}`
                            : !property._id 
                                ? 'add-new'
                                : '')
                       + (status)

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

    return (
        <article ref={propertyRef} className={articleClass}>
            <div className='container'>
                {property && property._id && <img src={propertyImage} />}  
                <div>
                    <h2>{address}</h2>
                    {property && !property._id && <div><AddPropertyIcon sx={IconSizes.Small} /></div>}  
                    {property && <span className='price'>{property?.price ? utilService.priceFormat(property?.price) : ''}</span>}
                </div>
                <div>
                    <div className='indications'>
                        {property && isBestYield && <MedaltIcon sx={IconSizes.Small} titleAccess='התשואה הטובה ביותר' />}
                        {property && !property?.calcYieldForecast && <MissDataIcon sx={IconSizes.Small} titleAccess='חסרים נתונים' />}
                    </div>
                    <div className={actionsClass}>
                        {property && property?._id && <DeleteIcon className='icon-delete' sx={IconSizes.Small} title='מחק' onClick={handleBeforeDelete} />}  
                        {property && property?._id && <EditIcon className='icon-edit' sx={IconSizes.Small} title='ערוך' onClick={handleEdit} />}  
                    </div>
                </div>
            </div>
            {property && property._id && <div className='delete-overlay'>
                <div>
                    {status === 'before-deleting' && 
                        <div>
                            <h2>האם למחוק?</h2>
                            <div className='buttons'>
                                <FormField type={"BUTTON"} key={keys.confirmDelete} params={deleteButtons.confirm} onPress={handleConfirmDelete} />
                                <FormField type={"BUTTON"} key={keys.cancelDelete} params={deleteButtons.cancel} onPress={handleCancleDelete} />
                            </div>
                        </div>}
                    {status === 'deleting' && <img src={deletingIcon} />}
                </div>
            </div>}
            
        </article>
    )
}
