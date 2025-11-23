import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axios";


export const getComments = createAsyncThunk(
    'comments/getComments',
    async ({ postId }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/comments/get/${postId}`)
            return response.data.comments
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const createComment = createAsyncThunk(
    'comments/createComment',
    async ({ postId, text , userInfo}, { rejectWithValue }) => {
        try {
            const response = await api.post(`/comments/create/${postId}`, { text })
            return response.data.comments
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const editComment = createAsyncThunk(
    'comments/editComment',
    async ({ id, text }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/comments/edit`, { id, text })
            return response.data.comment
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const deleteComment = createAsyncThunk(
    'comments/deleteComment',
    async ({ id, postId }, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/comments/delete/${postId}/${id}`)
            return id
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const commentSlice = createSlice({
    name: 'comments',
    initialState: {
        comments: [],
        loading: false,
        error: null
    },
    reducers: {
        stateError: (state, action) => {
            state.error = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getComments.pending, (state) => {
                state.loading = true
            }
            )
            .addCase(getComments.fulfilled, (state, action) => {
                state.loading = false
                state.comments = action.payload
            }
            )
            .addCase(getComments.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            }
            )
            .addCase(createComment.fulfilled, (state, action) => {
               state.comments.push(action.payload)
            }
            )
            .addCase(editComment.fulfilled, (state, action) => {
                const index = state.comments.findIndex(comment => comment._id === action.payload._id)
                if (index !== -1) {
                    state.comments[index] = action.payload
                }
            }
            )
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter(comment => comment._id !== action.payload)
            }
            )


    }
})

export const { stateError } = commentSlice.actions

export default commentSlice.reducer