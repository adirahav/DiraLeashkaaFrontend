import { httpService } from './http.service'

const BASE_URL = 'item/'

export const itemService = {
    query,              // list
    getById,            // read
    save,               // create | update
    remove,             // delete
    getDefaultFilter,
    getDefaultSort,
    getDefaultPaging
}

async function query(filter, sort, paging) {
    const { phrase, score  } = filter
    const { sortBy, sortDir  } = sort
    const { pageNumber } = paging
    const params = { phrase, score, sortBy, sortDir, pageNumber }

    try {
        const data = await httpService.get(BASE_URL, { params })
        return data
    } catch(err) {
        console.log("Had problems getting items")
        throw err
    }
}

async function getById(itemId) {
    try {
        const item = await httpService.get(BASE_URL + itemId)
        return item
    } catch(err) {
        console.log(`Had problems getting item ${itemId}`)
        throw err
    }
}

async function remove(itemId) {
    try {
        await httpService.delete(BASE_URL + itemId)
        return itemId
    } catch(err) {
        console.log(`Had problems delete item ${itemId}`)
        throw err
    }
}

async function save(itemToSave) {
    itemToSave._id = itemToSave._id || ''
    
    const queryString = Object.entries(itemToSave)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')

    
    const method = itemToSave._id ? 'put' : 'post'
    try {
        const savedItem = await httpService[method](BASE_URL, itemToSave)
        return savedItem
    } catch(err) {
        console.log(`Had problems save item ${itemId}`)
        throw err
    }
}

function getDefaultFilter() {
    return {
        phrase: '',
        score: -1,
    }
}

function getDefaultSort() {
    return {
        sortBy: '',
        sortDir: 1
    }
}

function getDefaultPaging() {
    return {
        maxPages: undefined,
        pageNumber: undefined
    }
}