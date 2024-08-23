import { useEffect, useState } from 'react'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { coockieService } from '../services/coockie.service.js'

export function CoockiePage() {
    const [coockieCounter, setCookieCounter] = useState()

    useEffect(() => {
        fetchCookieCounter()
    },[])

    const fetchCookieCounter = async () => {   
        try {
            const fetchedCookieCounter = await coockieService.getCounter()
            setCookieCounter(fetchedCookieCounter)
        } catch (error) {
            console.error('Error fetching server data:', error)
        } 
    }

    return (<>
        <Header />
        <main className="container">
            <button onClick={fetchCookieCounter}>Count</button>
            <br /><div>Coockie Counter: {coockieCounter}</div><br />
        </main>
        <Footer />
    </>)
}
