import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
import { likePost } from "./postSlice";


export const getOtherUserInfo = createAsyncThunk(
    'otherUser/getOtherUserInfo',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/users/profile/${userId}`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)


const otherUserSlice = createSlice({
    name: 'otherUser',
    initialState: {
        otherUserInfo: null,
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOtherUserInfo.pending, (state, action) => {
                state.loading = true
            })
            .addCase(getOtherUserInfo.fulfilled, (state, action) => {
                state.loading = false
                state.otherUserInfo = action.payload
            })
            .addCase(getOtherUserInfo.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Handle likePost from postSlice
            .addCase(likePost.fulfilled, (state, action) => {
                const { id, userId } = action.payload;
                
                // Update likes in otherUserInfo.posts
                if (state.otherUserInfo?.posts) {
                    const post = state.otherUserInfo.posts.find(p => p._id === id);
                    
                    if (post && userId) {
                        const alreadyLiked = post.likes.some(
                            likeId => likeId?.toString() === userId?.toString()
                        );

                        if (alreadyLiked) {
                            post.likes = post.likes.filter(
                                likeId => likeId && likeId.toString() !== userId.toString()
                            );
                        } else {
                            post.likes.push(userId);
                        }
                    }
                }
            })

    }
})

export const { clearError } = otherUserSlice.actions
export default otherUserSlice.reducer