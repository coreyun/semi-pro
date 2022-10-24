import { createSlice } from "@reduxjs/toolkit";


export interface TabState {
  name?: string;
  key?: string;
  path?: string;
}

export interface TabbarState {
  tabs?: TabState[];
  currentKey?: string;
  currentIndex?: number;
}

const initialState: TabbarState = {
  tabs: []
};

export const tabbarSlice = createSlice({
  name: "tabbar",
  initialState,
  reducers: {
    openTab: (state, action) => {
      const currentTab = action.payload;
      const findIndex = state.tabs.findIndex(tab => tab.key == currentTab.key);
      state.currentKey = currentTab.key;
      if (findIndex < 0) {
        state.tabs = [...state.tabs, currentTab];
      } else {
        state.tabs.splice(findIndex, 1, currentTab);
      }
      state.currentIndex = state.tabs.findIndex(tab => tab.key == currentTab.key);
    },
    removeTab: (state, action) => {
      state.tabs.splice(action.payload, 1);
    },
    removeNextTabs: (state, action) => {
      const start = action.payload + 1;
      const deleteCount = state.tabs.length - start;
      state.tabs.splice(start, deleteCount);
    },
    removeOtherTabs: (state, action) => {
      state.tabs = [state.tabs[action.payload]];
    }
  }
});

// Action creators are generated for each case reducer function
export const { openTab, removeTab, removeNextTabs, removeOtherTabs } = tabbarSlice.actions;

export default tabbarSlice.reducer;
