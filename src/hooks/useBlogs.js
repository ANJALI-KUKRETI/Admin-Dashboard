import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { serverTimestamp } from "firebase/firestore";
import { storage } from "../firebase";
import { addBlogs, editBlog } from "../reducers/blogsSlice";
import { useDispatch } from "react-redux";
import { closeBlogModal } from "../reducers/modalSlice";

const useBlogs = () => {
  const dispatch = useDispatch();
  const upload = ({
    id,
    titleImg,
    setError,
    setProg,
    setImgVal,
    setPhotoURL,
  }) => {
    const storageRef = ref(storage, `/files/${id}`);
    const uploadTask = uploadBytesResumable(storageRef, titleImg);
    setError("titleImage", null);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProg(prog);
      },
      (err) => console.log(err),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setImgVal(url);
        setPhotoURL({ url, id });
      }
    );
  };
  const add = ({ data, photoURL, setError }) => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let fullDate = `${day}/${month}/${year}`;
    if (photoURL) {
      const target = { ...data, titleImage: photoURL.url, date: fullDate };
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
  const deleteB = ({ id, val, type }) => {
    const storageRef = ref(storage, `/files/${val.id}`);
    const sRef = ref(storage, `/files/${id}`);
    if (type === "edit") {
      deleteObject(storageRef)
        .then(() => {
          console.log("deleted");
        })
        .catch((error) => console.log("error occured"));
    } else {
      deleteObject(sRef)
        .then(() => {
          console.log("deleted");
        })
        .catch((error) => console.log("error occured"));
    }
  };
  const edit = ({ data, photoURL, val, setError }) => {
    if (photoURL) {
      const target = { ...data, titleImage: photoURL.url, id: val.id };
      dispatch(editBlog(target));
      dispatch(closeBlogModal());
    } else {
      setError("titleImage", {
        message: "Please add title image",
        type: "ImageNotFoundError",
      });
    }
  };
  return { upload, deleteB, add, edit };
};

export default useBlogs;
