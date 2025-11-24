import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFriends } from '../store/friendSlice'
import { setSelectedUser } from '../store/messageSlice'
import FriendsList from '../components/FriendsList'
import ChatContainer from '../components/ChatContainer'

const Messages = () => {
  const dispatch = useDispatch()
  const { friendsList, loading } = useSelector((state) => state.friendReducer)
  const { selectedUser } = useSelector((state) => state.messageReducer)
  const { onlineUserIds } = useSelector((state) => state.socketReducer)

  useEffect(() => {
    dispatch(getFriends())
  }, [dispatch])

  const handleSelectUser = (user) => {
    dispatch(setSelectedUser(user))
  }

  const handleBackToFriends = () => {
    dispatch(setSelectedUser(null))
  }

  return (
    <div className='h-screen flex bg-gray-50'>
      <FriendsList
        friends={friendsList}
        selectedUser={selectedUser}
        onSelectUser={handleSelectUser}
        loading={loading}
        onlineUserIds={onlineUserIds}
      />
      <ChatContainer 
        selectedUser={selectedUser} 
        onBack={handleBackToFriends}
      />
    </div>
  )
}

export default Messages