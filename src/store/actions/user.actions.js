/* STORE: [USER] STEP 4 */
import { authService } from "../../services/auth.service.js"
import { userService } from "../../services/user.service.js"
import { LOGGEDIN_USER, GET_USERS, UPDATE_USER, DELETE_USER, SIGNUP, LOGIN, LOGOUT } from "../reducers/user.reducer.js"
import { store } from "../store.js"

export function setLoggedinUser(loggedinUser) {
    try {
        store.dispatch({type: LOGGEDIN_USER, loggedinUser})
    } catch(err) {
        console.log("Had issues loggedin user")
        throw err
    }
}

export async function loadUsers() {
    try {
        const users = await userService.getUsers()    
        store.dispatch({type: GET_USERS, users})
    } catch(err) {
        console.log("Had issues loading users")
        throw err
    }
}

export async function updateUser(userToSave) {
    try {   
        const savedUser = await userService.save(userToSave)
        console.log('Updated User:', savedUser)
        store.dispatch({type: UPDATE_USER, userToSave})
    } catch(err) {
        console.log("Had issues updating user")
        throw err
    }
}

export async function removeUser(userId) {
    try {   
        await userService.remove(userId)
        console.log('Deleted Succesfully!')
        store.dispatch({type: DELETE_USER, userId})
    } catch(err) {
        console.log("Had issues removing user")
        throw err
    }
}

export async function signup(credentials) {
    try { 
        const signupUser = await authService.signup(credentials)
        console.log(`${signupUser.fullname} signup succesfully!`)
        store.dispatch({type: SIGNUP, signupUser})
    } catch(err) {
        console.log(`User had issues signup`)
        throw err
    }
}

export async function login(credentials) {
    try { 
        
        const loggedinUser = await authService.login(credentials)
        console.log(`${loggedinUser.fullname} loggedin succesfully!`)
        store.dispatch({type: LOGIN, loggedinUser})
    } catch(err) {
        console.log(`${credentials.fullname} had issues login`)
        throw err
    }
}

export async function logout() {
    try {   
        await authService.logout()
        console.log(`User logged out succesfully!`)
        store.dispatch({type: LOGOUT})
    } catch(err) {
        console.log("Had issues logged out user")
        throw err
    }
}