import {configureStore} from "@reduxjs/toolkit";
import {thunk} from "redux-thunk";
import { APP_ENV } from "../../../env";
import  basketSlice from "./redusers/BasketReduser"

export const store = configureStore({
    reducer: {
      backetStore: basketSlice
    },
    devTools: APP_ENV.APP_MODE !== 'release',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;