// "use client";
import { setupListeners } from "@reduxjs/toolkit/query";
import defaultStorage from "reduxjs-toolkit-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "reduxjs-toolkit-persist";
import {
  authApi,
  productsApi,
  usersApi
} from "./apis";
import {
  authSlice,
  productsSlice,
  usersSlice
} from "./slices";

const persistConfig = {
  key: "root",
  storage: defaultStorage,
  whitelist: [authSlice.name],
};

const rootReducer = combineReducers({
  [productsSlice.name]: productsSlice,
  [authSlice.name]: authSlice,
  [usersSlice.name]: usersSlice,
  [productsApi.reducerPath]: productsApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            FLUSH,
            REHYDRATE,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER
          ],
        }
      }).concat(productsApi.middleware, authApi.middleware, usersApi.middleware),
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