import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "../reducers/modalSlice";
import categoryReducer from "../reducers/categorySlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    categories: categoryReducer,
  },
  middleware: (middleware) =>
    middleware({
      serializableCheck: false,
    }),
});
