import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal, showEditModal } from "../reducers/modalSlice";
import { v4 as uuidv4 } from "uuid";
import "./CategoryBlock.css";
import {
  getNext,
  getPreStoredCategories,
  getPrev,
} from "../reducers/categorySlice";
import addButton from "../assets/Frame 268.png";

const CategoryBlock = () => {
  const [page, setPage] = useState(1);
  const initials = useSelector((state) => state.categories.initials);
  const status = useSelector((state) => state.categories.status);
  const error = useSelector((state) => state.categories.error);
  const last = useSelector((state) => state.categories.last);
  const first = useSelector((state) => state.categories.first);
  const length = useSelector((state) => state.categories.length);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPreStoredCategories());
  }, [dispatch]);

  const showModalHandler = () => {
    dispatch(showModal());
  };


  const showEditModalHandler = (initial) => {
    dispatch(showEditModal(initial));
  };
  const moveNextHandler = (e) => {
    e.preventDefault();
    dispatch(getNext(last));
    setPage(page + 1);
  };
  const movePrevHandler = (e) => {
    e.preventDefault();
    setPage(page - 1);
    dispatch(getPrev(first));
  };
  // console.log(page);
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
          {status === "idle" && error && (
            <div style={{ textAlign: "center", color: "red" }}>{error}</div>
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
      <div className="pageBtns">
        <div>{page > 1 && <button onClick={movePrevHandler}>Prev</button>}</div>
        <div>
          {length / (10 * page) > 1 && (
            <button onClick={moveNextHandler}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryBlock;
