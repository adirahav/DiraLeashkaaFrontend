import { NavLink } from "react-router-dom"
import { useSelector } from 'react-redux'                   
import { ContactUsIcon, ShareIcon, TermsOfUseIcon, IconSizes } from "../assets/icons" 
import { useEffect, useState } from "react"
import { useSplash } from '../contexts/SplashContext'
import { utilService } from "../services/util.service"

export function Footer() {
    const [showAllFooter, setShowAllFooter] = useState(false)

    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters

    useEffect(() => {
        setShowAllFooter(!window.location.toString().includes("terms-of-use")) 
    }, [])

    const handleShare = async (ev) => {
        const version = utilService.getFixedParameter("version", fixedParameters) 
        const linkToShare = version.find(entry => entry.key === "url").value 
        const shareData = {
            title: 'שתפו עם חברים!',
            text: 'בדוק איזו דירה תניב לך את התשואה הגבוהה ביותר! לחץ על הקישור למחשבון שלנו והתחל לתכנן את ההשקעה המשתלמת שלך: דירה להשקעה',
            url: linkToShare,
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData)
                console.log('Link shared successfully')
            } catch (error) {
                console.error('Error sharing the link:', error)
            }
        } else {
            try {
                await navigator.clipboard.writeText(linkToShare)
                alert('Link copied to clipboard!')
            } catch (error) {
                console.error('Error copying the link to clipboard:', error)
                alert('Unable to share. Please copy the link manually.')
            }
        }
    }

    const webUrl = utilService.getFixedParameter("version", fixedParameters).find(entry => entry.key === "url").value
    const shareDescription = utilService.getPhrase("web_share_text", phrases)  
    const shareUrl = `whatsapp://send?text= ${shareDescription} ${webUrl}`

    return (<>
        <footer className='full'>
            <div>
                <nav>
                    <ul>
                        <li><NavLink to="/terms-of-use"><TermsOfUseIcon sx={IconSizes.Small} /><span>תנאי שימוש</span></NavLink></li>
                        {showAllFooter && <li><NavLink to="/contact-us"><ContactUsIcon sx={IconSizes.Small} /><span>צור קשר</span></NavLink></li>}
                        {showAllFooter && <li><NavLink to={shareUrl} rel="nofollow noopener" target="_blank"><ShareIcon sx={IconSizes.Small} /><span>שתף</span></NavLink></li>}
                        {showAllFooter && <li><span>|</span></li>}
                        {showAllFooter && <li><span>גירסה 2.4</span></li>}
                        {showAllFooter && <li><NavLink to="/copyright"><span>זכויות יוצרים</span></NavLink></li>}
                    </ul>
                </nav>                
            </div>
            
        </footer>
    </>)
}
