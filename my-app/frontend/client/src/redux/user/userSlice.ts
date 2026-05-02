import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface userObj {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface UserState {
  currentUser: userObj | null;
  error: string;
  loading: boolean;
}

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
} = userSlice.actions;

export default userSlice.reducer;
