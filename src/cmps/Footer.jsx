import { NavLink } from "react-router-dom"
import { useSelector } from 'react-redux'                   
import { ContactUsIcon, ShareIcon, TermsOfUseIcon, IconSizes } from "../assets/icons" 
import { useEffect, useState } from "react"
import { useSplash } from '../contexts/SplashContext'
import { utilService } from "../services/util.service"

export function Footer() {
    const [showAllFooter, setShowAllFooter] = useState(false)
    const [version, setVersion] = useState(null)

    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters

    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)

    useEffect(() => {
        setShowAllFooter(!window.location.toString().includes("terms-of-use")) 
    }, [])

    useEffect(() => {
        if (!isLoadingState && phrases && fixedParameters) {
            const version = utilService.getFixedParameter("version", fixedParameters)
            const webUrl = version.find(entry => entry.key === "url").value
            const shareDescription = utilService.getPhrase("web_share_text", phrases)  
                
            setVersion({
                shareUrl: `whatsapp://send?text= ${shareDescription} ${webUrl}`,
                versionNumber: version.find(entry => entry.key === "lastVersion").value
            })
        }
    }, [isLoadingState])

    return (<>
        <footer className='full'>
            <div>
                <nav>
                    <ul>
                        <li><NavLink to="/terms-of-use"><TermsOfUseIcon sx={IconSizes.Small} /><span>תנאי שימוש</span></NavLink></li>
                        {showAllFooter && <li><NavLink to="/contact-us"><ContactUsIcon sx={IconSizes.Small} /><span>צור קשר</span></NavLink></li>}
                        {showAllFooter && <li><NavLink to={version?.shareUrl} rel="nofollow noopener" target="_blank"><ShareIcon sx={IconSizes.Small} /><span>שתף</span></NavLink></li>}
                        {showAllFooter && <li><span>|</span></li>}
                        {showAllFooter && <li><span>גירסה {parseFloat(version?.versionNumber).toFixed(1)}</span></li>}
                    </ul>
                </nav>
            </div>
            <div className="copyright">Icons made by itim2101 from www.flaticon.com</div>
        </footer>
    </>)
}
