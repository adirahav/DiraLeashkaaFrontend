import { useState, useEffect, useRef } from "react"
import { utilService } from "../services/util.service"
import logo from '../assets/images/icon.png'
import { NavLink, useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux'                   
import { IconSizes, MenuIcon, CalculateIcon, ContactUsIcon, FinancialDetailsIcon, LogoutIcon, 
         PersonalDetailsIcon, RegistrationDetailsIcon, AddPropertyIcon, ShareIcon, TermsOfUseIcon, 
         BackIcon} from "../assets/icons"
import { logout } from "../store/actions/user.actions"
import { useSplash } from '../contexts/SplashContext'
const { PLATFORM } = utilService

export function Header() {

    const [navClass, setNavClass] = useState("hide") // hide | hiding | show | showing
    const headerRef = useRef()
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)   
    const [showAllHeader, setShowAllHeader] = useState(false)
    const [showBack, setShowBack] = useState(false)
    const [version, setVersion] = useState(null)

    const navigate = useNavigate()

    const { splash } = useSplash()
    const phrases = splash?.phrases
    const fixedParameters = splash?.fixedParameters

    const isLoadingState = useSelector(storeState => storeState.appModule.isLoading)

    useEffect(() => {
        const hasAllHeader = 
            !((window.location.toString().includes("terms-of-use") 
            || window.location.toString().includes("contact-us")) && loggedinUser===null)
        
        setShowAllHeader(hasAllHeader)
        
        setShowBack(!hasAllHeader || !(window.location.toString().includes("home")) && loggedinUser!==null)
        
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

    useEffect(() => {
        if (navClass) {
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside)
            }, 0)
        }

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }

    }, [navClass])

    function handleClickOutside(ev) {
        if (headerRef.current && !headerRef.current.contains(ev.target)) {
            if (navClass === "show" || navClass === "showing") {
                onToggleMenu(ev)
            }
        }
    }

    function onToggleMenu(ev) {  
        ev.preventDefault()
        ev.stopPropagation()
        
        setNavClass((prevNavClass) => {
            if (utilService.getPlatform() === PLATFORM.MOBILE) {
                
                return prevNavClass === "show"
                        ? "hiding"
                        : "showing"
            } else {
                return ""
            } 
        })
    }

    function onPressBack(ev) {  
        ev.preventDefault()
        ev.stopPropagation()
        
        navigate("/home") 
    }

    const handleAnimationEnd = () => {
        setNavClass((prevNavClass) => {
            return prevNavClass === "hiding"
                    ? "hide"
                    : "show"
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

    return (<>
        <header className='full' ref={headerRef}>
            <div className="logo">
                {showAllHeader && <MenuIcon className="mobile" onClick={onToggleMenu} sx={ IconSizes.Medium } />}
                {!showAllHeader && <div className="mobile" style={{width:55}}></div>}
                <NavLink to="/">
                    <img  className="tablet-or-desktop" src={logo} />
                    <h1 className="mobile">דירה להשקעה</h1>
                </NavLink>  
                {showBack && <BackIcon className="mobile" onClick={onPressBack} sx={ IconSizes.Medium } />}
                {!showBack && <div className="mobile" style={{width:55}}></div>}
            </div>
            {!showAllHeader &&<h1>דירה להשקעה</h1>}
            <nav className={navClass} onAnimationEnd={handleAnimationEnd}>
                {showAllHeader && <ul>
                    <li className="welcome"><MenuIcon className="mobile" onClick={onToggleMenu} sx={ IconSizes.Medium } /><span>שלום {loggedinUser?.fullname ?? 'אורח'}</span></li>
                    <li className="mobile divider"></li>
                    <li><NavLink to="/calculators"><CalculateIcon sx={IconSizes.Small} /><span>מחשבונים</span></NavLink></li>
                    <li><NavLink to="/personal-info"><PersonalDetailsIcon sx={IconSizes.Small} /><span>פרטים אישיים</span></NavLink></li>
                    <li><NavLink to="/financial-details"><FinancialDetailsIcon sx={IconSizes.Small} /><span>נתונים כלכליים</span></NavLink></li>
                    {false && <li><NavLink to="/registration-details"><RegistrationDetailsIcon sx={IconSizes.Small} /><span>פרטי מנוי</span></NavLink></li>}
                    <li><NavLink to="/property"><AddPropertyIcon sx={IconSizes.Small} /><span><b>הוסף נכס</b></span></NavLink></li>
                    <li className="mobile"><NavLink to="/terms-of-use"><TermsOfUseIcon sx={IconSizes.Small} /><span>תנאי שימוש</span></NavLink></li>
                    <li className="mobile"><NavLink to="/contact-us"><ContactUsIcon sx={IconSizes.Small} /><span>צור קשר</span></NavLink></li>
                    <li className="mobile"><NavLink to={version?.shareUrl} rel="nofollow noopener" target="_blank"><ShareIcon sx={IconSizes.Small} /><span>שתף</span></NavLink></li>
                    <li className="logout"><a href="#" onClick={handleLogout}><LogoutIcon sx={IconSizes.Small} /><span>התנתק</span></a></li>
                    <li className="mobile divider"></li>
                    <li className="mobile"><span>גירסה {parseFloat(version?.versionNumber).toFixed(1)}</span></li>
                    <li className="mobile divider"></li>
                    <li className="mobile"><span>Icons made by itim2101 from www.flaticon.com</span></li>
                </ul>}
            </nav>
        </header>
    </>)
}
