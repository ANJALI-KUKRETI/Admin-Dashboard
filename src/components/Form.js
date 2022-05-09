import React from "react";
import Modal from "./Modal";
import { useSelector } from "react-redux";
import cross from "../assets/Vector.png";
import "./Form.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import useCategories from "../hooks/useCategories";
import useModal from "../hooks/useModal";

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
  const { add, edit } = useCategories();
  const { close } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const closeModalHandler = () => {
    close();
  };

  const addCategoryHandler = (data) => {
    add({ data });
    close();
  };
  const editCategoryHandler = (data) => {
    edit({ data, val });
    close();
  };

  return (
    <Modal>
      <div className="cross" onClick={closeModalHandler}>
        <img src={cross} alt="cross" />
      </div>
      <div className="container">
        <div className="heading">Add Category</div>
        <form
          className="form"
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
