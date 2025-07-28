import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { utilService } from '../services/util.service'
import { useSplash } from '../contexts/SplashContext'
import { useNavigate } from 'react-router-dom'
import { useNativeBackButton } from '../hooks/useNativeBackButton'
import { useEffect } from 'react'

export function TermsOfUsePage() {

    const { splash } = useSplash()
    const phrases = splash?.phrases

    const navigate = useNavigate()

    useNativeBackButton((superBack) => {
        const referrer = document.referrer

        if (referrer) {
            superBack()
        }
    })

    return (<>
        <Header />
        <main className="terms-of-use container" dangerouslySetInnerHTML={{ __html: utilService.getPhrase(`user_terms_of_use_text`, phrases) }}></main>
        <Footer />
    </>)
}
