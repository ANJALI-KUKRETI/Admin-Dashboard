import React, { useState } from "react";
import { closeBlogModal } from "../reducers/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { addBlogs } from "../reducers/blogsSlice";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import cross from "../assets/Vector.png";
import Modal from "./Modal";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
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
    // titleImage: yup
    //   .mixed()
    //   // .test("fileSize", "The file size is too large", (value) => {
    //   //   return value && value[0].size <= 10000000;
    //   // })
    //   .required("This field is required"),
    content: yup.string().min(5).required("This field is required"),
  })
  .required();

const BlogForm = () => {
  const dispatch = useDispatch();
  const [photoURL, setPhotoURL] = useState(null);
  const [imgVal, setImgVal] = useState("");
  const [img, setImg] = useState("");
  const type = useSelector((state) => state.modal.type);
  const categories = useSelector((state) => state.categories.initials);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, },
    setError
  } = useForm({
    resolver: yupResolver(schema),
  });

  const closeModalHandler = () => {
    dispatch(closeBlogModal());
  };

  const setImgName = (e) => {
    // setImg(e.target.files[0]);
    // setImgVal(e.target.files[0].name);
    const file = e.target.files[0]
    const name = e.target.files[0].name
    const id = uuidv4();
    uploadFiles({ titleImg: file, id, name });
  };

  const uploadFiles = ({ id, titleImg, name }) => {
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
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log('inside', url);
          setPhotoURL({url,id, titleImg});
        });
      }
    );
  };
  console.log('photoURL',photoURL);
  const addBLogHandler = async (data) => {
    const target = {...data, titleImage:photoURL.url}
    if(photoURL && photoURL.url){    
      setError('titleImage', null)  
      dispatch(addBlogs({ data:target, id:photoURL.id,  }));
      dispatch(closeBlogModal());
    }else{
      setError('titleImage',{ message: 'Please add title image', type:'ImageNotFoundError'})  
    }
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
            <input type="text" {...register("title")} />
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
            <input type="text" {...register("author")} />
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
              onClick={handleSubmit(addBLogHandler)}
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