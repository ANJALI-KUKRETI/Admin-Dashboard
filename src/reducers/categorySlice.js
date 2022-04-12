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
  async ({ category, editValue }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "Categories", category.id);
      updateDoc(docRef, {
        categoryName: editValue,
      });
      const init = query(
        collection(db, "Categories"),
        orderBy("createdAt", "desc")
      );
      const res = await getDocs(init);
      return { res, category, editValue };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const getPreStoredCategories = createAsyncThunk(
  "categories/preStoredCategories",
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
  status: "loading",
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // .addCase(addCategory.pending, (state) => {
      //   state.status = "loading";
      // })
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
      // .addCase(getPreStoredCategories.pending, (state) => {
      //   state.status = "loading";
      // })
      .addCase(getPreStoredCategories.fulfilled, (state, { payload }) => {
        var tempCategories = []
        for (var d of payload.docs){
          var tempItem = d.data()
          tempItem.id = d.id
          tempCategories.push(tempItem)
        }
        state.initials = tempCategories
        state.status = "idle";
      })
      .addCase(getPreStoredCategories.rejected, (state, action) => {
        if (isRejectedWithValue(action)) {
          state.status = "idle";
          state.error = action.payload;
          console.log(state.error);
        }
      })
      // .addCase(editCategory.pending, (state) => {
      //   state.status = "loading";
      // })
      .addCase(editCategory.fulfilled, (state, { payload }) => {
        const temp = payload.res.docs.map((d) => d.data());
        const tmp = temp.find((tm) => tm.id === payload.category.id);
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
      });
  },
});

export default categorySlice.reducer;
