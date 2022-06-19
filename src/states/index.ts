import {configureStore} from "@reduxjs/toolkit";
import connectionReducer from "./connection"

const rootReducer = {
  //add more reducer later
  connection: connectionReducer,
}

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
})
export default store
export type AppState = ReturnType<typeof store.getState>