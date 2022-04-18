import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { db, storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";

import {
  doc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";
// import { getDownloadURL, ref } from "firebase/storage";
// import { uploadBytesResumable } from "firebase/storage";

export const addBlogs = createAsyncThunk(
  "blogs/addBlogs",
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const Blog = {
        title: data.title,
        category: data.category,
        author: data.author,
        content: data.content,
        titleImage: data.titleImage,
        id: id,
      };
      await setDoc(doc(db, `Blogs/${id}`), Blog);
      console.log(Blog);
      return Blog;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  blogs: [],
  initials: [],
  status: "loading",
  error: null,
};

const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
});

export default blogsSlice.reducer;
