import { createSlice } from "@reduxjs/toolkit";

export interface NavState {
  name?: string;
  key?: string;
  path?: string;
}

export interface NavbarState {
  navs?: NavState[];
  breadcrumb?: [];
  collapsed?: boolean;
  routeKeys?: string[];
}

const initialState: NavbarState = {
  navs: [],
  breadcrumb: [],
  collapsed: false,
  routeKeys: []
};

export const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    routeKeysClear: (state) => {
      state.routeKeys = [];
    },
    routeKeysSet: (state, action) => {
      state.routeKeys.push(action.payload);
    }
  }
});

// Action creators are generated for each case reducer function
export const { routeKeysClear, routeKeysSet } = navbarSlice.actions;

export default navbarSlice.reducer;
