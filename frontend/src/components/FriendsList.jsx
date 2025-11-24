import React from 'react'

const FriendsList = ({ friends, selectedUser, onSelectUser, loading, onlineUserIds = [] }) => {
  const isUserOnline = (userId) => onlineUserIds.includes(userId)

  return (
    <div className={`w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full ${
      selectedUser ? 'hidden md:flex' : 'flex'
    }`}>
      <div className='p-4 border-b border-gray-200'>
        <h2 className='text-xl font-bold text-gray-800'>Messages</h2>
      </div>

      <div className='flex-1 overflow-y-auto'>
        {loading ? (
          <div className='flex justify-center items-center h-40'>
            <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500'></div>
          </div>
        ) : friends.length === 0 ? (
          <div className='text-center py-8 px-4'>
            <p className='text-gray-500 text-sm'>No friends to message</p>
          </div>
        ) : (
          <ul>
            {friends.map((friend) => (
              <li
                key={friend._id}
                onClick={() => onSelectUser(friend)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedUser?._id === friend._id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <div className='relative'>
                    <div className='w-12 h-12 rounded-full bg-gray-300 overflow-hidden shrink-0'>
                      {friend.profilePic ? (
                        <img
                          src={friend.profilePic}
                          alt={`${friend.fullName?.firstName} ${friend.fullName?.lastName}`}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center bg-blue-500'>
                          <i className="ri-user-line text-xl text-white"></i>
                        </div>
                      )}
                    </div>
                    {isUserOnline(friend._id) && (
                      <div className='absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full'></div>
                    )}
                  </div>

                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-semibold text-gray-800 text-sm truncate'>
                        {friend.fullName?.firstName} {friend.fullName?.lastName}
                      </h3>
                      {isUserOnline(friend._id) && (
                        <span className='text-xs text-green-600 font-medium'>Online</span>
                      )}
                    </div>
                    <p className='text-gray-500 text-xs truncate'>
                      {isUserOnline(friend._id) ? 'Active now' : 'Click to chat'}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default FriendsList
