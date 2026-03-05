import { httpService } from "./http.service"

const BASE_URL = 'property/'

export const propertyService = {
    getById,
    save,
    archive
}

async function getById(propertyUUID, calcYields = false) {
    try {
        const property = await httpService.get(BASE_URL + propertyUUID + "?calcYields=" + calcYields)
        return property
    } catch(err) {
        console.error(`Had problems getting property ${propertyUUID}`)
        throw err
    }
}

async function save(propertyToSave) {
    propertyToSave.propertyUUID = propertyToSave.propertyUUID || ''
    const method = propertyToSave.propertyUUID ? 'put' : 'post'
    const savedProperty = await httpService[method](BASE_URL, propertyToSave)
    return savedProperty
}

async function archive(propertyUUID) {
    const data = { 
        "dataToReturn": "home"
    }
    const home = await httpService.patch(BASE_URL + `${propertyUUID}/archive`, data)
    return home
}
