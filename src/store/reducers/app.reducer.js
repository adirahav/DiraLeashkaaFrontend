export const LOADING_START = 'LOADING_START'
export const LOADING_DONE = 'LOADING_DONE'
export const GET_MODAL_DATA = 'GET_MODAL_DATA'
export const CHANGE_FONT_SIZE = 'CHANGE_FONT_SIZE'


const initialState = {
    modalData: null,
    isLoading: false,
    customeFontSize: null
}

export function appReducer(state = initialState, action = {}) {
    
    switch (action.type) {
        case LOADING_START:
            return { ...state, isLoading: true }
        
        case LOADING_DONE:
            return { ...state, isLoading: false }

        case CHANGE_FONT_SIZE:
            return { ...state, customeFontSize: action.fontSize }

        default:
            return state
    }
}