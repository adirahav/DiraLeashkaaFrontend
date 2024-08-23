import { useState } from 'react'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { CrudleState } from '../cmps/CrudleState'
import { CrudleStore } from '../cmps/CrudleStore'

export function CrudlPage() {
    const [source, setSource] = useState('state')

    return (<>
        <Header />
        <div>
            <label><input type="radio" name="source" value="state" checked={source === 'state'} onChange={({ target }) => setSource(target.value)} />State</label>
            <label><input type="radio" name="source" value="store"checked={source === 'store'} onChange={({ target }) => setSource(target.value)} />Store</label>
        </div>
        <main className="home container">
            {source === "state" && <CrudleState />}
            {source === "store" && <CrudleStore />}
        </main>
        <Footer />
    </>)
}
