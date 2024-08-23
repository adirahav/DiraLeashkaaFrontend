import { useState, useCallback } from 'react'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { DebounceSearch } from '../cmps/DebounceSearch'
import { utilService } from '../services/util.service'

export function DebouncePage() {
    const [filterBy, setFilterBy] = useState({phrase: ''})
    const debouncedSetFilterBy = useCallback(utilService.debounce(onSetFilter, 500), [])

    function onSetFilter(newFilter) {
        setFilterBy(newFilter);
    }

    return (<>
        <Header />
        <main className="container">
            <br /><div>Filter by: {filterBy.phrase}</div><br />
            <DebounceSearch filterBy={filterBy} onSetFilter={debouncedSetFilterBy} />         
        </main>
        <Footer />
    </>)
}
