import { httpService } from "./http.service"

const BASE_URL = 'property/'

export const propertyService = {
    getById,
    save,
    archive
}

async function getById(propertyId, calcYields = false) {
    try {
        const property = await httpService.get(BASE_URL + propertyId + "?calcYields=" + calcYields)
        return property
    } catch(err) {
        console.error(`Had problems getting property ${propertyId}`)
        throw err
    }
}

async function save(propertyToSave) {
    propertyToSave.propertyId = propertyToSave.propertyId || ''
    const method = propertyToSave.propertyId ? 'put' : 'post'
    const savedProperty = await httpService[method](BASE_URL, propertyToSave)
    return savedProperty
}

async function archive(propertyId) {
    const data = { 
        "dataToReturn": "home"
    }
    const home = await httpService.put(BASE_URL + `${propertyId}/archive`, data)
    return home
}
