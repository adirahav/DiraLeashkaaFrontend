import { useState, useEffect } from 'react'

export function FilterPaging({ paging, onSetPaging }) {
    const { pageNumber } = paging

    const hasPaging = pageNumber !== undefined

    const handleChangePageNumber = (ev, value) => {
        ev.preventDefault()
        ev.stopPropagation()
        
        onSetPaging({ ...paging, pageNumber: value })
        
    }

    const pageDownDisables = paging.pageNumber === undefined || paging.pageNumber <= 1
    const pageUpDisables = paging.pageNumber === undefined || paging.pageNumber >= paging.maxPages

    return (
        <section className='paging'>
            <label>Use paging: <input type="checkbox" checked={hasPaging} onChange={(event) => handleChangePageNumber(event, hasPaging ? undefined : 1)} /></label>
            {hasPaging && <>
                <button onClick={(event) => handleChangePageNumber(event, paging.pageNumber - 1)} disabled={pageDownDisables}>-</button>
                <span>{paging.pageNumber}</span>
                <button onClick={(event) => handleChangePageNumber(event, paging.pageNumber + 1)} disabled={pageUpDisables}>+</button>
            </>}
        </section>
    )
}
