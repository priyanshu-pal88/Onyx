import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    onlineUserIds: [],
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUserIds = action.payload;
    },
  },
});

export const { setOnlineUsers } = socketSlice.actions;
export default socketSlice.reducer;
