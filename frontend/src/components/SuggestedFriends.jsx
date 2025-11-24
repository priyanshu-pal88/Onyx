import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getSuggestedUsers, sendFriendRequest } from '../store/friendSlice'

const SuggestedFriends = ({ className = '' }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { suggestedUsers = [], loading, error } = useSelector((state) => state.friendReducer)
  const { userInfo, isAuthenticated } = useSelector((state) => state.userReducer)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    
    if (isAuthenticated) {
      
      dispatch(getSuggestedUsers())
    }
  }, [dispatch, isAuthenticated])



  if (!isAuthenticated) {
    return null
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className='fixed left-0 lg:right-0 lg:left-auto top-1/2 -translate-y-1/2 bg-linear-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-4 rounded-r-2xl lg:rounded-l-2xl lg:rounded-r-none shadow-xl transition-all hover:scale-110 z-50'
        style={{
          animation: 'slideInFromRight 0.3s ease-out'
        }}
        title='Show suggested friends'
      >
        <i className="ri-user-add-line text-xl"></i>
      </button>
    )
  }

  const handleSendRequest = async (userId) => {
    try {

      await dispatch(sendFriendRequest({ userId })).unwrap()
    } catch (err) {
      console.error('Failed to send friend request', err)
    }
  }

  return (
    <aside 
      className={`fixed lg:sticky left-0 lg:left-auto top-0 lg:top-0 bottom-0 lg:bottom-auto w-80 lg:w-80 bg-white/80 backdrop-blur-xl border-r lg:border-r-0 lg:border-l border-gray-100 lg:pt-0 p-4 sm:p-6 overflow-y-auto lg:h-screen shadow-2xl lg:shadow-lg z-40 ${className}`}
      style={{
        animation: 'slideInFromLeft 0.3s ease-out',
        paddingTop: 'max(5rem, env(safe-area-inset-top))'
      }}
    >
      <div className='flex items-center justify-between mb-6 relative'>
        <div>
          <h3 className='text-lg font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>Suggested Friends</h3>
          <p className='text-xs text-gray-500 mt-0.5'>People you may know</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className='text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all z-50 relative'
          title='Close'
        >
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>

      {loading ? (
        <div className='flex justify-center items-center h-40'>
          <div className='animate-spin rounded-full h-10 w-10 border-2 border-purple-200 border-t-purple-500'></div>
        </div>
      ) : suggestedUsers.length === 0 ? (
        <div className='text-center py-8'>
          <div className='w-16 h-16 bg-linear-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-3'>
            <i className="ri-user-search-line text-2xl text-purple-400"></i>
          </div>
          <p className='text-gray-500 text-sm'>No suggestions available</p>
        </div>
      ) : (
        <ul className='space-y-4'>
          {suggestedUsers.map((user) => (
            <li key={user._id} className='pb-4 border-b border-gray-100 last:border-b-0 group'>
              <div className='flex items-start gap-3'>
                <div 
                  onClick={() => navigate(`/userProfile/${user._id}`)}
                  className='w-14 h-14 rounded-full bg-linear-to-br from-purple-400 to-pink-400 overflow-hidden shrink-0 ring-2 ring-purple-100 group-hover:ring-purple-200 transition-all cursor-pointer hover:ring-purple-300'
                >
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={`${user.fullName?.firstName} ${user.fullName?.lastName}`}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <i className="ri-user-line text-2xl text-white"></i>
                    </div>
                  )}
                </div>

                <div className='flex-1 min-w-0'>
                  <h4 
                    onClick={() => navigate(`/userProfile/${user._id}`)}
                    className='font-semibold text-gray-900 text-sm truncate cursor-pointer hover:text-purple-600 transition-colors'
                  >
                    {user.fullName?.firstName} {user.fullName?.lastName}
                  </h4>
                  {user.bio && (
                    <p className='text-gray-500 text-xs truncate mt-0.5'>
                      {user.bio}
                    </p>
                  )}

                  <button
                    onClick={() => handleSendRequest(user._id)}
                    className='mt-2 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-xl transition-all text-xs w-full shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2'
                  >
                    <i className="ri-user-add-line"></i>
                    Add Friend
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

export default SuggestedFriends
