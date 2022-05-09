import { useDispatch } from "react-redux";
import {
  closeModal,
  showModal,
  showEditModal,
  showEditBlogModal,
  closeBlogModal,
  showBlogModal,
  showFilterModal,
  closeFilterModal,
} from "../reducers/modalSlice";
const useModal = () => {
  const dispatch = useDispatch();
  const close = () => {
    dispatch(closeModal());
  };
  const open = () => {
    dispatch(showModal());
  };
  const openEdit = (initial) => {
    dispatch(showEditModal(initial));
  };
  const closeBlog = () => {
    dispatch(closeBlogModal());
  };
  const openBlog = () => {
    dispatch(showBlogModal());
  };
  const openEditBlog = (initial) => {
    dispatch(showEditBlogModal(initial));
  };
  const openFilter = () => {
    dispatch(showFilterModal());
  };
  const closeFilter = () => {
    dispatch(closeFilterModal());
  };
  return {
    close,
    open,
    openEdit,
    closeBlog,
    openBlog,
    openEditBlog,
    openFilter,
    closeFilter,
  };
};

export default useModal;
