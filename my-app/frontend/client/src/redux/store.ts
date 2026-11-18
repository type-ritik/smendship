import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  createTransform,
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import userReducer from "./user/userSlice";
import storage from "redux-persist/lib/storage";
import type { UserState } from "../utils/userInterfaces";

const rootReducer = combineReducers({
  user: userReducer,
});

// Bug fix: `loading` / `error` were persisted. Refreshing mid-login restored
// loading:true and the spinner never stopped. Reset them on rehydrate.
const resetTransientUserState = createTransform(
  (inbound: UserState) => inbound,
  (outbound: UserState) => ({ ...outbound, loading: false, error: "" }),
  { whitelist: ["user"] },
);

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  transforms: [resetTransientUserState],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Only silence the redux-persist actions instead of disabling the
      // check for the whole app.
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
