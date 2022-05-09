import React, { useEffect } from "react";
import cross from "../assets/Vector.png";
import Modal from "./Modal";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { closeFilterModal } from "../reducers/modalSlice";
import "./FilterModal.css";
import { filterBlog } from "../reducers/blogsSlice";
import { getAllPreStoredCategories } from "../reducers/categorySlice";
import useModal from "../hooks/useModal";

const FilterModal = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { closeFilter } = useModal();

  useEffect(() => {
    dispatch(getAllPreStoredCategories());
  }, [dispatch]);
  const { allInitials: categories } = useSelector((state) => state.categories);

  const submitFormHandler = (data) => {
    dispatch(filterBlog(data.categoryN));
    closeFilter();
  };

  return (
    <Modal>
      <div className="cross" onClick={() => dispatch(closeFilterModal())}>
        <img src={cross} alt="cross" />
      </div>
      <div className="container cont">
        <div className="heading">Filter</div>
        <form onSubmit={handleSubmit(submitFormHandler)}>
          <div className="outerCheck">
            {/* {categories.length > 0 && (
              <div className="checkbox">
                <input
                  type="checkbox"
                  id="vehicle1"
                  {...register("selectAll")}
                  className="check"
                  value="all"
                />
                <label htmlFor="vehicle1" className="label">
                  Select all
                </label>
                <br></br>
              </div>
            )} */}
            {categories.map((cat) => (
              <div className="checkbox" key={cat.categoryName}>
                <input
                  type="checkbox"
                  id="vehicle1"
                  className="check"
                  {...register("categoryN", {
                    required: { value: true, message: "Color is required" },
                  })}
                  value={cat.categoryName}
                />
                <label htmlFor="vehicle1" className="label">
                  {cat.categoryName}
                </label>
                <br></br>
              </div>
            ))}
          </div>
          {errors.categoryN && (
            <div className="errorsD">{errors.categoryN.message}</div>
          )}
          <div className="btnsIn">
            <button
              className="cancel"
              type="button"
              onClick={() => closeFilter()}
            >
              Cancel
            </button>
            <button className="save">Filter</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default FilterModal;
