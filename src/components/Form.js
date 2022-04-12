import React, { useState } from "react";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../reducers/modalSlice";
import { addCategory, editCategory } from "../reducers/categorySlice";
import cross from "../assets/Vector.png";
import "./Form.css";
import { serverTimestamp } from "firebase/firestore";

const Form = ({ category }) => {
  const [text, setText] = useState("");
  const val = useSelector((state) => state.modal.value);
  const error = useSelector((state) => state.categories.error);
  const [editValue, setEditValue] = useState(val);
  const type = useSelector((state) => state.modal.type);

  const dispatch = useDispatch();
  const closeModalHandler = () => {
    dispatch(closeModal());
  };

  const addCategoryHandler = () => {
    dispatch(addCategory({ categoryName: text, createdAt: serverTimestamp() }));
    dispatch(closeModal());
  };
  const editCategoryHandler = () => {
    dispatch(editCategory({ category, editValue }));
    dispatch(closeModal());
  };

  return (
    <Modal>
      <div className="cross" onClick={closeModalHandler}>
        <img src={cross} alt="cross" />
      </div>
      <div className="container">
        <div className="heading">Add Category</div>
        <form>
          <label>Category Name</label>
          {type === "add" ? (
            <input
              type="text"
              name="name"
              onChange={(event) => setText(event.target.value)}
              defaultValue={text}
            />
          ) : (
            <input
              type="text"
              name="name"
              onChange={(event) => setEditValue(event.target.value)}
              defaultValue={editValue}
            />
          )}
        </form>
        {error}
        <div className="btnsIn">
          <button className="cancel" onClick={closeModalHandler}>
            Cancel
          </button>
          <button
            className="save"
            onClick={type === "add" ? addCategoryHandler : editCategoryHandler}
          >
            {type === "add" ? "Save" : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Form;
