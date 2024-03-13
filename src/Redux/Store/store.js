import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { habitReducer } from "../Reducer/habitReducer";

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, habitReducer);

export const store = configureStore({
  reducer: {
    habitReducer: persistedReducer,
  },
});

export const persistor = persistStore(store);