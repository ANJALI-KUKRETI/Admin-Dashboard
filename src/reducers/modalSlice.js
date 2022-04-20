import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modal: false,
  blogModal: false,
  type: "add",
  value: "",
  blogValue: "",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showModal: (state) => {
      state.modal = true;
      state.value = "";
      state.type = "add";
    },
    showBlogModal: (state) => {
      state.blogModal = true;
      state.type = "add";
    },
    closeModal: (state) => {
      state.modal = false;
    },
    closeBlogModal: (state) => {
      state.blogModal = false;
    },
    showEditModal: (state, { payload }) => {
      // console.log(payload);
      state.modal = true;
      state.value = payload;
      state.type = "edit";
    },
    showEditBlogModal: (state, { payload }) => {
      // console.log(payload);
      state.blogValue = payload;
      state.blogModal = true;
      state.type = "edit";
    },
  },
});

export const {
  showModal,
  closeModal,
  showEditModal,
  showBlogModal,
  closeBlogModal,
  showEditBlogModal,
} = modalSlice.actions;
export default modalSlice.reducer;
