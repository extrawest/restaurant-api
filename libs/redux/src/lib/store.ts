import { setupListeners } from "@reduxjs/toolkit/query";
import defaultStorage from "reduxjs-toolkit-persist/lib/storage";
import { encryptTransform } from 'redux-persist-transform-encrypt';
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
  authSliceReducer,
  productsSlice,
  productsSliceReducer,
  usersSlice,
  usersSliceReducer,
} from "./slices";


const persistConfig = {
  key: "root",
  storage: defaultStorage,
  whitelist: [authSlice.name],
  transforms: [
    encryptTransform({
      secretKey: process.env.NEXT_PUBLIC_PERSIST_ENCRYPTION_SECRET_KEY || ""
    })
  ]
};
console.log(productsApi)
const rootReducer = combineReducers({
  [productsSlice.name]: productsSliceReducer,
  [authSlice.name]: authSliceReducer,
  [usersSlice.name]: usersSliceReducer,
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
      }).concat(
        productsApi.middleware,
        authApi.middleware,
        usersApi.middleware
      ),
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
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];