import { authService } from "../../services/auth.service.js"
import { userService } from "../../services/user.service.js"

export const LOGGEDIN_USER = 'LOGGEDIN_USER'
export const GET_HOME = "GET_HOME"
export const ABOUT_DELETE_PROPERTY = "ABOUT_DELETE_PROPERTY"
export const DELETING_PROPERTY_START = "DELETING_PROPERTY_START"
export const DELETING_PROPERTY_DONE = "DELETING_PROPERTY_DONE"
export const LONG_PRESSED_PROPERTY = "LONG_PRESSED_PROPERTY"
export const UPDATE_USER = 'UPDATE_USER'
export const DELETE_USER = 'DELETE_USER'
export const SIGNUP = 'SIGNUP'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

const initialState = {
    home: {
        properties: null,
        bestYields: null,
        isPropertiesNeedToRefresh: true,
        isBestYieldsNeedToRefresh: true,
        aboutDeleteId: null,
        isDeleting: false,
        longPressedId: null
    },
    loggedinUser: authService.getLoggedinUser()
}

export function userReducer(state = initialState, action = {}) {
    switch (action.type) {
        case LOGGEDIN_USER:
        case LOGIN:
            return {
                ...state,
                loggedinUser: action.loggedinUser
            }
        case GET_HOME:
            return {
                ...state,
                home: {
                    ...state.home,
                    properties: action.home?.properties,
                    bestYields: action.home?.bestYields,
                    isPropertiesNeedToRefresh: action.home?.isPropertiesNeedToRefresh,
                    isBestYieldsNeedToRefresh: action.home?.isBestYieldsNeedToRefresh,
                }
            }
        case ABOUT_DELETE_PROPERTY:
            return {
                ...state,
                home: {
                    ...state.home,
                    aboutDeleteId: action.propertyId
                }
            }
        case DELETING_PROPERTY_START:
            return {
                ...state,
                home: {
                    ...state.home,
                    isDeleting: true
                }
            }
        case DELETING_PROPERTY_DONE:
            return {
                ...state,
                home: {
                    ...state.home,
                    isDeleting: false
                }
            }
        case LONG_PRESSED_PROPERTY:
            return {
                ...state,
                home: {
                    ...state.home,
                    longPressed: action.propertyId
                }
            }

        case UPDATE_USER:
            userService.saveLocalUser(action.savedUser)
            return {
                ...state,
                loggedinUser: action.savedUser
            }
        
        case DELETE_USER:
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.userId),
            }

        case SIGNUP:
            userService.saveLocalUser(action.signupUser)
            return {
                ...state,
                loggedinUser: action.signupUser
            }

        case LOGOUT:
            return {
                ...state,
                loggedinUser: null
            }    

        default:
            return state
    }
}