// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { habitReducer } from "../Reducer/habitReducer";

const persistConfig = {
  key: 'root', // adjust this key as needed
  storage,
  // Optionally, you can specify an array of reducer names to persist
  // whitelist: ['habitReducer'],
};

const persistedReducer = persistReducer(persistConfig, habitReducer);

export const store = configureStore({
  reducer: {
    habitReducer: persistedReducer,
  },
});

export const persistor = persistStore(store);
