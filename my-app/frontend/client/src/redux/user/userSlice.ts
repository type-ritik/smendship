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
    // loginX are identical to signInX; kept so existing imports don't break.
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
    // Backend updateProfile returns ProfilePayload { name, email } (no user/token),
    // so the payload type is that, not a whole userObj.
    profileUpdate: (
      state,
      action: PayloadAction<{ name?: string | null; email?: string | null }>,
    ) => {
      if (state.currentUser) {
        state.currentUser.user.name =
          action.payload.name || state.currentUser.user.name;
        state.currentUser.user.email =
          action.payload.email || state.currentUser.user.email;
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
