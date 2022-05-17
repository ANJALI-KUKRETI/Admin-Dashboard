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
  const upload = ({ fileName, file, onError, onLoading, onSuccess }) => {
    const storageRef = ref(storage, `/files/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        onLoading(prog);
      },
      (err) => onError(err),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        onSuccess(url);
      }
    );
  };
  const add = ({ data, setError }) => {
    setError("titleImage", null);
    dispatch(
      addBlogs({
        data,
        createdAt: serverTimestamp(),
      })
    );
    dispatch(closeBlogModal());
  };

  const deleteFile = ({ fileName, onError }) => {
    const storageRef = ref(storage, `/files/${fileName}`);
    deleteObject(storageRef)
      .then(() => {
        console.log("deleted");
      })
      .catch((error) => onError(error));
  };

  const edit = ({ data }) => {
    dispatch(editBlog(data));
    dispatch(closeBlogModal());
  };
  return { upload, deleteFile, add, edit };
};

export default useBlogs;
