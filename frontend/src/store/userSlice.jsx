import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axios";
import { toast } from "react-toastify";
import { connectSocket, disconnectSocket, socket } from "../socket/socket";
import { setOnlineUsers } from "./socketSlice";
import { addMessage } from "./messageSlice";

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async ({ email, password }, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post('/auth/login', { email, password })
            
            if (!response.data.user) {
                toast.error("Invalid Credentials")
                return rejectWithValue("Invalid Credentials")
            }
            connectSocket(response.data.user._id)

            socket.on("getOnlineUsers", (onlineUsers) => {
                console.log("Online Users:", onlineUsers)
                dispatch(setOnlineUsers(onlineUsers))
            })

            socket.on("newMessage", (message) => {
                console.log("New message received:", message)
                dispatch(addMessage(message))
            })


            socket.on("notification", (data) => {
                const { type } = data;

                switch (type) {
                    case "friendRequest":
                        toast.info(data.message);
                        break;

                    case "FRIEND_ACCEPTED":
                        toast.success(data.message);
                        break;

                    case "like":
                        toast.success(data.message);
                        break;

                    case "comment":
                        toast(data.message);
                        break;

                    default:
                        toast(data.message || "New notification");
                }
            })


            toast.success("LoggedIn Successfully")
            return response.data.user
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const logoutUser = createAsyncThunk(
    'user/logoutUser',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            await api.post('/auth/logout')
            socket.off("getOnlineUsers")
            socket.off("newMessage")
            socket.off("notification")
            disconnectSocket()

            dispatch(setOnlineUsers([]))

            toast.success("Logged Out Successfully")
        } catch (error) {
            return rejectWithValue(error.message)

        }
    }
)

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.patch('/auth/update-user', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            if (response.data.user) {
                toast.success(response.data.message)
                return response.data.user
            }
        } catch (error) {
            console.log(error)
            toast.error("Could not update the user info")
            return rejectWithValue(error.message)
        }
    }
)

export const verifyUser = createAsyncThunk(
    'user/verifyUser',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.get('/auth/verify')
            connectSocket(response.data.user._id)

            socket.on("getOnlineUsers", (onlineUsers) => {
                // console.log("Online Users:", onlineUsers)
                dispatch(setOnlineUsers(onlineUsers))
            })

            socket.on("newMessage", (message) => {
                console.log("New message received:", message)
                dispatch(addMessage(message))
            })

            socket.on("notification", (data) => {
                const { type } = data;

                switch (type) {
                    case "friendRequest":
                        toast.info(data.message);
                        break;

                    case "friendAccepted":
                        toast.success(data.message);
                        break;

                    case "like":
                        toast.success(data.message);
                        break;

                    case "comment":
                        toast(data.message);
                        break;

                    default:
                        toast(data.message || "New notification");
                }
            })

            return response.data.user

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)




const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null,
        loading: false,
        isAuthenticated: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        updateUserOptimistically: (state, action) => {
            state.userInfo = {
                ...state.userInfo,
                ...action.payload
            }
        },
        removeFriendFromUserInfo: (state, action) => {
            if (state.userInfo && state.userInfo.friends) {
                state.userInfo.friends = state.userInfo.friends.filter(
                    friend => {
                        const friendId = typeof friend === 'object' ? friend._id : friend
                        return friendId?.toString() !== action.payload?.toString()
                    }
                )
            }
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state, action) => {
                state.loading = true
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.userInfo = action.payload
                state.isAuthenticated = true
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.isAuthenticated = false
                state.error = action.payload
            })
            .addCase(logoutUser.pending, (state, action) => {
                state.loading = true
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.loading = false
                state.userInfo = null
                state.isAuthenticated = false
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false
                state.isAuthenticated = true
                state.error = action.payload
            })
            .addCase(updateUser.pending, (state, action) => {
                state.loading = true
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false
                state.userInfo = action.payload

            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload

            })
            .addCase(verifyUser.pending, (state, action) => {
                state.loading = true
            })
            .addCase(verifyUser.fulfilled, (state, action) => {
                state.loading = false
                state.userInfo = action.payload
                state.isAuthenticated = true
            })
            .addCase(verifyUser.rejected, (state, action) => {
                state.loading = false
                state.isAuthenticated = false
                state.error = action.payload
            })
    }

})

export const { clearError, updateUserOptimistically, removeFriendFromUserInfo } = userSlice.actions
export default userSlice.reducer