import { Capacitor } from '@capacitor/core'
import Axios from 'axios'

const BASE_URL = Capacitor.isNativePlatform()
    ? 'https://diraleashkaa.onrender.com/api/'
    : import.meta.env.MODE === 'production'
        ? '/api/'
        : 'http://localhost:3032/api/'

var axios = Axios.create({
    withCredentials: true
})

export const httpService = {
    get(endpoint, data, token) {
        return ajax(endpoint, 'GET', data, token)
    },
    post(endpoint, data, token) {
        return ajax(endpoint, 'POST', data, token)
    },
    put(endpoint, data, token) {
        return ajax(endpoint, 'PUT', data, token)
    },
    delete(endpoint, data, token) {
        return ajax(endpoint, 'DELETE', data, token)
    }
}

async function ajax(endpoint, method = 'GET', data = null, token = null) {
    data = {
        ...data,
        platform: "web",
    }

    const jwt_token = token || localStorage.getItem("token") || sessionStorage.getItem("token")

    try {
        const res = await axios({
            url: `${BASE_URL}${endpoint}`,
            method,
            data,
            params: (method === 'GET') ? data : null,
            headers: jwt_token ? { Authorization: `Bearer ${jwt_token}` } : {},
        })
        return res.data
    } catch (err) {
        console.error(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, data)
        console.dir(err)
        if (err.response && err.response.status === 401) {
            sessionStorage.clear()
            localStorage.removeItem("token")
            window.location.assign('/')
        }
        throw err
    }
}