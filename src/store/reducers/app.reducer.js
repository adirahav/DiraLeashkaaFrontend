export const LOADING_START = 'LOADING_START'
export const LOADING_DONE = 'LOADING_DONE'
export const  GET_MODAL_DATA = 'GET_MODAL_DATA'

const initialState = {
    modalData: null,
    isLoading: false
}

export function appReducer(state = initialState, action = {}) {
    
    switch (action.type) {
        case LOADING_START:
            return { ...state, isLoading: true }
        
        case LOADING_DONE:
            return { ...state, isLoading: false }

        default:
            return state
    }
}