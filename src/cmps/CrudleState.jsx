import React, { useState } from 'react'
import { useEffect } from "react"
import { itemService } from '../services/item.service'

export function CrudleState() {
    const [items, setItems] = useState()

    useEffect(() => {
        fetchItems()
    },[])

    const fetchItems = async () => {   
        try {
            const fetchedItems = await itemService.query(itemService.getDefaultFilter(), itemService.getDefaultSort(), itemService.getDefaultPaging())
            setItems(fetchedItems.list)
        } catch (error) {
            console.error('Error fetching data:', error)
        } 
    }

    const getItemDetails = async (event, item) => {
        event.preventDefault()
        event.stopPropagation()

        const fetchedItem = await itemService.getById(item._id)
        alert(JSON.stringify(fetchedItem))
    }

    const removeItem = async (event, item) => {
        event.preventDefault()
        event.stopPropagation()
        
        await itemService.remove(item._id)

        setItems((prevItems) => {
            return prevItems.filter((items) => items._id !== item._id)
        })
    }

    const editItem = async (event, item) => {
        event.preventDefault()
        event.stopPropagation()

        const editedItemName = prompt("item name:")

        if (editedItemName !== null) {
            item.name = editedItemName
            const updatedItem = await itemService.save(item)

            setItems((prevItems) => {
                return prevItems.map((items) =>
                    items._id === item._id ? { ...items, ...updatedItem } : items
                ) 
            })
        }
    }

    const createItem = async (event) => {
        event.preventDefault()
        event.stopPropagation()

        const newItemName = prompt("item name:")

        if (newItemName !== null) {
            const item = {
                name: newItemName
            }
            const newItem = await itemService.save(item)
            
            setItems((prevItems) => {
                return [...prevItems, newItem]
            }) 
        }
    }

    if (!items) return <></>

    return (<>
        <main className="home container">
            <h1>Items (with state)</h1>
            <button onClick={(event) => createItem(event)}>Create</button>
            <section className='cards'>
                {items && items.map((item, index) => (
                    <div key={index}>
                        {item.name}<br />
                        <button onClick={(event) => getItemDetails(event, item)}>Details</button>
                        <button onClick={(event) => removeItem(event, item)}>Remove</button>
                        <button onClick={(event) => editItem(event, item)}>Edit</button>
                    </div>    
                ))}
            </section>
        </main>
    </>)
}
