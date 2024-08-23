/* STORE: [CART] STEP 5 */
export const ADD_TO_CART = 'ADD_TO_CART'

const initialState = {
    cart: {
        count: 0,
    }
}

export function cartReducer(state = initialState, action = {}) {
    
    switch (action.type) {
        case ADD_TO_CART:
            const { cart } = state
            return {
                ...state,
                cart: { ...cart, count: cart.count+1 }
            }

        default:
            return state
    }
}