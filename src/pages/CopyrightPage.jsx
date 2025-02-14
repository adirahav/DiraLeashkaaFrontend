import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { utilService } from '../services/util.service'
import { useSplash } from '../contexts/SplashContext'

export function CopyrightPage() {

    const { splash } = useSplash()
    const phrases = splash?.phrases
    
    return (<>
        <Header />
        <main className="copyright container" dangerouslySetInnerHTML={{ __html: utilService.getPhrase(`copyright_text`, phrases) }}></main>
        <Footer />
    </>)
}
