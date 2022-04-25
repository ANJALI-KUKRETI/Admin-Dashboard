import React from "react";
import cross from "../assets/Vector.png";
import Modal from "./Modal";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { closeFilterModal } from "../reducers/modalSlice";
import "./FilterModal.css";
import { filterBlog } from "../reducers/blogsSlice";

// const schema = yup
//   .object()
//   .shape({
//     categoryN: yup.mixed(),
//   })
//   .required();

const FilterModal = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    // watch,
  } = useForm();

  // const selectAll = watch("selectAll");
  // console.log(selectAll);

  const submitFormHandler = (data) => {
    console.log(data);
    console.log(data.categoryN);
    dispatch(filterBlog(data.categoryN));
    dispatch(closeFilterModal());
  };
  const categories = useSelector((state) => state.categories.initials);
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
                  // checked={selectAll}
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
              onClick={() => dispatch(closeFilterModal())}
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
