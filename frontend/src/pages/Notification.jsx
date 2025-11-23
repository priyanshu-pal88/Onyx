import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getFriends, acceptFriendRequest, rejectFriendRequest } from '../store/friendSlice'

const Notification = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { receivedRequests, loading } = useSelector((state) => state.friendReducer)

  useEffect(() => {
    dispatch(getFriends())
  }, [dispatch])

  const handleAccept = async (userId) => {
    try {
      await dispatch(acceptFriendRequest({ userId })).unwrap()
      dispatch(getFriends()) 
    } catch (error) {
      console.error('Failed to accept request:', error)
    }
  }

  const handleReject = async (userId) => {
    try {
      await dispatch(rejectFriendRequest({ userId })).unwrap()
    } catch (error) {
      console.error('Failed to reject request:', error)
    }
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-4 sm:py-8'>
      <div className='flex items-center justify-between mb-6 sm:mb-8'>
        <div className='flex items-center gap-2 sm:gap-4'>
          <button 
            onClick={() => navigate(-1)}
            className='hover:bg-purple-50 p-2 rounded-xl transition-all group'
          >
            <i className="ri-arrow-left-line text-xl sm:text-2xl text-gray-600 group-hover:text-purple-600"></i>
          </button>
          <div>
            <h1 className='text-xl sm:text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>Notifications</h1>
            <p className='text-gray-500 text-xs sm:text-sm mt-1'>Manage your friend requests</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className='text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800'>
          <i className="ri-user-add-line text-purple-600"></i>
          Friend Requests
          {receivedRequests && receivedRequests.length > 0 && (
            <span className='bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-md'>
              {receivedRequests.length}
            </span>
          )}
        </h2>

        {loading ? (
          <div className='flex items-center justify-center py-16'>
            <div className='animate-spin rounded-full h-12 w-12 border-2 border-purple-200 border-t-purple-500'></div>
          </div>
        ) : receivedRequests && receivedRequests.length > 0 ? (
          <div className='space-y-4'>
            {receivedRequests.map((user) => (
              <div 
                key={user._id}
                className='bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-xl transition-all duration-300'
              >
                <div className='flex items-center gap-3 sm:gap-4 flex-1 min-w-0'>
                  <div 
                    className='w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-linear-to-br from-purple-400 to-pink-400 overflow-hidden cursor-pointer ring-4 ring-purple-100 hover:ring-purple-200 transition-all shrink-0'
                    onClick={() => navigate(`/userProfile/${user._id}`)}
                  >
                    {user.profilePic ? (
                      <img src={user.profilePic} alt="profile" className='w-full h-full object-cover' />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <i className="ri-user-line text-xl sm:text-2xl text-white"></i>
                      </div>
                    )}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <h3 
                      className='font-bold text-gray-900 cursor-pointer hover:text-purple-600 transition-colors text-sm sm:text-base truncate'
                      onClick={() => navigate(`/userProfile/${user._id}`)}
                    >
                      {user.fullName?.firstName} {user.fullName?.lastName}
                    </h3>
                    <p className='text-gray-500 text-xs sm:text-sm'>wants to be friends</p>
                  </div>
                </div>

                <div className='flex gap-2 sm:gap-3 w-full sm:w-auto'>
                  <button
                    onClick={() => handleAccept(user._id)}
                    className='bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1 sm:gap-2 font-semibold transform hover:scale-105 flex-1 sm:flex-initial text-sm sm:text-base'
                  >
                    <i className="ri-check-line"></i>
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => handleReject(user._id)}
                    className='bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-2 font-semibold flex-1 sm:flex-initial text-sm sm:text-base'
                  >
                    <i className="ri-close-line"></i>
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='bg-white rounded-2xl border border-gray-100 p-16 text-center'>
            <div className='w-20 h-20 bg-linear-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <i className="ri-notification-off-line text-4xl text-purple-400"></i>
            </div>
            <p className='text-gray-800 font-semibold text-lg mb-1'>All caught up!</p>
            <p className='text-gray-500'>No friend requests at the moment</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notification