import { httpService } from "./http.service"

const BASE_URL = 'calculator/'

export const calculatorService = {
    getCalculators,
    getCalculator,
    getMaxPrice,
    updateMaxPrice,
    getCompare,
    saveCompare,
    resetCompare
}

// get list
async function getCalculators() {
    try {
        const calculators = await httpService.get(BASE_URL)
        return calculators
    } catch(err) {
        console.error(`Had problems getting calculators`)
        throw err
    }
}

// get calculator
async function getCalculator(calculatorUUID) {
    try {
        const calculator = await httpService.get(BASE_URL + calculatorUUID)
        return calculator
    } catch(err) {
        console.error(`Had problems getting calculator`)
        throw err
    }
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

async function saveCompare(currentComparedPropertiesUUIDs, checked, propertyUUID) {
    try {
        const updatedComparedPropertiesUUIDs = checked 
            ? !currentComparedPropertiesUUIDs.includes(propertyUUID)
                ? [...currentComparedPropertiesUUIDs, propertyUUID]
                : currentComparedPropertiesUUIDs
            : currentComparedPropertiesUUIDs.filter(id => id !== propertyUUID)
        
        const data = { 
            propertyUUIDs: updatedComparedPropertiesUUIDs
        }

        await httpService.put(BASE_URL + "compare", data)
        return updatedComparedPropertiesUUIDs
    } catch(err) {
        console.error("Had problems save compare")
        throw err
    }
}

async function resetCompare() {
    try {
        const updatedComparedPropertiesUUIDs = []
        
        const data = { 
            propertiesUUIDs: updatedComparedPropertiesUUIDs
        }

        await httpService.put(BASE_URL + "compare", data)
        return updatedComparedPropertiesUUIDs
    } catch(err) {
        console.error("Had problems reset compare")
        throw err
    }
}