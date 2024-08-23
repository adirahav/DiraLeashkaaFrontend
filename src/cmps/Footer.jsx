import { NavLink } from "react-router-dom"
import { useSelector } from 'react-redux'                   /* STORE: [CART] STEP 13 */
import { addToCart } from '../store/actions/cart.actions'   /* STORE: [CART] STEP 14 */
import { ContactUsIcon, ShareIcon, TermsOfUseIcon, IconSizes } from "../assets/icons" 
import { useEffect, useState } from "react"

export function Footer() {
    const cart = useSelector(storeState => storeState.cartModule.cart)   /* STORE: [CART] STEP 16 */
    const [showAllFooter, setShowAllFooter] = useState(false)

    useEffect(() => {
        setShowAllFooter(!window.location.toString().includes("terms-of-use")) 
    }, [])

    return (<>
        <footer className='full'>
            <div>
                <nav>
                    <ul>
                        <li><NavLink to="/terms-of-use"><TermsOfUseIcon sx={IconSizes.Small} /><span>תנאי שימוש</span></NavLink></li>
                        {showAllFooter && <li><NavLink to="/contact-us"><ContactUsIcon sx={IconSizes.Small} /><span>צור קשר</span></NavLink></li>}
                        {showAllFooter && <li><NavLink to="/share"><ShareIcon sx={IconSizes.Small} /><span>שתף</span></NavLink></li>}
                        {showAllFooter && <li><span>|</span></li>}
                        {showAllFooter && <li><span>גירסה 2.4</span></li>}
                        {showAllFooter && <li><NavLink to="/copyright"><span>זכויות יוצרים</span></NavLink></li>}
                    </ul>
                </nav>                
            </div>
            
        </footer>
    </>)
}
