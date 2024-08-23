import { useState, useEffect, useRef } from "react"
import { IconSizes, MenuIcon } from "../assets/icons"
import { utilService } from "../services/util.service"
import logo from '../assets/images/icon.png'
import { NavLink } from "react-router-dom"
import { useSelector } from 'react-redux'                   /* STORE: [CART] STEP 8 */
import { addToCart } from '../store/actions/cart.actions'   /* STORE: [CART] STEP 9 */
import { CartIcon } from "../assets/icons"                  /* STORE: [CART] STEP 10 */
import { userService } from "../services/user.service"
import { CalculateIcon, ContactUsIcon, FinancialDetailsIcon, LogoutIcon, PersonalDetailsIcon, RegistrationDetailsIcon, ShareIcon, TermsOfUseIcon } from "../assets/icons"
const { PLATFORM } = utilService

export function Header() {

    const [navClass, setNavClass] = useState("hide") // hide | hiding | show | showing
    const headerRef = useRef()
    const cart = useSelector(storeState => storeState.cartModule.cart)   /* STORE: [CART] STEP 11 */
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)   
    const [showAllHeader, setShowAllHeader] = useState(false)

    function onAddToCart() {
        addToCart()
    }

    useEffect(() => {
        setShowAllHeader(!window.location.toString().includes("terms-of-use")) 
    }, [])

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
            onToggleMenu(ev)
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

    const handleAnimationEnd = () => {
        setNavClass((prevNavClass) => {
            return prevNavClass === "hiding"
                    ? "hide"
                    : "show"
        })
    }
    
    return (<>
        <header className='full' ref={headerRef}>
            <div className="logo">
            {showAllHeader &&<MenuIcon className="mobile" onClick={onToggleMenu} sx={ IconSizes.Medium } />}
                <NavLink to="/">
                    <img  className="tablet-or-desktop" src={logo} />
                    <h1 className="mobile">דירה להשקעה</h1>
                </NavLink>  
            </div>
            {!showAllHeader &&<h1>דירה להשקעה</h1>}
            <nav className={navClass} onAnimationEnd={handleAnimationEnd}>
                {showAllHeader && <ul>
                    <li className="welcome"><span>שלום {loggedinUser?.username ?? 'אורח'}</span></li>
                    <li className="mobile divider"></li>
                    <li><NavLink to="/calculators"><CalculateIcon sx={IconSizes.Small} /><span>מחשבונים</span></NavLink></li>
                    <li><NavLink to="/personal-info"><PersonalDetailsIcon sx={IconSizes.Small} /><span>פרטים אישיים</span></NavLink></li>
                    <li><NavLink to="/financial-info"><FinancialDetailsIcon sx={IconSizes.Small} /><span>נתונים כלכליים</span></NavLink></li>
                    <li><NavLink to="/registration-details"><RegistrationDetailsIcon sx={IconSizes.Small} /><span>פרטי מנוי</span></NavLink></li>
                    <li className="mobile"><NavLink to="/terms-of-use"><TermsOfUseIcon sx={IconSizes.Small} /><span>תנאי שימוש</span></NavLink></li>
                    <li className="mobile"><NavLink to="/contact-us"><ContactUsIcon sx={IconSizes.Small} /><span>צור קשר</span></NavLink></li>
                    <li className="mobile"><NavLink to="/share"><ShareIcon sx={IconSizes.Small} /><span>שתף</span></NavLink></li>
                    <li className="logout"><NavLink to="/logout"><LogoutIcon sx={IconSizes.Small} /><span>התנתק</span></NavLink></li>
                    <li className="mobile divider"></li>
                    <li className="mobile"><span>גירסה 2.4</span></li>
                    <li className="mobile divider"></li>
                    <li className="mobile"><NavLink to="/copyright"><span>זכויות יוצרים</span></NavLink></li>
                </ul>}
            </nav>
        </header>
    </>)
}
