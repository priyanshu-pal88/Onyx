import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getFriends, removeFriend } from '../store/friendSlice'
import { removeFriendFromUserInfo } from '../store/userSlice'

const Friends = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { friendsList, loading } = useSelector((state) => state.friendReducer)
    const [showConfirmModal, setShowConfirmModal] = React.useState(false)
    const [friendToRemove, setFriendToRemove] = React.useState(null)

    useEffect(() => {
        dispatch(getFriends())
    }, [dispatch])

    const handleRemoveFriend = (e, friendId) => {
        e.stopPropagation()
        setFriendToRemove(friendId)
        setShowConfirmModal(true)
    }

    const confirmRemoveFriend = async () => {
        try {
            dispatch(removeFriendFromUserInfo(friendToRemove))
            await dispatch(removeFriend({ userId: friendToRemove })).unwrap()
        } catch (error) {
            console.error('Failed to remove friend:', error)
        } finally {
            setShowConfirmModal(false)
            setFriendToRemove(null)
        }
    }

    return (
        <div className='max-w-6xl mx-auto px-4 py-4 sm:py-8'>
            
            <div className='flex items-center justify-between mb-6 sm:mb-8'>
                <div className='flex items-center gap-2 sm:gap-4'>
                    <button 
                        onClick={() => navigate(-1)}
                        className='hover:bg-purple-50 p-2 rounded-xl transition-all group'
                    >
                        <i className="ri-arrow-left-line text-xl sm:text-2xl text-gray-600 group-hover:text-purple-600"></i>
                    </button>
                    <div>
                      <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>Friends</h1>
                      <p className='text-gray-500 text-xs sm:text-sm mt-1'>Your connections</p>
                    </div>
                </div>
            </div>

            {/* Friends List */}
            {loading ? (
                <div className='flex items-center justify-center py-16'>
                    <div className='animate-spin rounded-full h-12 w-12 border-2 border-purple-200 border-t-purple-500'></div>
                </div>
            ) : friendsList && friendsList.length > 0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5'>
                    {friendsList.map((friend) => (
                        <div 
                            key={friend._id} 
                            className='bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center hover:shadow-xl transition-all duration-300 cursor-pointer relative group transform hover:scale-105'
                            onClick={() => navigate(`/userProfile/${friend._id}`)}
                        >
                            <button
                                onClick={(e) => handleRemoveFriend(e, friend._id)}
                                className='absolute top-3 right-3 text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 shadow-md'
                                title='Remove friend'
                            >
                                <i className="ri-user-unfollow-line text-base"></i>
                            </button>
                            <div className='w-24 h-24 rounded-full bg-linear-to-br from-purple-400 to-pink-400 overflow-hidden mb-4 ring-4 ring-purple-100'>
                                {friend.profilePic ? (
                                    <img src={friend.profilePic} alt="profile" className='w-full h-full object-cover' />
                                ) : (
                                    <div className='w-full h-full flex items-center justify-center'>
                                        <i className="ri-user-line text-4xl text-white"></i>
                                    </div>
                                )}
                            </div>
                            <h3 className='font-bold text-gray-900 text-center mb-1'>
                                {friend.fullName?.firstName} {friend.fullName?.lastName}
                            </h3>
                            <p className='text-gray-500 text-sm text-center'>@{friend.email?.split('@')[0]}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='mt-12 flex flex-col items-center justify-center py-16'>
                    <div className='w-24 h-24 bg-linear-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-6'>
                        <i className="ri-user-heart-line text-5xl text-purple-400"></i>
                    </div>
                    <h3 className='text-3xl font-bold text-gray-900 mb-2'>No Friends Yet</h3>
                    <p className='text-sm text-gray-500'>Start connecting with people to see them here.</p>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4' onClick={() => setShowConfirmModal(false)}>
                    <div className='bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform scale-100 animate-[fadeIn_0.2s_ease-out]' onClick={(e) => e.stopPropagation()}>
                        <div className='flex items-center gap-4 mb-6'>
                            <div className='w-14 h-14 rounded-full bg-red-100 flex items-center justify-center'>
                                <i className="ri-user-unfollow-fill text-2xl text-red-500"></i>
                            </div>
                            <h3 className='text-xl font-bold text-gray-900'>Remove Friend?</h3>
                        </div>
                        <p className='text-gray-600 mb-8'>Are you sure you want to remove this friend? This action cannot be undone.</p>
                        <div className='flex gap-3'>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className='flex-1 px-5 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold transition-all'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRemoveFriend}
                                className='flex-1 px-5 py-3 bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all'
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Friends