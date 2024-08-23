import React, { useState } from 'react'
import { useEffect } from "react"
import { itemService } from '../services/item.service'
import { useSelector } from 'react-redux'
import { loadItems, addItem, updateItem, removeItem } from '../store/actions/store-item.action'
import { store } from '../store/store'
import { ADD_ITEM, UPDATE_ITEM, DELETE_ITEM } from '../store/reducers/store-item.reducer'

export function CrudleStore() {
    const list = useSelector(storeState => storeState.itemsModule.list)

    useEffect(() => {
        loadItems()
    },[])

    const getItemDetails = async (event, item) => {
        event.preventDefault()
        event.stopPropagation()

        const fetchedItem = await itemService.getById(item._id)
        alert(JSON.stringify(fetchedItem))
    }

    const handleRemoveItem = async (event, item) => {
        event.preventDefault()
        event.stopPropagation()
        
        await removeItem(item._id)
    }

    const handleUpdateItem = async (event, item) => {
        event.preventDefault()
        event.stopPropagation()

        const editedItemName = prompt("item name:")

        if (editedItemName !== null) {
            item.name = editedItemName
            await updateItem(item)
        }
    }

    const handleCreateItem = async (event) => {
        event.preventDefault()
        event.stopPropagation()

        const newItemName = prompt("item name:")

        if (newItemName !== null) {
            const item = {
                name: newItemName
            }
            await addItem(item)
        }
    }

    if (!list) return <></>

    return (<>
        <main className="home container">
            <h1>Items (with store)</h1>
            <button onClick={(event) => handleCreateItem(event)}>Create</button>
            <section className='cards'>
                {list && list.map((item, index) => (
                    <div key={index}>
                        {item.name}<br />
                        <button onClick={(event) => getItemDetails(event, item)}>Details</button>
                        <button onClick={(event) => handleRemoveItem(event, item)}>Remove</button>
                        <button onClick={(event) => handleUpdateItem(event, item)}>Edit</button>
                    </div>    
                ))}
            </section>
        </main>
    </>)
}
