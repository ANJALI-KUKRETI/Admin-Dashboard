import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { db } from "../firebase";

import {
  doc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  orderBy,
  query,
  where,
  startAfter,
  endBefore,
  limitToLast,
  limit,
} from "firebase/firestore";

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
      return Blog;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const getPreStoredBlogs = createAsyncThunk(
  "blogs/preStoredBlogs",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const init = query(
        collection(db, "Blogs"),
        orderBy("createdAt", "desc"),
        limit(2)
      );
      const res = await getDocs(init);
      const initForLength = query(
        collection(db, "Blogs"),
        orderBy("createdAt", "desc")
      );
      const resL = await getDocs(initForLength);
      const temp = resL.docs.map((d) => d.data());
      dispatch(setLength(temp.length));
      const lastVisible = res.docs[res.docs.length - 1];
      dispatch(setLastVisible(lastVisible));
      const lastVisibleFirst = res.docs[0];
      dispatch(setFirstVisible(lastVisibleFirst));
      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getNextBlogs = createAsyncThunk(
  "blogs/getNext",
  async (last, { rejectWithValue, dispatch }) => {
    try {
      const init = query(
        collection(db, "Blogs"),
        orderBy("createdAt", "desc"),
        startAfter(last),
        limit(2)
      );
      const res = await getDocs(init);
      const lastVisible = res.docs[res.docs.length - 1];
      dispatch(setLastVisible(lastVisible));
      const lastVisibleFirst = res.docs[0];
      dispatch(setFirstVisible(lastVisibleFirst));
      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const getPrevBlogs = createAsyncThunk(
  "blogs/getPrev",
  async (first, { rejectWithValue, dispatch }) => {
    try {
      console.log(first.data());
      const init = query(
        collection(db, "Blogs"),
        orderBy("createdAt", "desc"),
        endBefore(first),
        limitToLast(3)
      );
      const res = await getDocs(init);

      const lastVisibleFirst = res.docs[0];
      dispatch(setFirstVisible(lastVisibleFirst));
      const lastVisible = res.docs[res.docs.length - 1];
      dispatch(setLastVisible(lastVisible));
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
      console.log(res);
      return { res, data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const filterBlog = createAsyncThunk(
  "blogs/filterBlog",
  async (filters, { rejectWithValue }) => {
    try {
      const init = query(
        collection(db, "Blogs"),
        where("category", "in", filters),
        limit(2)
      );
      const preBlogs = await getDocs(init);
      const temp = preBlogs.docs.map((d) => d.data());
      console.log(temp);
      return temp;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  blogs: [],
  initialBlogs: [],
  status: "loading",
  last: null,
  first: null,
  length: 0,
  error: null,
};

const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    setLastVisible: (state, action) => {
      state.last = action.payload;
    },
    setFirstVisible: (state, action) => {
      state.first = action.payload;
    },
    setLength: (state, action) => {
      state.length = action.payload;
    },
  },
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
      })
      .addCase(filterBlog.fulfilled, (state, { payload }) => {
        state.initialBlogs = payload;
      })
      .addCase(getNextBlogs.fulfilled, (state, { payload }) => {
        state.initialBlogs = payload.docs.map((d) => d.data());
      })
      .addCase(getPrevBlogs.fulfilled, (state, { payload }) => {
        state.initialBlogs = payload.docs.map((d) => d.data());
      });
  },
});

export const { setLastVisible, setFirstVisible, setLength } =
  blogsSlice.actions;
export default blogsSlice.reducer;
