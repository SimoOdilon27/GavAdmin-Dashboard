import { createStore, combineReducers } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import redoxStorage from './Reducers/UsersReducers'


const cooperReducer = combineReducers({
    users: redoxStorage,
    // params: params,
})

const persistConfig = {
    key: 'root',
    storage: storage,
}



const reduxDevtools = window.__REDUX_DEVTOOLS_EXTENSION___ && window.__REDUX_DEVTOOLS_EXTENSION___()
const persistedReducer = persistReducer(persistConfig, cooperReducer)



export const store = createStore(persistedReducer, reduxDevtools)
export const persitor = persistStore(store)
