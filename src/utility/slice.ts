import { Item } from "@/components/List";
import { createSlice, configureStore } from "@reduxjs/toolkit";

// setFilesUrls,
export type StoreState = {
  isOnline: boolean | undefined | "checking";
  listItems: Item[];
};

const initialState: StoreState = {
  isOnline: undefined,
  listItems: [],
};

const userSlice = createSlice({
  name: "pwa",
  initialState,
  reducers: {
    setOnline: (state, action: { type: string; payload: "checking" | boolean }) => {
      state.isOnline = action.payload;
    },
    setItems: (state, action: { type: string; payload: Item[] }) => {
      state.listItems = action.payload;
    },
    addItems: (state, action: { type: string; payload: Item }) => {
      state.listItems.push(action.payload);
    },
    deleteItem: (state, action: { type: string; payload: number }) => {
      state.listItems = state.listItems.filter((item) => item.keyEntry !== action.payload);
    },
  },
});

export const { setOnline, setItems, addItems, deleteItem } = userSlice.actions;

export const store = configureStore({
  reducer: userSlice.reducer,
});
