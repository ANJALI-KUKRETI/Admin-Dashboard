import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modal: false,
  blogModal: false,
  filterModal: false,
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
    showFilterModal: (state) => {
      state.filterModal = true;
    },
    closeModal: (state) => {
      state.modal = false;
    },
    closeBlogModal: (state) => {
      state.blogModal = false;
    },
    closeFilterModal: (state) => {
      state.filterModal = false;
    },
    showEditModal: (state, { payload }) => {
      state.modal = true;
      state.value = payload;
      state.type = "edit";
    },
    showEditBlogModal: (state, { payload }) => {
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
  showFilterModal,
  closeFilterModal,
} = modalSlice.actions;
export default modalSlice.reducer;
