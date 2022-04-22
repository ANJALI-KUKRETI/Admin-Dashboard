import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { db, storage } from "../firebase";

import {
  doc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

export const addBlogs = createAsyncThunk(
  "blogs/addBlogs",
  async ({ data, id, createdAt }, { rejectWithValue }) => {
    try {
      const Blog = {
        title: data.title,
        category: data.category,
        author: data.author,
        content: data.content,
        titleImage: data.titleImage,
        id: id,
        createdAt,
        date: data.date,
      };
      await setDoc(doc(db, `Blogs/${id}`), Blog);
      console.log(Blog);
      return Blog;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const getPreStoredBlogs = createAsyncThunk(
  "blogs/preStoredBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const init = query(collection(db, "Blogs"), orderBy("createdAt", "desc"));
      const res = await getDocs(init);
      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteBlog = createAsyncThunk("blogs/deleteBlog", async (id) => {
  const docRef = doc(db, "Blogs", id);
  await deleteDoc(docRef);
  return id;
});

export const editBlog = createAsyncThunk(
  "blogs/editBlog",
  async (data, { rejectWithValue }) => {
    try {
      // console.log(data);
      const docRef = doc(db, "Blogs", data.id);
      updateDoc(docRef, {
        title: data.title,
        category: data.category,
        author: data.author,
        content: data.content,
        titleImage: data.titleImage,
      });
      const init = query(collection(db, "Blogs"), orderBy("createdAt", "desc"));
      const res = await getDocs(init);
      return { res, data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  blogs: [],
  initialBlogs: [],
  status: "loading",
  error: null,
};

const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addBlogs.fulfilled, (state, { payload }) => {
        state.blogs = [payload, ...state.blogs];
        state.initialBlogs = [payload, ...state.initialBlogs];
        state.status = "idle";
      })
      .addCase(getPreStoredBlogs.fulfilled, (state, { payload }) => {
        state.initialBlogs = payload.docs.map((d) => d.data());
        state.status = "idle";
      })
      .addCase(getPreStoredBlogs.rejected, (state, action) => {
        if (isRejectedWithValue(action)) {
          state.status = "idle";
          state.error = action.payload;
        }
      })
      .addCase(deleteBlog.fulfilled, (state, { payload }) => {
        state.initialBlogs = state.initialBlogs.filter(
          (init) => init.id !== payload
        );
        state.status = "idle";
        state.err = null;
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        if (isRejectedWithValue(action)) {
          state.status = "idle";
          state.error = action.payload;
        }
      })
      .addCase(editBlog.fulfilled, (state, { payload }) => {
        const temp = payload.res.docs.map((d) => d.data());
        const tmp = temp.find((tm) => tm.id === payload.data.id);
        tmp.title = payload.data.title;
        tmp.category = payload.data.category;
        tmp.author = payload.data.author;
        tmp.content = payload.data.content;
        tmp.titleImage = payload.data.titleImage;
        state.initialBlogs = temp;
        state.blogs = temp;
        state.status = "idle";
      })
      .addCase(editBlog.rejected, (state, action) => {
        if (isRejectedWithValue(action)) {
          state.status = "idle";
          state.error = action.payload;
        }
      });
  },
});

export default blogsSlice.reducer;
