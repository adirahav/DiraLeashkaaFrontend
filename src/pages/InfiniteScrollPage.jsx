import React from 'react'
import { Header } from '../cmps/Header'
import { InfiniteScroll } from '../cmps/InfiniteScroll'

export function InfiniteScrollPage() {

    return (<>
        <Header />
        <main className="infinite-scroll container">
            <InfiniteScroll />
        </main>
        <footer className='full'>
            <div>Footer</div>
        </footer>
    </>)
}
