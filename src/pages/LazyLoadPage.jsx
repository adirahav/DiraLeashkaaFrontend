import React from 'react'
import { Header } from '../cmps/Header'

export default function LazyLoadPage() {
    return (<>
        <Header />
        <main className="lazy-load container">
            LazyLoad
        </main>
        <footer className='full'>
            <div>Footer</div>
        </footer>
    </>)
}
