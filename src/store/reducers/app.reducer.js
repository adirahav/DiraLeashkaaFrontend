export const LOADING_START = 'LOADING_START'
export const LOADING_DONE = 'LOADING_DONE'
export const GET_MODAL_DATA = 'GET_MODAL_DATA'
export const CHANGE_FONT_SIZE = 'CHANGE_FONT_SIZE'
export const TOGGLE_ACCESSIBILITY_PANEL = 'TOGGLE_ACCESSIBILITY_PANEL'
export const STORAGE_KEY_CUSTOME_FONT_SIZE = "customeFontSize"
export const STORAGE_SHOW_ACCESSIBILITY_PANEL = "showAccessibilityPanel"

const BASE_FONT = 16

const storedShowAccessibilityPanel = localStorage.getItem(STORAGE_SHOW_ACCESSIBILITY_PANEL)

const initialState = {
    modalData: null,
    isLoading: false,
    accessibility: {
        customeFontSize: Number(localStorage.getItem(STORAGE_KEY_CUSTOME_FONT_SIZE)) || BASE_FONT,
        showAccessibilityPanel: storedShowAccessibilityPanel === null
                                    ? true   
                                    : storedShowAccessibilityPanel === 'true',
    }
    
}

export function appReducer(state = initialState, action = {}) {
    
    switch (action.type) {
        case LOADING_START:
            return { ...state, isLoading: true }
        
        case LOADING_DONE:
            return { ...state, isLoading: false }

        case CHANGE_FONT_SIZE:

            return { 
                ...state, 
                accessibility: {
                    ...state.accessibility,
                    customeFontSize: action.customeFontSize,
                }
            }

        case TOGGLE_ACCESSIBILITY_PANEL:
                return { 
                    ...state, 
                    accessibility: {
                        ...state.accessibility,
                        showAccessibilityPanel: action.showAccessibilityPanel
                    }
                }

        default:
            return state
    }
}