import React from 'react'
import { useEffect } from "react"
import { Header } from '../cmps/Header'
import { onToggleModal } from '../store/actions/app.actions'
import { Footer } from '../cmps/Footer'
import { useSplash } from '../SplashContext'

export function DynamicModalPage() {

    const { splash } = useSplash()
    const phrases = splash?.phrases

    const prop1 = { attr1: "attr1", attr2: "attr2" }
    useEffect(() => {
        openModal()
    }, [])

    function openModal() {
        onToggleModal({
            cmp: ComponentExample1,
            props: {
                onCloseModal() {
                    onToggleModal(null)
                },
                prop1
            }
        })
    }

    return (<>
        <Header />
        <main className="upload container">
            
        </main>
        <Footer />
    </>)
}

function ComponentExample1({props, onCloseModal}) {
    return <div>
        ComponentExample1<br />
        <button props={props} onClick={onCloseModal} >close</button>
    </div>
}
