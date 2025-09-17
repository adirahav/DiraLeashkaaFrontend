import { LOADING_START, LOADING_DONE, GET_MODAL_DATA, CHANGE_FONT_SIZE } from "../reducers/app.reducer.js"
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
            type: CHANGE_FONT_SIZE, 
            modalData
        })
    } catch(err) {
        console.error("Had issues loading modal data")
        throw err
    }
}

export function onChangeFontSize(customeFontSize = null) {
    try {
        store.dispatch({
            type: GET_MODAL_DATA, 
            customeFontSize
        })
    } catch(err) {
        console.error("Had issues change font size")
        throw err
    }
}
