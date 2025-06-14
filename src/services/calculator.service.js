import { httpService } from "./http.service"

const BASE_URL = 'calculator/'

export const calculatorService = {
    getMaxPrice,
    updateMaxPrice,
    getCompare,
    saveCompare,
    resetCompare
}

// max price
async function getMaxPrice() {
    try {
        const property = await httpService.get(BASE_URL + "maxPrice")
        return property
    } catch(err) {
        console.error(`Had problems getting maxPrice calculator`)
        throw err
    }
}

async function updateMaxPrice(fieldName, fieldValue) {
    try {
        const data = { 
            fieldName,
            fieldValue
        }
        
        const property = await httpService.put(BASE_URL + "maxPrice", data)
        return property 
    } catch(err) {
        console.error(`Had problems update maxPrice calculator`)
        throw err
    }
}

// compare
async function getCompare() {
    try {
        const compare = await httpService.get(BASE_URL + "compare")
        return compare
    } catch(err) {
        console.error("Had problems getting compare")
        throw err
    }
}

async function saveCompare(currentComparedPropertyIds, checked, propertyId) {
    try {
        const updatedComparedPropertyIds = checked 
            ? !currentComparedPropertyIds.includes(propertyId)
                ? [...currentComparedPropertyIds, propertyId]
                : currentComparedPropertyIds
            : currentComparedPropertyIds.filter(id => id !== propertyId)
        
        const data = { 
            propertiesIds: updatedComparedPropertyIds
        }

        await httpService.put(BASE_URL + "compare", data)
        return updatedComparedPropertyIds
    } catch(err) {
        console.error("Had problems save compare")
        throw err
    }
}

async function resetCompare() {
    try {
        const updatedComparedPropertyIds = []
        
        const data = { 
            propertiesIds: updatedComparedPropertyIds
        }

        await httpService.put(BASE_URL + "compare", data)
        return updatedComparedPropertyIds
    } catch(err) {
        console.error("Had problems reset compare")
        throw err
    }
}