import { useState, useEffect } from 'react'

export function DebounceSearch({ filterBy, onSetFilter }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const { phrase } = filterByToEdit

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    const handleSearchChange = (ev) => {
        ev.preventDefault()
        ev.stopPropagation()

        let { value } = ev.target

        setFilterByToEdit({ ...filterByToEdit, phrase: value })
    }

    return (<>
        <input type="text" placeholder="Search" onChange={handleSearchChange} id="search" value={phrase} name="search" />
    </>)
}
