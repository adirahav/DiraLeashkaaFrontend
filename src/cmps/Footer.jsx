import { NavLink } from "react-router-dom"
import { useSelector } from 'react-redux'                   
import { ContactUsIcon, AndroidIcon, WebIcon, ShareIcon, TermsOfUseIcon, IconSizes } from "../assets/icons" 
import { useEffect, useState } from "react"
import { useSplash } from '../contexts/SplashContext'
import { utilService } from "../services/util.service"
import { Capacitor } from "@capacitor/core"

export function Footer() {
    const [showAllFooter, setShowAllFooter] = useState(false)
    const [share, setShare] = useState(null)

    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters

    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser) 
    
    useEffect(() => {
        setShowAllFooter(!window.location.toString().includes("terms-of-use")) 
    }, [])

    useEffect(() => {
        if (!isLoadingState && phrases && fixedParameters) {
            setShare(utilService.getShareMenu(phrases, fixedParameters))
        }
    }, [isLoadingState])

    return (<>
        {loggedinUser && <footer className='full'>
            <div>
                <nav>
                    <ul>
                        <li><NavLink to="/terms-of-use"><TermsOfUseIcon sx={IconSizes.Small} /><span>{utilService.getPhrase("drawer_terms_of_use", phrases)}</span></NavLink></li>
                        {showAllFooter && <li><NavLink to="/contact-us"><ContactUsIcon sx={IconSizes.Small} /><span>{utilService.getPhrase("drawer_contact_us", phrases)}</span></NavLink></li>}
                        {showAllFooter && <li><NavLink to={share?.url} rel="nofollow noopener" target="_blank"><ShareIcon sx={IconSizes.Small} /><span>{share?.text}</span></NavLink></li>}
                        {showAllFooter && <li><NavLink to={share?.moreUrl} rel="nofollow noopener" target="_blank">{share?.moreIcon === "web" ? <WebIcon sx={IconSizes.Small} /> : <AndroidIcon sx={IconSizes.Small} />}<span>{share?.moreText}</span></NavLink></li>}
                        {showAllFooter && <li><span>|</span></li>}
                        {showAllFooter && <li><span>{utilService.getPhrase("drawer_version", phrases).replace("%1$s", parseFloat(share?.versionNumber).toFixed(1))}</span></li>}
                    </ul>
                </nav>
            </div>
        </footer>}
    </>)
}
