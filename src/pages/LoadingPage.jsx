import React from 'react'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { LoadingIcon } from '../assets/icons'
import { useSelector } from 'react-redux' 
import { useEffect } from 'react'
import { awaitExample } from '../store/actions/example.actions'

export function LoadingPage() {
    const isLoading = useSelector(storeState => storeState.systemModule.isLoading)   

    useEffect(() => {
        awaitExample()
    }, [])

    return (<>
        <Header />
        <main className="home container loading">
            {isLoading && <LoadingIcon />}
        </main>
        <Footer />
    </>)
}
