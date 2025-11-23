import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMessages, sendMessage } from '../store/messageSlice'

const ChatContainer = ({ selectedUser }) => {
  const dispatch = useDispatch()
  const { messages, loading } = useSelector((state) => state.messageReducer)
  const { userInfo } = useSelector((state) => state.userReducer)
  const { onlineUserIds } = useSelector((state) => state.socketReducer)
  const [messageText, setMessageText] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const isUserOnline = selectedUser && onlineUserIds.includes(selectedUser._id)



  useEffect(() => {
    if (selectedUser) {
      dispatch(getMessages({ userId: selectedUser._id }))
    }
  }, [dispatch, selectedUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageText.trim() && !selectedFile) return

    try {
      await dispatch(sendMessage({ 
        userId: selectedUser._id, 
        content: messageText,
        file: selectedFile,
        imagePreview: imagePreview,
        userInfo: userInfo
      })).unwrap()
      setMessageText('')
      setSelectedFile(null)
      setImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (!selectedUser) {
    return (
      <div className='flex-1 flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <i className="ri-message-3-line text-6xl text-gray-300 mb-4"></i>
          <p className='text-gray-500 text-lg'>Select a friend to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col bg-gray-50'>
      {/* Chat Header */}
      <div className='bg-white border-b border-gray-200 p-4'>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <div className='w-10 h-10 rounded-full bg-gray-300 overflow-hidden'>
              {selectedUser.profilePic ? (
                <img
                  src={selectedUser.profilePic}
                  alt={`${selectedUser.fullName?.firstName} ${selectedUser.fullName?.lastName}`}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center bg-blue-500'>
                  <i className="ri-user-line text-lg text-white"></i>
                </div>
              )}
            </div>
            {isUserOnline && (
              <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></div>
            )}
          </div>
          <div>
            <h3 className='font-semibold text-gray-800'>
              {selectedUser.fullName?.firstName} {selectedUser.fullName?.lastName}
            </h3>
            <p className={`text-xs ${isUserOnline ? 'text-green-500' : 'text-gray-400'}`}>
              {isUserOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {loading ? (
          <div className='flex justify-center items-center h-full'>
            <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500'></div>
          </div>
        ) : messages.length === 0 ? (
          <div className='flex items-center justify-center h-full'>
            <p className='text-gray-500'>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            // Extract senderId handling both object and string formats
            const messageSenderId = typeof message.senderId === 'object' 
              ? message.senderId?._id 
              : message.senderId
            
            const currentUserId = userInfo?._id
            const isMyMessage = messageSenderId?.toString() === currentUserId?.toString()
            
            // Debug log
            console.log('Message:', { 
              messageSenderId, 
              currentUserId, 
              isMyMessage,
              content: message.content 
            })
            
            return (
              <div
                key={message._id || index}
                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isMyMessage
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt='message attachment'
                      className='rounded mb-2 max-w-full'
                    />
                  )}
                  {message.content && <p className='text-sm'>{message.content}</p>}
                  <p
                    className={`text-xs mt-1 ${
                      isMyMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className='bg-white border-t border-gray-200 p-4'>
        {/* Image Preview */}
        {imagePreview && (
          <div className='mb-3 relative inline-block'>
            <img 
              src={imagePreview} 
              alt='Preview' 
              className='max-h-32 rounded-lg border border-gray-300'
            />
            <button
              onClick={removeImage}
              className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600'
            >
              <i className="ri-close-line"></i>
            </button>
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
          <input
            type='text'
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder='Type a message...'
            className='flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-black'
          />
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*"
            onChange={handleFileSelect}
            id='image' 
            className='hidden'
          />
          <label htmlFor="image" className='cursor-pointer hover:opacity-70'>
            <i className="ri-image-fill text-gray-600 text-3xl"></i>
          </label>
          <button
            type='submit'
            disabled={!messageText.trim() && !selectedFile}
            className={`p-3 rounded-full transition-colors ${
              messageText.trim() || selectedFile
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <i className="ri-send-plane-fill text-xl"></i>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatContainer
