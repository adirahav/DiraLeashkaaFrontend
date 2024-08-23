import { itemService } from '../../services/item.service.js'
import { store } from '../store.js'
import { SET_ITEMS, ADD_ITEM, UPDATE_ITEM, DELETE_ITEM } from '../reducers/store-item.reducer.js'

export async function loadItems() {
    try {
        const items = await itemService.query(itemService.getDefaultFilter(), itemService.getDefaultSort(), itemService.getDefaultPaging())    
        store.dispatch({type: SET_ITEMS, items})
    } catch (err) {
        console.log('Cannot load items', err)
        throw err
    }
}

export async function addItem(item) {
    try {
        const savedItem = await itemService.save(item)
        store.dispatch({type: ADD_ITEM, savedItem})
        return savedItem
    } catch (err) {
        console.log('Cannot add item', err)
        throw err
    }
}

export async function updateItem(item) {
    try {   
        const savedItem = await itemService.save(item)
        store.dispatch({type: UPDATE_ITEM, savedItem})
    } catch(err) {
        console.log("Had issues updating item")
        throw err
    }
}

export async function removeItem(itemId) {
    try {
        await itemService.remove(itemId)
        store.dispatch({type: DELETE_ITEM, itemId})
    } catch (err) {
        console.log('Cannot remove item', err)
        throw err
    }
}