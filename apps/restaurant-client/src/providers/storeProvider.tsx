"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "reduxjs-toolkit-persist/integration/react";
import { AppStore, makeStore } from "@redux";

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore().store
  };

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={makeStore().persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default StoreProvider;