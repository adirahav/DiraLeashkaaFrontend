import React, { useEffect } from 'react'
import imgBagMoney from '../assets/images/lottie_bag_money.json'
import Lottie from 'lottie-react'
import { utilService } from '../services/util.service'
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'
import { useSplash } from '../contexts/SplashContext.jsx'

export function SignupWelcome({ onComplete }) {   

    const { splash } = useSplash()
    const phrases = splash?.phrases

    useEffect(() => {
        if (!phrases) {
            onLoadingStart()  
        } else {
            onLoadingDone()  
        }
    }, [phrases])

    const handleOnComplete = () => {
        onComplete()
    }
    
    return (<div className='welcome'>
        <h2>{utilService.getPhrase("signup_welcome_text", phrases)}</h2>
        <Lottie 
            animationData={imgBagMoney} 
            loop={false} 
            autoplay={true} 
            onComplete={() => handleOnComplete()}  />
    </div>)
}
