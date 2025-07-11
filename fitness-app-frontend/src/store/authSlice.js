import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, userId } = action.payload;
      state.user = user;
      state.token = token;
      state.userId = userId;
      
      // Persist to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    },
  },
})

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;