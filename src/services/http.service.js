import { Capacitor } from '@capacitor/core'
import Axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const BASE_URL = Capacitor.isNativePlatform()
    ? 'https://diraleashkaabackend.onrender.com/api/'
    : process.env.NODE_ENV === 'production'
        ? '/api/'
        : 'http://localhost:3032/api/'

var axios = Axios.create({
    withCredentials: true
})

export const httpService = {
    get(endpoint, data) {
        return ajax(endpoint, 'GET', data)
    },
    post(endpoint, data) {
        return ajax(endpoint, 'POST', data)
    },
    put(endpoint, data) {
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data)
    }
}

async function ajax(endpoint, method = 'GET', data = null) {
    data = {
        ...data,
        platform: "web",
    }

    try {
        console.log(`url=${BASE_URL}${endpoint}`)
        const res = await axios({
            url: `${BASE_URL}${endpoint}`,
            method,
            data,
            params: (method === 'GET') ? data : null
        })
        return res.data
    } catch (err) {
        console.error(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, data)
        console.dir(err)
        if (err.response && err.response.status === 401) {
            await AsyncStorage.clear()
            window.location.assign('/')
        }
        throw err
    }
}