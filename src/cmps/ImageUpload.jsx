import { useState } from 'react'
import { imageUploadService } from '../services/image-upload.service'

export function ImageUpload({ onUploaded = null }) {
    const [imgData, setImgData] = useState({
        imgUrl: null,
        height: 500,
        width: 500,
    })
    const [isUploading, setIsUploading] = useState(false)

    async function uploadImg(ev) {
        setIsUploading(true)
        const { secure_url, height, width } = await imageUploadService.uploadImg(ev)
        setImgData({ imgUrl: secure_url, width, height })
        setIsUploading(false)
        onUploaded?.(secure_url) 
    }

    function getUploadLabel() {
        if (imgData.imgUrl) return 'Upload Another?'
        return isUploading ? 'Uploading....' : 'Upload Image'
    }

    return (
        <div className="upload-preview">
            {imgData.imgUrl && <img src={imgData.imgUrl} style={{ maxWidth: '200px', float: 'right' }} />}
            <label htmlFor="imgUpload">{getUploadLabel()}</label>
            <input type="file" onChange={uploadImg} accept="img/*" id="imgUpload" />
        </div>
    )
}