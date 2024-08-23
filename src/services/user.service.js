import { httpService } from "./http.service"

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

const BASE_URL = 'user/'

export const userService = {
    getUsers,
    getById,
    remove,
    saveLocalUser,
    save,
    getLoggedinUser,
    getEmptyUser
}

async function getUsers() {
    try {
        const users = await httpService.get(BASE_URL)
        return users
    } catch(err) {
        console.log("Had problems getting users")
        throw err
    }
}

async function getById(userId) {
    try {
        const user= await httpService.get(BASE_URL + userId)
        return user
    } catch(err) {
        console.log(`Had problems getting user $userId}`)
        throw err
    }
}

async function remove(userId) {
    await httpService.delete(BASE_URL + userId)

    // await fetch({method: 'DELETE', url})
}

function saveLocalUser(user) {
    user = { _id: user._id, username: user.username, fullname: user.fullname, isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

async function save(userToSave) {
    userToSave._id = userToSave._id || ''

    const method = userToSave._id ? 'put' : 'post'
    const savedUser = await httpService[method](BASE_URL, userToSave)
    return savedUser
}


function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function getEmptyUser() {
    return {
        username: '',
        fullname: '',
        password: '',
        imgUrl: '',
        score: 0,
    }
}