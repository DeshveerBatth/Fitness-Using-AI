import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    erducer: {
        auth: aauthReducer
    }
})