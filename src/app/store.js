import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "../reducers/modalSlice";
import categoryReducer from "../reducers/categorySlice";
import blogsReducer from "../reducers/blogsSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    categories: categoryReducer,
    blogs: blogsReducer,
  },
  middleware: (middleware) =>
    middleware({
      serializableCheck: false,
    }),
});
