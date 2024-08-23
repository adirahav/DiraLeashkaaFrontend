import { useState, useEffect } from 'react'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { FilterSearch } from '../cmps/FilterSearch'
import { FilterSort } from '../cmps/FilterSort'
import { FilterPaging } from '../cmps/FilterPaging'
import { itemService } from '../services/item.service'

export function FilterPage() {
    const [items, setItems] = useState()
    const [filter, setFilter] = useState(itemService.getDefaultFilter())
    const [sort, setSort] = useState(itemService.getDefaultSort())
    const [paging, setPaging] = useState(itemService.getDefaultPaging())

    useEffect(() => {
        fetchItems()
    },[filter, sort, paging.pageNumber])

    const fetchItems = async () => {   
        try {
            const fetchedItems = await itemService.query(filter, sort, paging)
            setItems(fetchedItems.list)
            setPaging({ ...paging, maxPages: fetchedItems.paging.maxPages })
        } catch (error) {
            console.error('Error fetching server data:', error)
        } 
    }

    // filter
    function onSetFilter(newFilter) {
        setFilter(newFilter);
    }

    // sort
    function onSetSort(newSort) {
        setSort(newSort);
    }

    // paging
    const onSetPaging = (newPaging) => {
        setPaging(newPaging)
    }

    if (!items) return <></>

    return (<>
        <Header />
        <main className="home container">
            <FilterSearch filter={filter} onSetFilter={onSetFilter} />
            <FilterSort sort={sort} onSetSort={onSetSort} />
            <FilterPaging paging={paging} onSetPaging={onSetPaging} />

            <section className='cards'>
                {items && items.map((item, index) => (
                    <div key={index}>
                        <b>Name: </b>{item.name}<br />
                        <b>Score: </b>{item.score}<br />
                        <b>Created At: </b>{item.createdAt}<br />
                    </div>    
                ))}
            </section>
        </main>
        <Footer />
    </>)
}
