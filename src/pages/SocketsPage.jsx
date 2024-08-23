import React, { useState, useEffect, useRef } from 'react'

import { Chat } from '../cmps/Chat'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'

export function SocketsPage() {
    

    return (<>
        <Header />
        <main className="home container">
            <Chat />
        </main>
        <Footer />
    </>)
}