import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { db } from "../firebase";
import { v4 as uuidv4 } from "uuid";

import {
  doc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  orderBy,
  query,
  limit,
  startAfter,
  endBefore,
  limitToLast,
} from "firebase/firestore";

export const addCategory = createAsyncThunk(
  "categories/addCategories",
  async ({ categoryName, createdAt }, { rejectWithValue }) => {
    try {
      const id = uuidv4();
      const category = {
        categoryName,
        createdAt,
        id: id,
      };
      await setDoc(doc(db, `Categories/${id}`), category);
      return category;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const editCategory = createAsyncThunk(
  "categories/editCategory",
  async ({ val, editValue }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "Categories", val.id);
      updateDoc(docRef, {
        categoryName: editValue,
      });
      const init = query(
        collection(db, "Categories"),
        orderBy("createdAt", "desc")
      );
      const res = await getDocs(init);
      return { res, val, editValue };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const getPreStoredCategories = createAsyncThunk(
  "categories/preStoredCategories",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const init = query(
        collection(db, "Categories"),
        orderBy("createdAt", "desc"),
        limit(10)
      );

      const res = await getDocs(init);
      const initForLength = query(
        collection(db, "Categories"),
        orderBy("createdAt", "desc")
      );
      const resL = await getDocs(initForLength);
      const temp = resL.docs.map((d) => d.data());
      dispatch(setLength(temp.length));
      const lastVisible = res.docs[res.docs.length - 1];
      dispatch(setLastVisible(lastVisible));
      const lastVisibleFirst = res.docs[0];
      dispatch(setFirstVisible(lastVisibleFirst));
      // console.log("last", lastVisible);
      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const getNext = createAsyncThunk(
  "categories/getNext",
  async (last, { rejectWithValue, dispatch }) => {
    try {
      const init = query(
        collection(db, "Categories"),
        orderBy("createdAt", "desc"),
        startAfter(last),
        limit(10)
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
export const getPrev = createAsyncThunk(
  "categories/getPrev",
  async (first, { rejectWithValue, dispatch }) => {
    try {
      console.log(first.data());
      const init = query(
        collection(db, "Categories"),
        orderBy("createdAt", "desc"),
        endBefore(first),
        limitToLast(11)
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
export const getAllPreStoredCategories = createAsyncThunk(
  "categories/allPreStoredCategories",
  async (_, { rejectWithValue }) => {
    try {
      const init = query(
        collection(db, "Categories"),
        orderBy("createdAt", "desc")
      );
      const res = await getDocs(init);
      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
const initialState = {
  categories: [],
  initials: [],
  allInitials: [],
  last: null,
  first: null,
  length: 0,
  status: "loading",
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
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
      .addCase(addCategory.fulfilled, (state, { payload }) => {
        state.categories = [payload, ...state.categories];
        state.initials = [payload, ...state.initials];
        state.status = "idle";
      })
      .addCase(addCategory.rejected, (state, action) => {
        if (isRejectedWithValue(action)) {
          state.status = "idle";
          state.error = action.payload;
        }
      })
      .addCase(getPreStoredCategories.fulfilled, (state, { payload }) => {
        state.initials = payload.docs.map((d) => d.data());
        state.status = "idle";
      })
      .addCase(getPreStoredCategories.rejected, (state, action) => {
        if (isRejectedWithValue(action)) {
          state.status = "idle";
          state.error = action.payload;
          console.log(state.error);
        }
      })
      .addCase(getAllPreStoredCategories.fulfilled, (state, { payload }) => {
        state.allInitials = payload.docs.map((d) => d.data());
        state.status = "idle";
      })
      .addCase(getAllPreStoredCategories.rejected, (state, action) => {
        if (isRejectedWithValue(action)) {
          state.status = "idle";
          state.error = action.payload;
          console.log(state.error);
        }
      })
      .addCase(editCategory.fulfilled, (state, { payload }) => {
        const temp = payload.res.docs.map((d) => d.data());
        const tmp = temp.find((tm) => tm.id === payload.val.id);
        tmp.categoryName = payload.editValue;
        state.initials = temp;
        state.categories = temp;
        state.status = "idle";
      })
      .addCase(editCategory.rejected, (state, action) => {
        if (isRejectedWithValue(action)) {
          state.status = "idle";
          state.error = action.payload;
        }
      })
      .addCase(getNext.fulfilled, (state, { payload }) => {
        state.initials = payload.docs.map((d) => d.data());
      })
      .addCase(getPrev.fulfilled, (state, { payload }) => {
        state.initials = payload.docs.map((d) => d.data());
      });
  },
});

export const { setLastVisible, setFirstVisible, setLength } =
  categorySlice.actions;
export default categorySlice.reducer;
