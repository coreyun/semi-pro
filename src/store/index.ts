import navbarReducer from "@/store/navbar";
import tabbarReducer from "@/store/tabbar";
import userReducer from "@/store/user";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    user: userReducer,
    navbar: navbarReducer,
    tabbar: tabbarReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
