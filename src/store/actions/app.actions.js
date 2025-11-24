import { utilService } from "../../services/util.service.js"
import { LOADING_START, LOADING_DONE, GET_MODAL_DATA, CHANGE_FONT_SIZE, TOGGLE_ACCESSIBILITY_PANEL, STORAGE_KEY_CUSTOME_FONT_SIZE, STORAGE_SHOW_ACCESSIBILITY_PANEL } from "../reducers/app.reducer.js"
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

export async function onChangeFontSize(customeFontSize = null) {
    await utilService.getFromStorage(STORAGE_KEY_CUSTOME_FONT_SIZE, customeFontSize)
    
    try {
        store.dispatch({
            type: CHANGE_FONT_SIZE, 
            customeFontSize
        })
    } catch(err) {
        console.error("Had issues change font size")
        throw err
    }
}

export async function onToggleAccessibilityPanel(showAccessibilityPanel) {
    await utilService.getFromStorage(STORAGE_SHOW_ACCESSIBILITY_PANEL, showAccessibilityPanel)
    
    try {
        store.dispatch({
            type: TOGGLE_ACCESSIBILITY_PANEL, 
            showAccessibilityPanel
        })
    } catch(err) {
        console.error("Had issues togglt accessibility panel")
        throw err
    }
}