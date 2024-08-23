import { useState, useEffect } from "react";
import { IconSizes, MenuIcon } from "../assets/icons";
import { Overlay } from './Overlay_old';
import { utilService } from "../services/util.service";
import logo from '../assets/images/icon.png';
const { PLATFORM } = utilService;

export function Header() {

    const [showOverlay, setshowOverlay] = useState(!utilService.getPlatform() === PLATFORM.MOBILE);
    const [navClass, setNavClass] = useState("hide"); // hide ; hiding; show ; showing

    useEffect(() => {
        setshowOverlay(false);
    }, []);

    function onToggleMenu(ev) {  
        ev.preventDefault();
        ev.stopPropagation();
        
        setNavClass((prevNavClass) => {
            if (utilService.getPlatform() === PLATFORM.MOBILE) {
                setshowOverlay(!showOverlay);

                return prevNavClass === "show"
                        ? "hiding"
                        : "showing";
            }
            else {
                return "";
            } 
        });
    }

    const handleAnimationEnd = () => {
        setNavClass((prevNavClass) => {
            return prevNavClass === "hiding"
                    ? "hide"
                    : "show";
        });
    };

    
    return (<>
        {showOverlay && <Overlay onPress={onToggleMenu} />}

        <header className='full'>
            <div className="logo">
                <MenuIcon className="mobile" onClick={onToggleMenu} sx={ IconSizes.Medium } />
                <img src={logo} />
                <h1>דירה להשקעה</h1>
            </div>
            <nav className={navClass} onAnimationEnd={handleAnimationEnd}>
                <ul>
                    <li className="mobile">
                        <img className="logo" src={logo} />
                        <h1>דירה להשקעה</h1>
                    </li>
                    <li className="divider">שלום עדי</li>
                    <li>מחשבונים</li>
                    <li>פרטים אישיים</li>
                    <li>נתונים כלכליים</li>
                    <li>נתונים כלכליים</li>
                    <li className='mobile'>תנאי שימוש</li>
                    <li className='mobile'>צור קשר</li>
                    <li className='mobile'>שתף</li>
                    <li className='mobile divider'>זכויות יוצרים</li>
                    <li>התנתק</li>
                </ul>
            </nav>
            
        </header>
    </>);
}
