import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modal: false,
  type: "add",
  value: "",
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
    closeModal: (state) => {
      state.modal = false;
    },
    showEditModal: (state, { payload }) => {
      // console.log(payload);
      state.modal = true;
      state.value = payload;
      state.type = "edit";
    },
  },
});

export const { showModal, closeModal, showEditModal } = modalSlice.actions;
export default modalSlice.reducer;
