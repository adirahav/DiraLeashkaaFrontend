import { LOADING_START, LOADING_DONE, GET_MODAL_DATA } from "../reducers/app.reducer.js"
import { store } from "../store.js"

export function onLoadingStart() {
    try {
        store.dispatch({ type: LOADING_START })
    } catch(err) {
        console.error("Had issues start loading")
        throw err
    }
}


export function onLoadingDone() {
    try {
        store.dispatch({ type: LOADING_DONE })
    } catch(err) {
        console.error("Had issues done loading")
        throw err
    }
}

export function onToggleModal(modalData = null) {
    try {
        store.dispatch({
            type: GET_MODAL_DATA, 
            modalData
        })
    } catch(err) {
        console.error("Had issues loading modal data")
        throw err
    }
}

