/* STORE: [USER] STEP 5 */
import { userService } from "../../services/user.service.js"

export const LOGGEDIN_USER = 'LOGGEDIN_USER'
export const GET_USERS = 'GET_USERS'
export const UPDATE_USER = 'UPDATE_USER'
export const DELETE_USER = 'DELETE_USER'
export const SIGNUP = 'SIGNUP'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

const initialState = {
    users: null,
    loggedinUser: userService.getLoggedinUser()
}

export function userReducer(state = initialState, action = {}) {
    switch (action.type) {
        case LOGGEDIN_USER:
        case LOGIN:
            return {
                ...state,
                loggedinUser: action.loggedinUser
            }
        case GET_USERS:
            return {
                ...state,
                users: action.users
            }

        case UPDATE_USER:
            return {
                ...state,
                users: state.users.map((currUser) => currUser._id === action.userToSave._id ? action.userToSave : currUser),
            }
        
        case DELETE_USER:
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.userId),
            }

        case SIGNUP:
            return {
                ...state,
                users: state.users.concat(action.signupUser),
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