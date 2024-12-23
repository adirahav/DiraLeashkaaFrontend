import { httpService } from "./http.service"

const BASE_URL = 'calculator/'

export const calculatorService = {
    getMaxPrice,
    updateMaxPrice
}

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
