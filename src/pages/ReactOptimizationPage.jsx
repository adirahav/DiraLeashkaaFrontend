import React, { useCallback } from 'react'
import { useEffect, useState } from "react"
import { Header } from '../cmps/Header'
import { reactOptimizationService } from '../services/react-optimization.service'
import { ReactOptimizationList } from '../cmps/ReactOptimizationList'

export function ReactOptimizationPage() {
    const [items, setItems] = useState([])
    
    const fetchItems = useCallback(async () => {
        try {
            const result = await reactOptimizationService.query()
            setItems(result)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }, [])

    const onRemoveItem = useCallback(async (item) => {
        try {
            await reactOptimizationService.remove(item.id)
            await fetchItems()
        } catch (err) {
            console.log('Had issues Removing item', err)
        }
    }, [])

    return (<>
        <Header />
        <button onClick={fetchItems} style={{width:'200px'}}>fetchItems</button>
        <ReactOptimizationList items={items} onRemove={onRemoveItem} />
        <footer className='full'>
            <div>Footer</div>
        </footer>
    </>)
}