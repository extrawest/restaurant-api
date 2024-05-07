"use client";
import { configureStore } from "@reduxjs/toolkit";
import { productsApi } from "./apis";
import { setupListeners } from "@reduxjs/toolkit/query";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [productsApi.reducerPath]: productsApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsApi.middleware),
  })
};

setupListeners(makeStore().dispatch);

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];