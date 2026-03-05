import { authService } from "../../services/auth.service.js"
import { userService } from "../../services/user.service.js"
import { LOGGEDIN_USER, 
    GET_HOME, 
    GET_COMPARE, SAVE_COMPARE,
    ABOUT_DELETE_PROPERTY, DELETING_PROPERTY_START, DELETING_PROPERTY_DONE, 
    ABOUT_ACTION_PROPERTY, ACTING_PROPERTY_START, ACTING_PROPERTY_DONE,
    LONG_PRESSED_PROPERTY,
    UPDATE_USER, DELETE_USER, SIGNUP, LOGIN, LOGOUT } from "../reducers/user.reducer.js"
import { LOADING_DONE, LOADING_START } from "../reducers/app.reducer.js"
import { store } from "../store.js"
import { propertyService } from "../../services/property.service.js"
import { calculatorService } from "../../services/calculator.service.js"

export function setLoggedinUser(loggedinUser) {
    try {
        store.dispatch({type: LOGGEDIN_USER, loggedinUser})
    } catch(err) {
        console.error("Had issues loggedin user")
        throw err
    }
}

export async function getHome(fullData) {
    try {
        //store.dispatch({ type: LOADING_START })
        const home = await userService.home(fullData) 
        store.dispatch({type: GET_HOME, home})
    } catch(err) {
        console.error("Had issues loading home data")
        throw err
    } finally {
        //store.dispatch({ type: LOADING_DONE })
    }
}

export function saveHome(home) {
    try {
        store.dispatch({type: GET_HOME, home})
    } catch(err) {
        console.error("Had issues save home data")
        throw err
    } 
}

export async function getCompare() {
    try {
        //store.dispatch({ type: LOADING_START })
        const compare = await calculatorService.getCompare() 
        store.dispatch({type: GET_COMPARE, compare})
    } catch(err) {
        console.error("Had issues loading compare data")
        throw err
    } finally {
        //store.dispatch({ type: LOADING_DONE })
    }
}

export async function saveCompare(checked, propertyUUID) {
    try {
        store.dispatch({ type: LOADING_START })
        
        const state = store.getState()
        const currentComparedPropertiesUUIDs = state.userModule.compare?.comparedPropertiesUUIDs || []

        const updatedComparedPropertiesUUIDs = await calculatorService.saveCompare(currentComparedPropertiesUUIDs, checked, propertyUUID) 
        store.dispatch({type: SAVE_COMPARE, updatedComparedPropertiesUUIDs})

    } catch(err) {
        console.error("Had issues saving compare data")
        throw err
    } finally {
        store.dispatch({ type: LOADING_DONE })
    }
}

export async function resetCompare() {
    try {
        store.dispatch({ type: LOADING_START })
        const updatedComparedPropertiesUUIDs = await calculatorService.resetCompare() 
        store.dispatch({type: SAVE_COMPARE, updatedComparedPropertiesUUIDs})

    } catch(err) {
        console.error("Had issues reseting compare data")
        throw err
    } finally {
        store.dispatch({ type: LOADING_DONE })
    }
}

export async function onDeleteProperty(propertyUUID) {
    try {
        const home = await propertyService.archive(propertyUUID)
        store.dispatch({type: GET_HOME, home})
    } catch(err) {
        console.error("Had issues delete property")
        throw err
    }
}

export function onAboutDeletingProperty(propertyUUID) {
    try {
        store.dispatch({ type: ABOUT_DELETE_PROPERTY, propertyUUID })
    } catch(err) {
        console.error("Had issues start deleting property")
        throw err
    }
}

export function onDeletingPropertyStart() {
    try {
        store.dispatch({ type: DELETING_PROPERTY_START })
    } catch(err) {
        console.error("Had issues start deleting property")
        throw err
    }
}

export function onDeletingPropertyDone() {
    try {
        store.dispatch({ type: DELETING_PROPERTY_DONE })
    } catch(err) {
        console.error("Had issues done deleting property")
        throw err
    }
}

/**/
export async function onActionProperty(propertyUUID) {
    try {
        const home = await propertyService.archive(propertyUUID)
        store.dispatch({type: GET_HOME, home})
    } catch(err) {
        console.error("Had issues action property")
        throw err
    }
}

export function onAboutActingProperty(propertyUUID) {
    try {
        store.dispatch({ type: ABOUT_ACTION_PROPERTY, propertyUUID })
    } catch(err) {
        console.error("Had issues start acting property")
        throw err
    }
}

export function onActingPropertyStart() {
    try {
        store.dispatch({ type: ACTING_PROPERTY_START })
    } catch(err) {
        console.error("Had issues start acting property")
        throw err
    }
}

export function onActingPropertyDone() {
    try {
        store.dispatch({ type: ACTING_PROPERTY_DONE })
    } catch(err) {
        console.error("Had issues done acting property")
        throw err
    }
}

export function onLongPressProperty(propertyUUID) {
    try {
        store.dispatch({ type: LONG_PRESSED_PROPERTY, propertyUUID })
    } catch(err) {
        console.error("Had issues long press property")
        throw err
    }
}

export async function updateUser(userToSave) {
    try {   
        const savedUser = await userService.save(userToSave)
        store.dispatch({type: UPDATE_USER, savedUser})
    } catch(err) {
        console.error("Had issues updating user")
        throw err
    }
}

export async function removeUser(userId) {
    try {   
        await userService.remove(userId)
        store.dispatch({type: DELETE_USER, userId})
    } catch(err) {
        console.error("Had issues removing user")
        throw err
    }
}

export async function signup(credentials) {
    try { 
        const signupUser = await authService.signup(credentials)
        store.dispatch({type: SIGNUP, signupUser})
    } catch(err) {
        console.error(`User had issues signup`)
        throw err
    }
}

export async function login(email, password) {
    try { 
        const loggedinUser = await authService.login(email, password)
        store.dispatch({type: LOGIN, loggedinUser})
    } catch(err) {
        console.error(`${email} had issues login`)
        throw err
    }
}

export async function logout() {
    try {   
        await authService.logout()
        store.dispatch({type: LOGOUT})
    } catch(err) {
        console.error("Had issues logged out user")
        throw err
    }
}