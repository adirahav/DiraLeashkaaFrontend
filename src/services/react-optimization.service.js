import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const reactOptimizationService = {
    query,
    remove
}

const STORAGE_KEY = 'react-optimization'

_createItems()

async function query(filterBy) {
    const items = await storageService.query(STORAGE_KEY)
    return items
}

function remove(id) {
    return storageService.remove(STORAGE_KEY, id)
}

function _createItems() {
    let items = utilService.loadFromStorage(STORAGE_KEY)
    if (!items || !items.length) {
        items = [
            { id: 'i1', name: 'Item 1' },
            { id: 'i2', name: 'Item 2' },
            { id: 'i3', name: 'Item 3' },
            { id: 'i4', name: 'Item 4' },
            { id: 'i5', name: 'Item 5' },
            { id: 'i6', name: 'Item 6' },
            { id: 'i7', name: 'Item 7' },
            { id: 'i8', name: 'Item 8' },
            { id: 'i9', name: 'Item 9' },
            { id: 'i10', name: 'Item 10' },
        ]
        utilService.saveToStorage(STORAGE_KEY, items)
    }
}