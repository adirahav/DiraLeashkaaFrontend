import { useState, useEffect } from 'react'

export function FilterSearch({ filter, onSetFilter }) {
    const { phrase, score } = filter

    // search
    const handleSearchChange = (ev) => {
        ev.preventDefault()
        ev.stopPropagation()

        let { value } = ev.target
        onSetFilter({ ...filter, phrase: value })
    }

    // score
    const handleScoreChange = (ev) => {
        ev.preventDefault()
        ev.stopPropagation()

        let { value } = ev.target
        onSetFilter({ ...filter, score: +value })
    }

    return (
        <form>
            <label>Search: </label>
            <input type="text" placeholder="Search" onChange={handleSearchChange} id="search" value={phrase} name="search" />
            
            <label> score: </label>
            <select id="selectScore" value={score} onChange={handleScoreChange}>
                <option value="-1">All</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
            </select>
        </form> 
    )
}
