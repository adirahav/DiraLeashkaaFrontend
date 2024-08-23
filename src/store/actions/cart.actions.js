/* STORE: [CART] STEP 4 */
import { ADD_TO_CART } from "../reducers/cart.reducer.js"
import { store } from "../store.js"

export function addToCart() {
    try {
        store.dispatch({type: ADD_TO_CART, cart: null})
    } catch(err) {
        console.log("Had issues loading users")
        throw err
    }
}