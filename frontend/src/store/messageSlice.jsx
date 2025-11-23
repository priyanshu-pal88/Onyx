import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
import { toast } from "react-toastify";

export const getMessages = createAsyncThunk(
    'message/getMessages',
    async ({ userId }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/messages/${userId}`)
            return response.data.messages
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const sendMessage = createAsyncThunk(
    'message/sendMessage',
    async ({ userId, content, file, imagePreview }, { rejectWithValue, getState }) => {
        try {
            const formData = new FormData()
            if (content) formData.append('content', content)
            if (file) formData.append('file', file)

            const response = await api.post(`/messages/send/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return response.data.messageData
        } catch (error) {
            toast.error('Failed to send message')
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

const messageSlice = createSlice({
    name: 'message',
    initialState: {
        messages: [],
        loading: false,
        error: null,
        selectedUser: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
            state.messages = []
        },
        clearMessages: (state) => {
            state.messages = []
        },
        addMessage: (state, action) => {
            // Add incoming real-time message
            state.messages.push(action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMessages.pending, (state) => {
                state.loading = true
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.loading = false
                state.messages = action.payload
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(sendMessage.pending, (state, action) => {
                // Optimistic update - add message immediately
                const { userId, content, file, imagePreview } = action.meta.arg
                // Get userInfo from the root state
                const userInfo = action.meta.arg.userInfo
                const tempMessage = {
                    _id: `temp-${Date.now()}`,
                    senderId: userInfo?._id, // Current user's ID
                    receiverId: userId,
                    content: content || '',
                    image: imagePreview || null,
                    createdAt: new Date().toISOString(),
                    isPending: true
                }
                state.messages.push(tempMessage)
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                // Remove temp message and add real one
                state.messages = state.messages.filter(msg => !msg.isPending)
                state.messages.push(action.payload)
            })
            .addCase(sendMessage.rejected, (state, action) => {
                // Remove temp message on failure
                state.messages = state.messages.filter(msg => !msg.isPending)
                toast.error('Failed to send message')
            })
    }
})

export const { clearError, setSelectedUser, clearMessages, addMessage } = messageSlice.actions
export default messageSlice.reducer
