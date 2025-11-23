import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
import { toast } from "react-toastify";


export const getFriends = createAsyncThunk(
    'friend/getFriends',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/users/friends')
            return {
                friends: response.data.friends,
                receivedRequests: response.data.receivedRequests,
                sentRequests: response.data.sentRequests
            }
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const getSuggestedUsers = createAsyncThunk(
    'friend/getSuggestedUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/users/suggested')
            return response.data.users
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const sendFriendRequest = createAsyncThunk(
    'friend/sendFriendRequest',
    async ({ userId }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/users/friends/send/${userId}`)
            toast.success(response.data.message)
            return userId
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send friend request')
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const removeFriend = createAsyncThunk(
    'friend/removeFriend',
    async ({ userId }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/users/friends/remove/${userId}`)
            toast.success(response.data.message)
            return userId
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to remove friend')
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const acceptFriendRequest = createAsyncThunk(
    'friend/acceptFriendRequest',
    async ({ userId }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/users/friends/accept/${userId}`)
            toast.success(response.data.message)
            return userId
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to accept friend request')
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const rejectFriendRequest = createAsyncThunk(
    'friend/rejectFriendRequest',
    async ({ userId }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/users/friends/reject/${userId}`)
            toast.success(response.data.message)
            return userId
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reject friend request')
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)


const friendSlice = createSlice({
    name: 'friend',
    initialState: {
        friendsList: [],
        receivedRequests: [],
        sentRequests: [],
        suggestedUsers: [],
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        removeSuggestedUser: (state, action) => {
            state.suggestedUsers = state.suggestedUsers.filter(
                user => user._id !== action.payload
            )
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFriends.pending, (state, action) => {
                state.loading = true
            })
            .addCase(getFriends.fulfilled, (state, action) => {
                state.loading = false
                state.friendsList = action.payload.friends
                state.receivedRequests = action.payload.receivedRequests
                state.sentRequests = action.payload.sentRequests
            })
            .addCase(getFriends.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getSuggestedUsers.pending, (state, action) => {
                state.loading = true
            })
            .addCase(getSuggestedUsers.fulfilled, (state, action) => {
                state.loading = false
                state.suggestedUsers = action.payload
            })
            .addCase(getSuggestedUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(sendFriendRequest.fulfilled, (state, action) => {
                state.suggestedUsers = state.suggestedUsers.filter(
                    user => user._id !== action.payload
                )
            })
            .addCase(removeFriend.pending, (state, action) => {

                const userId = action.meta.arg.userId
                state.friendsList = state.friendsList.filter(
                    friend => friend._id !== userId
                )
            })
            .addCase(removeFriend.fulfilled, (state, action) => {
            })
            .addCase(removeFriend.rejected, (state, action) => {

                toast.error('Failed to remove friend. Please refresh the page.')
            })
            .addCase(acceptFriendRequest.fulfilled, (state, action) => {
                state.receivedRequests = state.receivedRequests.filter(
                    user => user._id !== action.payload
                )
            })
            .addCase(rejectFriendRequest.fulfilled, (state, action) => {
                state.receivedRequests = state.receivedRequests.filter(
                    user => user._id !== action.payload
                )
            })
    }


})

export const { clearError, removeSuggestedUser } = friendSlice.actions
export default friendSlice.reducer