import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal, showEditModal } from "../reducers/modalSlice";
import { v4 as uuidv4 } from "uuid";
import "./CategoryBlock.css";
import { getPreStoredCategories } from "../reducers/categorySlice";
import addButton from "../assets/Frame 268.png";

const CategoryBlock = ({ getCategory }) => {
  const initials = useSelector((state) => state.categories.initials);
  const status = useSelector((state) => state.categories.status);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPreStoredCategories());
  }, [dispatch]);

  // console.log(initials);
  const showModalHandler = () => {
    dispatch(showModal());
  };
  const showEditModalHandler = (initial) => {
    dispatch(showEditModal(initial.categoryName));
    getCategory(initial);
  };
  return (
    <div className="block">
      <div className="addCategory">
        <div className="addBtn">
          <div></div>
          <img src={addButton} alt="btn" onClick={showModalHandler} />
        </div>
        <div className="categoriesList">
          {initials.length === 0 && status === "idle" && (
            <div style={{ textAlign: "center" }}>No Categories Found!</div>
          )}
          {status === "loading" && (
            <div style={{ textAlign: "center" }}>Loading...</div>
          )}
          {status === "idle" &&
            initials.map((initial) => (
              <div className="category" key={uuidv4()}>
                <div className="cName">{initial.categoryName}</div>
                <div className="btns">
                  <button
                    className="edit"
                    onClick={() => showEditModalHandler(initial)}
                  >
                    Edit
                  </button>
                  <button className="disable">Disable</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBlock;
