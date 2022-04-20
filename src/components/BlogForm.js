import React, { useState } from "react";
import { closeBlogModal } from "../reducers/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { addBlogs, editBlog } from "../reducers/blogsSlice";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import cross from "../assets/Vector.png";
import Modal from "./Modal";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { serverTimestamp } from "firebase/firestore";
import { storage } from "../firebase";

import "./BlogForm.css";

const schema = yup
  .object()
  .shape({
    title: yup.string().required("This field is required"),
    category: yup.string().required("This field is required"),
    author: yup
      .string()
      .matches(/^[a-zA-Z\s]*$/g, "Enter a valid Category!(must be a string)")
      .required("This field is required"),
    content: yup.string().min(5).required("This field is required"),
  })
  .required();

const BlogForm = () => {
  const dispatch = useDispatch();
  const [photoURL, setPhotoURL] = useState(null);
  const [imgVal, setImgVal] = useState("");
  const [img, setImg] = useState("");

  const categories = useSelector((state) => state.categories.initials);

  const val = useSelector((state) => state.modal.blogValue);
  const type = useSelector((state) => state.modal.type);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const closeModalHandler = () => {
    dispatch(closeBlogModal());
  };

  const setImgName = (e) => {
    setImg(e.target.files[0]);
    setImgVal(e.target.files[0].name);
    const id = uuidv4();
    uploadFiles({ titleImg: e.target.files[0], id });
  };

  const uploadFiles = ({ id, titleImg }) => {
    const storageRef = ref(storage, `/files/${id}`);
    const uploadTask = uploadBytesResumable(storageRef, titleImg);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log(prog);
      },
      (err) => console.log(err),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setPhotoURL({ url, id });
        // console.log(photoURL, url);
      }
    );
  };

  const addBLogHandler = async (data) => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let fullDate = `${day}/${month}/${year}`;
    const target = { ...data, titleImage: photoURL.url, date: fullDate };
    console.log(fullDate);
    if (photoURL) {
      setError("titleImage", null);
      dispatch(
        addBlogs({
          data: target,
          id: photoURL.id,
          createdAt: serverTimestamp(),
        })
      );
      dispatch(closeBlogModal());
    } else {
      setError("titleImage", {
        message: "Please add title image",
        type: "ImageNotFoundError",
      });
    }
  };

  const editBlogHandler = (data) => {
    console.log(photoURL);
    const target = { ...data, titleImage: photoURL.url, id: val.id };
    // const editValue = data.category;
    dispatch(editBlog(target));
    dispatch(closeBlogModal());
  };

  return (
    <Modal>
      <div className="cross" onClick={closeModalHandler}>
        <img src={cross} alt="cross" />
      </div>
      <div className="container">
        <div className="heading">Create New Form</div>
        <form onSubmit={handleSubmit(addBLogHandler)}>
          <div className="field">
            <label>Title</label>
            {/* <input type="text" {...register("title")} /> */}
            {type === "add" ? (
              <input type="text" {...register("title")} />
            ) : (
              <input
                type="text"
                {...register("title")}
                defaultValue={val.title}
              />
            )}
            {errors.title && (
              <div className="errorsB">{errors.title.message}</div>
            )}
          </div>
          <div className="field">
            <label>Category</label>
            <select {...register("category")}>
              {categories.map((cat) => (
                <option key={uuidv4()} value={cat.categoryName}>
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
            {/* <input type="text" {...register("author")} /> */}
            {type === "add" ? (
              <input type="text" {...register("author")} />
            ) : (
              <input
                type="text"
                {...register("author")}
                defaultValue={val.author}
              />
            )}
            {errors.author && (
              <div className="errorsB">{errors.author.message}</div>
            )}
          </div>
          <div className="field">
            <div>Title Image</div>
            <div className="plus">
              <label htmlFor="file" className="plusF" name="titleImage">
                +
              </label>
              <div className="imgName">{imgVal}</div>
            </div>
            <input
              type="file"
              id="file"
              // {...register("titleImage")}
              onChange={setImgName}
            />
            {errors.titleImage && (
              <div className="errorsB">{errors.titleImage.message}</div>
            )}
          </div>
          <div className="field">
            <label>Blog Content</label>
            {/* <textarea type="text" {...register("content")} /> */}
            {type === "add" ? (
              <textarea type="text" {...register("content")} />
            ) : (
              <textarea
                type="text"
                {...register("content")}
                defaultValue={val.content}
              />
            )}

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
            {/* <button
              className="save"
              type="submit"
              onClick={handleSubmit(addBLogHandler)}
            >
              {type === "add" ? "Save" : "Save Changes"}
            </button> */}
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
