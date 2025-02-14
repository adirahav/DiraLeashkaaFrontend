import { STORAGE_KEY_LAST_LOGGEDIN_EMAIL, STORAGE_KEY_LOGGEDIN_USER } from "./auth.service"
import { httpService } from "./http.service"

const BASE_URL = 'user/'

export const userService = {
    splash,
    home,
    getUsers,
    getById,
    remove,
    saveLocalUser,
    save,
    getEmptyUser
}

async function splash() {
    try {
        const splash = await httpService.get(BASE_URL + "splash?platform=web")
        
        delete splash.fixedParameters.vatPercent
        delete splash.fixedParameters.sms
        delete splash.fixedParameters.picture
        delete splash.fixedParameters.onError
        delete splash.fixedParameters.trialPeriod
        delete splash.fixedParameters.expirationAlert
        delete splash.fixedParameters.appVersion
        delete splash.calculators?._id

        return splash
    } catch(err) {
        console.error("Had problems getting splash")
        throw err
    }
}

async function home(fullData) {
    try {
        const home = await httpService.get(BASE_URL + "home?fullData=" + fullData)
        return home
    } catch(err) {
        console.error("Had problems getting home")
        throw err
    }
}

async function getUsers() {
    try {
        const users = await httpService.get(BASE_URL)
        return users
    } catch(err) {
        console.error("Had problems getting users")
        throw err
    }
}

async function getById(userId) {
    try {
        const user = await httpService.get(BASE_URL + userId)
        return user
    } catch(err) {
        console.error(`Had problems getting user $userId}`)
        throw err
    }
}

async function remove(userId) {
    await httpService.delete(BASE_URL + userId)

    // await fetch({method: 'DELETE', url})
}

function saveLocalUser(user) {
    user = { 
        email: user.email, 
        fullname: user.fullname, 
        yearOfBirth: user.yearOfBirth,
        calcAge: user.calcAge,
        calcCanTakeMortgage: user.calcCanTakeMortgage,
        equity: user.equity,
        incomes: user.incomes,
        commitments: user.commitments,
        termsOfUseAccept: user.termsOfUseAccept,
        subscriberType: user.subscriberType,
        registrationExpiredTime: user.registrationExpiredTime,
    }

    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    localStorage.removeItem(STORAGE_KEY_LAST_LOGGEDIN_EMAIL)
    return user
}

async function save(userToSave) {
    const savedUser = await httpService.put(BASE_URL, userToSave)
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(savedUser))
    return savedUser
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