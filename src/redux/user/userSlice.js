import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signinSuccess: (state, action) => {
      state.currentUser = action.payload;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
    },
    deleteSuccess: (state) => {
      state.currentUser = null;
    }
  }
});

export const { signinSuccess, signoutSuccess, updateSuccess, deleteSuccess } =
  userSlice.actions;
export default userSlice.reducer;
