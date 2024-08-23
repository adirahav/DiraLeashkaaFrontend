
import { httpService } from './http.service'

const BASE_URL = 'coockie/'

export const coockieService = {
    getCounter
}

async function getCounter() {
    const coockieData = {
        name: "counter"
    }

    try {
        const counter = await httpService.put(BASE_URL, coockieData)
        return counter
    } catch(err) {
        console.log(`Had problems get counter`)
        throw err
    }
}
