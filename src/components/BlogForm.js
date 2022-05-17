import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";

import cross from "../assets/Vector.png";
import Modal from "./Modal";
import "./BlogForm.css";
import { getAllPreStoredCategories } from "../reducers/categorySlice";
import useBlogs from "../hooks/useBlogs";
import useModal from "../hooks/useModal";
import { fullDate } from "../utils/date";
import { Schema } from "../utils/blogsSchema";

const BlogForm = () => {
  const dispatch = useDispatch();

  const [photoURL, setPhotoURL] = useState(null);
  const [imgVal, setImgVal] = useState("");
  const [prog, setProg] = useState("");

  const { upload, deleteFile, add, edit } = useBlogs();
  const { closeBlog } = useModal();

  const { allInitials: categories } = useSelector((state) => state.categories);
  const val = useSelector((state) => state.modal.blogValue);
  const type = useSelector((state) => state.modal.type);

  const schema = Schema;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    dispatch(getAllPreStoredCategories());
  }, [dispatch]);

  useEffect(() => {
    if (type === "edit") {
      for (var key of Object.keys(val)) {
        setValue(key, val[key]);
      }
      setImgVal(val["titleImage"]);
      setPhotoURL({ url: val["titleImage"], id: val["id"] });
    }
  }, [type, setValue, val]);

  const closeModalHandler = () => {
    closeBlog();
  };

  const setImgName = (e) => {
    const id = uuidv4();
    if (
      type === "add"
        ? uploadFiles({
            titleImg: e.target.files[0],
            id,
          })
        : uploadFiles({
            titleImg: e.target.files[0],
            id: val.id,
          })
    );
  };

  const uploadFiles = ({ id, titleImg }) => {
    function onError(err) {
      console.log(err);
    }
    function onLoading(prog) {
      setProg(prog);
    }
    function onSuccess(url) {
      setImgVal(url);
      setPhotoURL({ url, id });
    }
    upload({
      fileName: id,
      file: titleImg,
      onError,
      onLoading,
      onSuccess,
    });
    setError("titleImage", null);
  };

  const deleteFileFromStorage = (id) => {
    function onError(err) {
      console.log(err);
    }
    if (type === "edit") {
      deleteFile({ fileName: val.id, onError });
    } else {
      deleteFile({ fileName: id, onError });
    }
  };
  const addBLogHandler = async (data) => {
    const date = fullDate;
    console.log(date);
    if (photoURL) {
      const finalData = {
        ...data,
        titleImage: photoURL.url,
        date: fullDate,
        id: photoURL.id,
      };
      add({ data: finalData, setError });
    } else {
      setError("titleImage", {
        message: "Please add title image",
        type: "ImageNotFoundError",
      });
    }
  };

  const editBlogHandler = (data) => {
    if (photoURL) {
      const finalData = { ...data, titleImage: photoURL.url, id: val.id };
      edit({ data: finalData });
    } else {
      setError("titleImage", {
        message: "Please add title image",
        type: "ImageNotFoundError",
      });
    }
  };

  return (
    <Modal>
      <div className="cross" onClick={closeModalHandler}>
        <img src={cross} alt="cross" />
      </div>
      <div className="container">
        <div className="heading">Create New Form</div>
        <form className="form" onSubmit={handleSubmit(addBLogHandler)}>
          <div className="field">
            <label>Title</label>
            <input type="text" {...register("title")} />
            {errors.title && (
              <div className="errorsB">{errors.title.message}</div>
            )}
          </div>
          <div className="field">
            <label>Category</label>
            <select {...register("category")}>
              {categories.map((cat) => (
                <option key={cat.categoryName} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            {errors.category && (
              <div className="errorsB">{errors.category.message}</div>
            )}
          </div>
          <div className="field">
            <label>Author</label>
            <input type="text" {...register("author")} />
            {errors.author && (
              <div className="errorsB">{errors.author.message}</div>
            )}
          </div>
          <div className="field">
            <div>Title Image</div>
            {!!imgVal ? (
              <div
                style={{
                  width: "510px",
                  height: "220px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 10,
                  }}
                  onClick={() => {
                    setImgVal("");
                    setProg("");
                    deleteFileFromStorage(photoURL.id);
                    setPhotoURL(null);
                  }}
                >
                  <button style={{ cursor: "pointer", fontWeight: "bold" }}>
                    X
                  </button>
                </div>
                <img
                  src={imgVal}
                  style={{ width: "100%", height: "220px" }}
                  alt=""
                />
              </div>
            ) : (
              <>
                <div className="plus">
                  <label htmlFor="file" className="plusF" name="titleImage">
                    +
                  </label>
                  <div className="progress">
                    {prog > 0 && prog < 100 && `Uploading ${prog}%`}
                    {prog === 100 && `Uploaded!`}
                  </div>
                </div>
                <input type="file" id="file" onChange={setImgName} />
              </>
            )}
            {errors.titleImage && (
              <div className="errorsC">{errors.titleImage.message}</div>
            )}
          </div>
          <div className="field">
            <label>Blog Content</label>
            <textarea type="text" {...register("content")} />

            {errors.content && (
              <div className="errorsB errorsText">{errors.content.message}</div>
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
            <button className="cancel" type="button">
              Preview
            </button>
            <button
              className="save"
              type="submit"
              onClick={handleSubmit(
                type === "add" ? addBLogHandler : editBlogHandler
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

export default BlogForm;
