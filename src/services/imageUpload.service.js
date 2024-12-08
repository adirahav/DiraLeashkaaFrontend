export const imageUploadService = {
    uploadImg
}

async function uploadImg(ev) {
    // https://cloudinary.com/ip/gr-sea-gg-brand-home-base?utm_source=google&utm_medium=search&utm_campaign=goog_selfserve_brand_wk22_replicate_core_branded_keyword&utm_term=1329&campaignid=17601148700&adgroupid=141182782954&keyword=cloudinary&device=c&matchtype=e&adposition=&gad_source=1&gclid=Cj0KCQiAnrOtBhDIARIsAFsSe522_zlZuRT6xTHIS_fhlBG4mf4eA0Q3vjwyZ6L9DK6zBaidLeziRKsaAvKGEALw_wcB
    
    const CLOUD_NAME = "dn4zdrszh"     // sashboard --> cloud name
    const UPLOAD_PRESET = "ml_adi"    // settings --> upload --> Upload presets --> Unsigned
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    try {
        const formData = new FormData()
        formData.append('upload_preset', UPLOAD_PRESET)
        formData.append('file', ev.target.files[0])

        const res = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData
        })
        const imgUrl = await res.json()
        return imgUrl
    } catch (err) {
        console.error('Failed to upload', err)
        throw err
    }
}