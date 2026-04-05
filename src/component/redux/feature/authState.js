import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  token: null,
  isAuth: false,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuth = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuth = false;
    },
  },
});
export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
