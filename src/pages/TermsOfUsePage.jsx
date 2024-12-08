import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { utilService } from '../services/util.service'
import { useSplash } from '../contexts/SplashContext'

export function TermsOfUsePage() {

    const { splash } = useSplash()
    const phrases = splash?.phrases

    return (<>
        <Header />
        <main className="terms-of-use container" dangerouslySetInnerHTML={{ __html: utilService.getPhrase(`user_terms_of_use_text`, phrases) }}></main>
        <Footer />
    </>)
}
