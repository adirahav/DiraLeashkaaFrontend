import { combineReducers, legacy_createStore as createStore, compose } from 'redux'
import { appReducer } from './reducers/app.reducer'
import { userReducer } from './reducers/user.reducer'   /* STORE: [USER] STEP 6 */
import { cartReducer } from './reducers/cart.reducer'   /* STORE: [CART] STEP 6 */
import { systemReducer } from './reducers/system.reducer'
import { exampleReducer } from './reducers/example.reducer'
import { itemReducer } from './reducers/store-item.reducer'


const rootReducer = combineReducers({
    appModule: appReducer,
    userModule: userReducer,         /* STORE: [USER] STEP 7 */
    cartModule: cartReducer,         /* STORE: [CART] STEP 7 */
    itemsModule: itemReducer,
    systemModule: systemReducer,
    exampleModule: exampleReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose // use for devtools

export const store = createStore(rootReducer, composeEnhancers())

window.gStore = store  // FOR DEBUGGING ONLY