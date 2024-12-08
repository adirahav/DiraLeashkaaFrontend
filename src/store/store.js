import { combineReducers, legacy_createStore as createStore, compose } from 'redux'
import { appReducer } from './reducers/app.reducer'
import { userReducer } from './reducers/user.reducer'   

const rootReducer = combineReducers({
    appModule: appReducer,
    userModule: userReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose // use for devtools

export const store = createStore(rootReducer, composeEnhancers())

window.gStore = store  // FOR DEBUGGING ONLY