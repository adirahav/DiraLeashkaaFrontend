import { DO_SOMETHING_ACTION } from "../reducers/example.reducer.js"
import { LOADING_START, LOADING_DONE } from "../reducers/system.reducer.js"
import { store } from "../store.js"

export async function awaitExample() {
    try {
        store.dispatch({ type: LOADING_START })
        await delay(2000)
        store.dispatch({ type: DO_SOMETHING_ACTION })
        
    } catch (err) {
        console.log(err)
    } finally {
        store.dispatch({ type: LOADING_DONE })
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}