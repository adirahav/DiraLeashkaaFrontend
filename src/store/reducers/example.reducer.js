export const DO_SOMETHING_ACTION = 'DO_SOMETHING_ACTION'

const initialState = {
    
}

export function exampleReducer(state = initialState, action = {}) {
    
    switch (action.type) {
        case DO_SOMETHING_ACTION:
            return state

        default:
            return state
    }
}