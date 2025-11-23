import { configureStore } from "@reduxjs/toolkit";
import userSlice from './userSlice'
import postSlice from './postSlice'
import commentSlice from './commentSlice'
import friendSlice from './friendSlice'
import otherUserSlice from './otherUserSlice'
import messageSlice from './messageSlice'
import socketSlice from './socketSlice'

export const store = configureStore({
    reducer : {
        userReducer : userSlice,
        postReducer : postSlice,
        commentReducer : commentSlice,
        friendReducer : friendSlice,
        otherUserReducer : otherUserSlice,
        messageReducer : messageSlice,
        socketReducer : socketSlice
    }
})