export const GET_MODAL_DATA = 'GET_MODAL_DATA'
export const GET_USERS = 'GET_USERS'
export const ADD_USER = 'ADD_USER'
export const UPDATE_USER = 'UPDATE_USER'
export const DELETE_USER = 'DELETE_USER'

const initialState = {
    users: null,
    modalData: null
}

export function appReducer(state = initialState, action = {}) {
    
    switch (action.type) {
        case GET_MODAL_DATA:
            return {
                ...state,
                modalData: action.modalData
            }

        /*******************************************************/

        case ADD_USER:
            return {
                ...state,
                users: [...state.users, action.user]
            }

        case UPDATE_USER:
            return {
                ...state,
                users: state.users.map(user => user.id === action.user.id ? action.user : user)
            }

        case DELETE_USER:
            return {
                ...state,
                users: state.users.filter(user => user.id !== action.userID),
                lastUsers: [...state.users]
            }

        default:
            return state
    }
}