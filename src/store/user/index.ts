import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  userInfo?: {
    name?: string;
    avatar?: string;
    job?: string;
    organization?: string;
    location?: string;
    email?: string;
    permissions: Record<string, string[]>;
  };
  userLoading?: boolean;
}

const initialState: UserState = {
  userInfo: {
    permissions: {}
  },
  userLoading: false
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserInfo: (state, action) => {
      const { userInfo = initialState.userInfo, userLoading } = action.payload;
      state.userInfo = userInfo;
      state.userLoading = userLoading;
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateUserInfo } = userSlice.actions;

export default userSlice.reducer;
