import { useEffect, useRef, useState } from 'react'
import { mediaService } from '../services/media.service'
import { IconSizes, AddMediatIcon, LoadingIcon } from '../assets/icons'
import { Media } from './Media'
import { utilService } from '../services/util.service'
import { showErrorAlert } from './Alert'
import { useSplash } from '../contexts/SplashContext'

export function PropertyMedia({ list, onUpload, onRemove }) {
    const [mediaList, setMediaList] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef()

    const { splash } = useSplash()
    const phrases = splash?.phrases

    const MAX_MEDIA_COUNT = 4

    useEffect(() => {
        setMediaList(list ?? [])
    }, [list])

    // browse
    const onTriggerUploadMedia = (event) => {
        event.preventDefault()

        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const browseMedia = (event) => {
        event.preventDefault()
        uploadMedia(event.target.files)
    }
    
    // drag and drop
    const handleDragEnter = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(false)
    }

    const handleDragOver = (event) => {
        event.preventDefault()
        event.stopPropagation()
    }

    const handleDrop = (event) => {
        event.preventDefault()
        event.stopPropagation()

        setIsDragging(false)
        const files = event.dataTransfer.files
        uploadMedia(files)
    }

    // upload
    async function uploadMedia(files) {
        if (isUploading) {
            return
        }

        setIsUploading(true)

        try {
            const { secure_url, height, width, format, resource_type, public_id } = await mediaService.upload(files)
            setMediaList([
                ...mediaList, {
                    url: secure_url,
                    width,
                    height,
                    format,
                    type: resource_type,
                    publicId: public_id
                }]) 
            
            onUpload({url: secure_url, width, height, format, type: resource_type, publicId: public_id})
        }
        catch(e) {
            showErrorAlert({
                message: "ארעה תקלה בעת העלאת תמונה.\nנסה שוב מאוחר יותר.",
                closeButton: { show: true, autoClose: false }, 
                positiveButton: { show: true, text: utilService.getPhrase("dialog_tooltip_button_ok", phrases), onPress: async () => { }, closeAfterPress: true }, 
                negativeButton: { show: false }, 
            })
        }
        finally {
            setIsUploading(false)
        }
    }

    // delete
    async function deleteMedia(publicId) {
        //await mediaService.remove(publicId)
        setMediaList((prevMediaList) => {
            return prevMediaList.filter(item => item.publicId !== publicId)
        }) 
        onRemove(publicId)
    }
    
    
    return (
        <article className="media-list">
            {(mediaList || []).map((media, index) => (
                <Media key={index} media={media} onDelete={deleteMedia} />
            ))}
           {(mediaList?.length ?? 0) < MAX_MEDIA_COUNT && <div className='file-upload' onClick={onTriggerUploadMedia}>
                {isUploading && <LoadingIcon />}
                {!isUploading && <div><span>העלה תמונה</span><AddMediatIcon sx={IconSizes.Small} /></div>}
            </div>}
            {/*<input type="file" onChange={browseMedia}  accept="image/*,video/*" id="imgUpload" ref={fileInputRef} />*/}
            <input type="file" onChange={browseMedia}  accept="image/*" id="imgUpload" ref={fileInputRef} />
        </article>
    )
}