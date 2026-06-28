import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserState, userObj } from "../../utils/userInterfaces";

const initialState: UserState = {
  currentUser: null,
  error: "",
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = "";
    },
    signInSuccess: (state, action: PayloadAction<userObj>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = "";
    },
    signInFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    loginStart: (state) => {
      state.error = "";
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<userObj>) => {
      state.currentUser = action.payload;
      state.error = "";
      state.loading = false;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logOut: (state) => {
      state.currentUser = null;
      state.error = "";
      state.loading = false;
    },
    profileUpdate: (state, action: PayloadAction<userObj>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          user: {
            ...state.currentUser.user,
            name: action.payload.user.name || state.currentUser.user.name,
            email: action.payload.user.email || state.currentUser.user.email,
          },
        };
      }
      state.loading = false;
      state.error = "";
    },
  },
});

export const {
  signInStart,
  signInFailure,
  signInSuccess,
  loginStart,
  loginFailure,
  loginSuccess,
  logOut,
  profileUpdate,
} = userSlice.actions;

export default userSlice.reducer;
