import {configureStore} from "@reduxjs/toolkit";
import rocketReducer from "./rocketSlice";

export const store = configureStore({
    reducer: {
        rocket: rocketReducer
    }
});
