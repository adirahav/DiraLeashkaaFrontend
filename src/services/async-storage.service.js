export const storageService = {
    query,
    get,
    post,
    put,
    putList,
    remove,
}

function query(entityType, delay = 200) {
    const entities = JSON.parse(localStorage.getItem(entityType)) || []
    return new Promise(resolve => setTimeout(() => resolve(entities), delay))
}

async function get(entityType, entityId) {
    const entities = await query(entityType)
    const entity = entities.find(entity_1 => entity_1.id === entityId)
    if (!entity) throw new Error(`Get failed, cannot find entity with id: ${entityId} in: ${entityType}`)
    return entity
}

async function post(entityType, newEntity) {
    newEntity = { ...newEntity }
    newEntity.id = _makeId()
    const entities = await query(entityType)
    entities.push(newEntity)
    _save(entityType, entities)
    return newEntity
}

async function put(entityType, updatedEntity) {
    const entities = await query(entityType)
    const idx = entities.findIndex(entity => entity.id === updatedEntity.id)
    if (idx < 0) throw new Error(`Update failed, cannot find entity with id: ${updatedEntity.id} in: ${entityType}`)
    entities.splice(idx, 1, updatedEntity)
    _save(entityType, entities)
    return updatedEntity
}

async function putList(entityType, updatedEntities) {
    const entities = await query(entityType)

    updatedEntities.forEach(updatedEntity => {
        const idx = entities.findIndex(entity => entity.id === updatedEntity.id)
        if (idx >= 0) {
            entities.splice(idx, 1, updatedEntity)
        } else {
            console.warn(`Entity with id ${updatedEntity.id} not found in: ${entityType}`)
        }
    })

    _save(entityType, entities)
    return updatedEntities
}

async function remove(entityType, entityId) {
    const entities = await query(entityType)
    const idx = entities.findIndex(entity => entity.id === entityId)
    if (idx < 0) throw new Error(`Remove failed, cannot find entity with id: ${entityId} in: ${entityType}`)
    entities.splice(idx, 1)
    _save(entityType, entities)
}

async function paging(entityType, page, itemsPerPage) {
    try {
        var entities = await query(entityType)

        const startIndex = (page - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const pagedEntities = entities.slice(startIndex, endIndex)
        
        const result = {
            pagedEntities,
            totalEntities: entities.length
        }
        return result
        
    } catch(err) {
        throw new Error(err)
    }
    
}

async function sort(entityType, order, pagination) {
    var entities = await query(entityType)
    
    entities.sort((a, b) => {
        if (order.direction === 'asc') {
            return eval("a." + order.fieldName) < eval("b." + order.fieldName) ? -1 : 1
        } 
        else if (order.direction === 'desc') {
            return eval("a." + order.fieldName) > eval("b." + order.fieldName) ? -1 : 1
        }
    })

    _save(entityType, entities)
    
    return paging(entityType, pagination.pageNumber, pagination.itemsPerPage)
}

async function group(entityType, fieldName) {
    var entities = await query(entityType)
    
    const groupedEntities = entities.reduce((result, entity) => {
        const key = eval("entity." + fieldName)
        if (!result[key]) {
            result[key] = []
        }
        result[key].push(entity)
        return result
    }, {})

    return groupedEntities
}

// Private functions
function _save(entityType, entities) {
    localStorage.setItem(entityType, JSON.stringify(entities))
}

function _makeId(length = 5) {
    var text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}