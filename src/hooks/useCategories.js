import { serverTimestamp } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { addCategory, editCategory } from "../reducers/categorySlice";

const useCategories = () => {
  const dispatch = useDispatch();
  const add = ({ data }) => {
    dispatch(
      addCategory({ categoryName: data.category, createdAt: serverTimestamp() })
    );
  };
  const edit = ({ data, val }) => {
    const editValue = data.category;
    dispatch(editCategory({ val, editValue }));
  };
  return { add, edit };
};

export default useCategories;
