import React from "react";
import cross from "../assets/Vector.png";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { closeFilterModal } from "../reducers/modalSlice";
import "./FilterModal.css";

const FilterModal = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.initials);
  return (
    <Modal>
      <div className="cross" onClick={() => dispatch(closeFilterModal())}>
        <img src={cross} alt="cross" />
      </div>
      <div className="container cont">
        <div className="heading">Filter</div>
        <form>
          <div className="outerCheck">
            {categories.length > 0 && (
              <div className="checkbox">
                <input
                  type="checkbox"
                  id="vehicle1"
                  className="check"
                  name="vehicle1"
                  value="Bike"
                />
                <label htmlFor="vehicle1" className="label">
                  Select all
                </label>
                <br></br>
              </div>
            )}
            {categories.map((cat) => (
              <div className="checkbox" key={cat.categoryName}>
                <input
                  type="checkbox"
                  id="vehicle1"
                  className="check"
                  name="vehicle1"
                  value="Bike"
                />
                <label htmlFor="vehicle1" className="label">
                  {cat.categoryName}
                </label>
                <br></br>
              </div>
            ))}
          </div>
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
