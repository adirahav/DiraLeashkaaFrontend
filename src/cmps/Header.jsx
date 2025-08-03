import { useState, useEffect, useRef } from "react"
import { utilService } from "../services/util.service"
import logoDesktop from '../assets/images/icon_web.png'
import logoTablet from '../assets/images/icon.png'
import { NavLink, useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux'                   
import { IconSizes, MenuIcon, CalculateIcon, ContactUsIcon, FinancialDetailsIcon, LogoutIcon, 
         PersonalDetailsIcon, ShareIcon, TermsOfUseIcon, 
         MissingAvatarIcon,  BackIcon,
         WebIcon,
         AndroidIcon} from "../assets/icons"
import { logout } from "../store/actions/user.actions"
import { useSplash } from '../contexts/SplashContext'
import { FormField } from "./FormField"
import { Capacitor } from "@capacitor/core"
import { Browser } from '@capacitor/browser'

const { PLATFORM } = utilService

export function Header() {

    const navigate = useNavigate()

    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters

    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)

    const defultButtonState = (textKey) => {
        return {
            text: utilService.getPhrase(textKey, splash?.phrases), 
            isDisabled: false,
            isLoading: false
        }
    }

    const [navClassTablet, setNavClassTablet] = useState("narrow")  // narrow | narrowing | wide | widing
    const [navClassMobile, setNavClassMobile] = useState("hide")    // hide | hiding | show | showing
    const headerTabletRef = useRef()
    const headerMobileRef = useRef()
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)   
    const [showAllHeader, setShowAllHeader] = useState(false)
    const [showBack, setShowBack] = useState(false)
    const [share, setShare] = useState(null)
    const [addPropertyWeb, setAddPropertyWeb] = useState(defultButtonState("home_add_property"))
    const [addPropertyTablet, setAddPropertyTablet] = useState( {
        isDisabled: false,
        isLoading: false
    })

    useEffect(() => {
        const hasAllHeader = loggedinUser && 
        !window.location.toString().includes('signup')  
        setShowAllHeader(hasAllHeader)
        setShowBack(!hasAllHeader || !(window.location.toString().includes("home")) && loggedinUser!==null)
    }, [])

    useEffect(() => {
        if (splash?.phrases) {
            setAddPropertyWeb({ ...addPropertyWeb, text: utilService.getPhrase("home_add_property", splash?.phrases)})
        }
    }, [splash?.phrases])

    useEffect(() => {
        if (!isLoadingState && phrases && fixedParameters) {
            setShare(utilService.getShareMenu(phrases, fixedParameters))
        }
    }, [isLoadingState])

    useEffect(() => {
        if (navClassMobile) {
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside)
            }, 0)
        }

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }

    }, [navClassMobile])

    useEffect(() => {
        if (navClassTablet) {
            const headers = document.querySelectorAll('.main-layout')

            if (headers && headers.length === 1) {
                const header = headers[0]

                header.classList.remove('wide')
                header.classList.remove('narrow')
                header.classList.remove('widing')
                header.classList.remove('narrowing')
                header.classList.add(navClassTablet)
            }

            setAddPropertyTablet((prevAddPropertyTablet) => {
                return { 
                    ...prevAddPropertyTablet,
                    text: navClassTablet !== "wide" && navClassMobile === "hide" ? "+" : utilService.getPhrase("home_add_property", splash?.phrases)
                }
            })
        }
    }, [navClassTablet, navClassMobile])

    function handleClickOutside(ev) {
        if (headerTabletRef.current) {
            if (headerTabletRef.current.contains(ev.target)) {
                if (navClassTablet === "wide" || navClassTablet === "widing") {
                    onToggleTabletMenu(ev)
                }
            }
            
        }
        
        if (headerMobileRef.current && !headerMobileRef.current.contains(ev.target)) {
            if (navClassMobile === "show" || navClassMobile === "showing") {
                onToggleMobileMenu(ev)
            }
        }
    }

    function onToggleMobileMenu(ev) {  
        ev.preventDefault()
        ev.stopPropagation()
        
        setNavClassMobile((prevNavClassMobile) => {
            if (utilService.getPlatform() === PLATFORM.MOBILE) {
                
                return prevNavClassMobile === "show"
                        ? "hiding"
                        : "showing"
            } else {
                return ""
            } 
        })
    }

    function onToggleTabletMenu(ev) {  
        const whatsappShareItem = ev.target.closest('li > a[href^="whatsapp://send"]')
        const shareMoreItem = ev.target.closest('li > a[href^="https://diraleashkaa.onrender.com"]') 
                           || ev.target.closest('li > a[href^="https://play.google.com/store/apps/details?id=com.adirahav.diraleashkaa"]')
        
        if (whatsappShareItem || shareMoreItem) {
            return
        }

        ev.preventDefault()
        ev.stopPropagation()
        setNavClassTablet((prevNavClassTablet) => {
            return prevNavClassTablet === "wide"
                        ? "narrowing"
                        : "widing"
        })
    }

    function onPressBack(ev) {  
        ev.preventDefault()
        ev.stopPropagation()
        
        const pathname = new URL(window.location.href).pathname
        if (pathname === "/calculator") {
            navigate("/calculators")
        } else {
            navigate("/home")
        }
    }

    const handleMobileAnimationEnd = () => {
        setNavClassMobile((prevNavClassMobile) => {
            return prevNavClassMobile === "hiding"
                    ? "hide"
                    : "show"
        })
    }

    const handleTabletTransitionEnd = () => {
        setNavClassTablet((prevNavClassTablet) => {
            return prevNavClassTablet === "narrowing"
                    ? "narrow"
                    : "wide"
        })
    }

    const handleLogout = async (ev) => {
        ev.preventDefault() 
        try {
            logout()
            navigate("/login") 
        } catch (error) {
            console.error("Logout failed", error)
        }
    }

    const openWebBrowser = async (e) => {
        if (Capacitor.isNativePlatform() && share?.moreIcon === "web" && share?.moreUrl) {
            e.preventDefault()
            try {
              await Browser.open({ url: share.moreUrl })
            } catch (err) {
              console.error("Failed to open external browser:", err)
            }
        } 
    }

    const keys = {
        addPropertyWeb: "addPropertyWeb",
        addPropertyTablet: "addPropertyTablet"
    }

    if (!loggedinUser || 
        window.location.toString().includes("signup") || 
        window.location.toString().includes("login") || 
        window.location.toString().includes("forgot-password")
    ) {
        return (<>
            <header className='full logout'>
                <div className="logo">
                    <img  src={logoDesktop} />  
                </div>
            </header>
        </>)
    }

    return (<>
        <header className='full desktop'>
            <div className="logo">
                <NavLink to="/"><img  src={logoDesktop} /></NavLink>  
            </div>
            <nav className={navClassMobile}>
                <ul>
                    <li className="welcome"><a><MissingAvatarIcon sx={IconSizes.Small} /> שלום {loggedinUser?.fullname ?? 'אורח'}</a></li>
                    <li><NavLink to="/calculators"><CalculateIcon sx={IconSizes.Small} /><span>מחשבונים</span></NavLink></li>
                    <li><NavLink to="/personal-info"><PersonalDetailsIcon sx={IconSizes.Small} /><span>פרטים אישיים</span></NavLink></li>
                    <li><NavLink to="/financial-details"><FinancialDetailsIcon sx={IconSizes.Small} /><span>נתונים כלכליים</span></NavLink></li>
                    <li><NavLink to="/property"><FormField type={"BUTTON"} key={keys.addPropertyWeb} params={addPropertyWeb} /></NavLink></li>
                    <li className="logout"><a href="#" onClick={handleLogout}><LogoutIcon sx={IconSizes.Small} /><span>התנתק</span></a></li>
                </ul>
            </nav>
        </header>
        <header onTransitionEnd={handleTabletTransitionEnd} onClick={onToggleTabletMenu} className={'full tablet ' + navClassTablet} ref={headerTabletRef}>
            <div className="logo">
                {(navClassTablet === "narrow" || navClassTablet === "narrowing") && <NavLink to="/"><img src={logoTablet} /></NavLink>}  
                {(navClassTablet === "wide" || navClassTablet === "widing") && <NavLink to="/"><img  src={logoDesktop} /></NavLink>}  
            </div>
            <nav>
                <ul>
                    <li className="welcome"><a><MissingAvatarIcon sx={IconSizes.Small} /> <span>שלום {loggedinUser?.fullname ?? 'אורח'}</span></a></li>
                    
                    <li><NavLink to="/calculators"><CalculateIcon sx={IconSizes.Small} /><span>מחשבונים</span></NavLink></li>
                    <li><NavLink to="/personal-info"><PersonalDetailsIcon sx={IconSizes.Small} /><span>פרטים אישיים</span></NavLink></li>
                    <li><NavLink to="/financial-details"><FinancialDetailsIcon sx={IconSizes.Small} /><span>נתונים כלכליים</span></NavLink></li>
                    <li><NavLink to="/terms-of-use"><TermsOfUseIcon sx={IconSizes.Small} /><span>תנאי שימוש</span></NavLink></li>
                    <li><NavLink to="/contact-us"><ContactUsIcon sx={IconSizes.Small} /><span>צור קשר</span></NavLink></li>
                    <li><NavLink to={share?.url} rel="nofollow noopener" target="_blank"><ShareIcon sx={IconSizes.Small} /><span>{share?.text}</span></NavLink></li>
                    <li><a href={share?.moreUrl} onClick={openWebBrowser} rel="nofollow noopener" target="_blank">{share?.moreIcon === "web" ? (<WebIcon sx={IconSizes.Small} />) : (<AndroidIcon sx={IconSizes.Small} />)}<span>{share?.moreText}</span></a></li>
                    <li className="add-property"><NavLink to="/property"><FormField type={"BUTTON"} key={keys.addPropertyTablet} params={addPropertyTablet} /></NavLink></li>
                </ul>
                <ul className="bottom">
                    <li className="version"><span>v {parseFloat(share?.versionNumber).toFixed(1)}</span></li>
                    <li><a href="#" onClick={handleLogout}><LogoutIcon sx={IconSizes.Small} /><span>התנתק</span></a></li>
                </ul>
            </nav>
        </header>
        <header className='full mobile' ref={headerMobileRef}>
            <div className="logo">
                {showAllHeader && <MenuIcon className="menu" onClick={onToggleMobileMenu} sx={ IconSizes.Medium } />}
                {showAllHeader && <NavLink to="/">
                    <img src={logoDesktop} />
                </NavLink>}
                {!showAllHeader && <img src={logoDesktop} />}    
                {showBack && <BackIcon className="back" onClick={onPressBack} sx={ IconSizes.Medium } />}
            </div>
            <nav className={navClassMobile} onAnimationEnd={handleMobileAnimationEnd}>
                {showAllHeader && <ul>
                    <li><MenuIcon onClick={onToggleMobileMenu} sx={ IconSizes.Medium } /></li>
                    <li className="welcome"><MissingAvatarIcon sx={IconSizes.Small} /><span>שלום {loggedinUser?.fullname ?? 'אורח'}</span></li>
                    <li className="divider"></li>
                    <li><NavLink to="/calculators"><CalculateIcon sx={IconSizes.Small} /><span>מחשבונים</span></NavLink></li>
                    <li><NavLink to="/personal-info"><PersonalDetailsIcon sx={IconSizes.Small} /><span>פרטים אישיים</span></NavLink></li>
                    <li><NavLink to="/financial-details"><FinancialDetailsIcon sx={IconSizes.Small} /><span>נתונים כלכליים</span></NavLink></li>
                    <li><NavLink to="/terms-of-use"><TermsOfUseIcon sx={IconSizes.Small} /><span>תנאי שימוש</span></NavLink></li>
                    <li><NavLink to="/contact-us"><ContactUsIcon sx={IconSizes.Small} /><span>צור קשר</span></NavLink></li>
                    <li><NavLink to={share?.url} rel="nofollow noopener" target="_blank"><ShareIcon sx={IconSizes.Small} /><span>{share?.text}</span></NavLink></li>
                    <li><a href={share?.moreUrl} onClick={openWebBrowser} rel="nofollow noopener" target="_blank">{share?.moreIcon === "web" ? (<WebIcon sx={IconSizes.Small} />) : (<AndroidIcon sx={IconSizes.Small} />)}<span>{share?.moreText}</span></a></li>
                    <li className="add-property"><NavLink to="/property"><FormField type={"BUTTON"} key={keys.addPropertyTablet} params={addPropertyTablet} /></NavLink></li>
               
                    <li className="divider"></li>
                    <li className="logout"><a href="#" onClick={handleLogout}><LogoutIcon sx={IconSizes.Small} /><span>התנתק</span></a></li>
                </ul>}
            </nav>
        </header>
    </>)
}
