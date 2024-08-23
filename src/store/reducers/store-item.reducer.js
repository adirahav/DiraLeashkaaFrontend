export const SET_ITEMS = 'SET_ITEMS'
export const ADD_ITEM = 'ADD_ITEM'
export const UPDATE_ITEM = 'UPDATE_ITEM'
export const DELETE_ITEM = 'DELETE_ITEM'

const initialState = {
    paging: null,
    list: null
}

export function itemReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ITEMS:
            return { ...state, paging: action.items.paging, list: action.items.list }
        case DELETE_ITEM:
            return { ...state, list: state.list.filter(item => item._id !== action.itemId)}
        case ADD_ITEM:
            return { ...state, list: [...state.list, action.savedItem] }
        case UPDATE_ITEM:
            return { ...state, list: state.list.map(item => (item._id === action.savedItem._id) ? action.savedItem : item) }
        default:
            return state
    }
}
