import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axios";
import { toast } from "react-toastify"



export const getPosts = createAsyncThunk(
    'posts/getPosts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/posts/')
            return response.data.posts
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const createPost = createAsyncThunk(
    'posts/createPost',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/posts/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            toast.success('Post created successfully')
            return response.data.post
        } catch (error) {
            toast.error('Failed to create post')
            return rejectWithValue(error.message)
        }
    }
)

export const likePost = createAsyncThunk(
    'posts/likePost',
    async ({ id, userId }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/posts/like/${id}`)
            console.log(response.data.message)
            return { id, userId, data: response.data }
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const editPost = createAsyncThunk(
    'posts/editPost',
    async ({ id, caption }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/posts/edit/${id}`, { caption })
            return response.data
        } catch (error) {
            return rejectWithValue
        }
    }
)

export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/posts/delete/${id}`)
            toast.success(response.data.message)
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const getFeedPosts = createAsyncThunk(
    'posts/getFeedPosts',
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/posts/feed?page=${page}&limit=${limit}`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const postSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: [],
        feedPosts: [],
        pagination: null,
        loading: false,
        feedLoading: false,
        createPostLoading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPosts.pending, (state, action) => {
                state.loading = true
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.loading = false
                state.posts = action.payload
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(createPost.pending, (state) => {
                state.createPostLoading = true
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.createPostLoading = false
                state.posts.unshift(action.payload)
            })
            .addCase(createPost.rejected, (state, action) => {
                state.createPostLoading = false
                state.error = action.payload
            })
            .addCase(likePost.fulfilled, (state, action) => {
                const { id, userId } = action.payload;
                
                
                const post = state.posts.find(p => p._id === id);
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

                const feedPost = state.feedPosts.find(p => p._id === id);
                if (feedPost && userId) {
                    const alreadyLiked = feedPost.likes.some(
                        likeId => likeId?.toString() === userId?.toString()
                    );

                    if (alreadyLiked) {
                        feedPost.likes = feedPost.likes.filter(
                            likeId => likeId && likeId.toString() !== userId.toString()
                        );
                    } else {
                        feedPost.likes.push(userId);
                    }
                }
            })

        // .addCase(likePost.fulfilled, (state, action) => {
        //     const { id, userId } = action.payload
        //     const post = state.posts.find(p => p._id === id)
        //     if (post) {
        //         if (post.likes.includes(userId)) {
        //             post.likes = post.likes.filter(likeId => likeId !== userId)
        //         } else {
        //             post.likes.push(userId)
        //         }
        //     }
        // })
            .addCase(getFeedPosts.pending, (state) => {
                state.feedLoading = true
            })
            .addCase(getFeedPosts.fulfilled, (state, action) => {
                state.feedLoading = false
                state.feedPosts = action.payload.posts
                state.pagination = action.payload.pagination
            })
            .addCase(getFeedPosts.rejected, (state, action) => {
                state.feedLoading = false
                state.error = action.payload
            })



    }
})

export const { clearError } = postSlice.actions

export default postSlice.reducer 