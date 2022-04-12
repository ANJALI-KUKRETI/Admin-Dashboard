import React, { useState } from "react";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../reducers/modalSlice";
import { addCategory, editCategory } from "../reducers/categorySlice";
import cross from "../assets/Vector.png";
import "./Form.css";
import { serverTimestamp } from "firebase/firestore";
import { useForm } from "react-hook-form";

const Form = ({ category }) => {
  const val = useSelector((state) => state.modal.value);

  const type = useSelector((state) => state.modal.type);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const closeModalHandler = () => {
    dispatch(closeModal());
  };

  const addCategoryHandler = (data) => {
    dispatch(
      addCategory({ categoryName: data.category, createdAt: serverTimestamp() })
    );
    dispatch(closeModal());
  };
  const editCategoryHandler = (data) => {
    console.log(data);
    const editValue = data.category;
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
        <form
          onSubmit={handleSubmit(
            type === "add" ? addCategoryHandler : editCategoryHandler
          )}
        >
          <div>
            <label>Category Name</label>
            {type === "add" ? (
              <input
                type="text"
                {...register("category", {
                  required: true,
                  pattern: /^[A-Za-z ]+$/i,
                })}
              />
            ) : (
              <input
                type="text"
                {...register("category", {
                  required: true,
                  pattern: /^[A-Za-z ]+$/i,
                })}
                defaultValue={val}
              />
            )}
            <div className="errors">
              {errors.category?.type === "required" && "Category is required!"}
              {errors.category?.type === "pattern" && "Enter a valid category!"}
            </div>
          </div>
        </form>
        <div className="btnsIn">
          <button className="cancel" onClick={closeModalHandler}>
            Cancel
          </button>
          <button
            className="save"
            onClick={handleSubmit(
              type === "add" ? addCategoryHandler : editCategoryHandler
            )}
          >
            {type === "add" ? "Save" : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Form;
