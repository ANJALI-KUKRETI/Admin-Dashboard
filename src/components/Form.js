import React, { useState } from "react";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../reducers/modalSlice";
import { addCategory, editCategory } from "../reducers/categorySlice";
import cross from "../assets/Vector.png";
import "./Form.css";
import { serverTimestamp } from "firebase/firestore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const schema = yup
  .object()
  .shape({
    category: yup
      .string()
      .matches(/^[a-zA-Z\s]*$/g, "Enter a valid Category!(must be a string)")
      .required("This field is required!"),
  })

  .required();

const Form = () => {
  const val = useSelector((state) => state.modal.value);

  const type = useSelector((state) => state.modal.type);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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
    const editValue = data.category;
    dispatch(editCategory({ val, editValue }));
    dispatch(closeModal());
  };

  return (
    <Modal>
      <div className="cross" onClick={closeModalHandler}>
        <img src={cross} alt="cross" />
      </div>
      <div className="container">
        <div className="heading">Add Category</div>
        <form className="form"
          onSubmit={handleSubmit(
            type === "add" ? addCategoryHandler : editCategoryHandler
          )}
        >
          <div>
            <label>Category Name</label>
            {type === "add" ? (
              <input type="text" {...register("category")} />
            ) : (
              <input
                type="text"
                {...register("category")}
                defaultValue={val.categoryName}
              />
            )}
            {errors.category && (
              <div className="errors">{errors.category.message}</div>
            )}
          </div>
          <div className="btnsIn">
            <button
              className="cancel"
              type="button"
              onClick={closeModalHandler}
            >
              Cancel
            </button>
            <button
              className="save"
              type="submit"
              onClick={handleSubmit(
                type === "add" ? addCategoryHandler : editCategoryHandler
              )}
            >
              {type === "add" ? "Save" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default Form;
