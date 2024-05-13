"use client";
import { setupListeners } from "@reduxjs/toolkit/query";
import defaultStorage from "reduxjs-toolkit-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import createIdbStorage from "@piotr-cz/redux-persist-idb-storage/src";
import { persistStore, persistReducer } from "reduxjs-toolkit-persist";
import { authApi, productsApi, usersApi } from "./apis";
import { authSlice, productsSlice, usersSlice} from "./slices";

const persistConfig = {
  key: "root",
  storage: globalThis.indexedDB ? createIdbStorage({ name: 'restaurant-client-db', storeName: 'storage' }) : defaultStorage,
  whitelist: [authSlice.name],
};

const rootReducer = combineReducers({
  [productsApi.reducerPath]: productsApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [productsSlice.name]: productsSlice,
  [authSlice.name]: authSlice,
  [usersSlice.name]: usersSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsApi.middleware, authApi.middleware),
    devTools: process.env.NODE_ENV !== 'production'
  });

  const persistor = persistStore(store);
  
  return {
    store,
    persistor
  };
};

setupListeners(makeStore().store.dispatch);

export type AppStore = ReturnType<typeof makeStore>["store"];
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];