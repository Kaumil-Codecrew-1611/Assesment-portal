import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./slices/authSlice";

const persistconfig = {
    key: "root",
    version: 1,
    storage,
};

const reducer = combineReducers({
    user: authSlice,
});
const persistedReducer = persistReducer(persistconfig, reducer);

const Store = configureStore({
    reducer: persistedReducer,
});


export default Store;
