import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getOtherUserInfo } from '../store/otherUserSlice'
import { removeFriend, sendFriendRequest, getFriends } from '../store/friendSlice'
import { removeFriendFromUserInfo } from '../store/userSlice'
import PostModal from '../components/PostModal'

const UserProfile = () => {
    const { userId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { otherUserInfo, loading } = useSelector((state) => state.otherUserReducer)
    const { userInfo } = useSelector((state) => state.userReducer)
    const { sentRequests, receivedRequests } = useSelector((state) => state.friendReducer)
    const [showPostModal, setShowPostModal] = useState(false)
    const [selectedPost, setSelectedPost] = useState(null)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    useEffect(() => {
        if (userId) {
            dispatch(getOtherUserInfo(userId))
        }
        dispatch(getFriends())
    }, [dispatch, userId])

    const handleRemoveFriend = () => {
        setShowConfirmModal(true)
    }

    const confirmRemoveFriend = async () => {
        try {
            dispatch(removeFriendFromUserInfo(userId))
            await dispatch(removeFriend({ userId })).unwrap()
        } catch (error) {
            console.error('Failed to remove friend:', error)
            window.location.reload()
        } finally {
            setShowConfirmModal(false)
        }
    }

    const isFriend = userInfo?.friends?.some(friend => {
        const friendId = typeof friend === 'object' ? friend._id : friend
        return friendId?.toString() === userId?.toString()
    }) || false

    const hasSentRequest = sentRequests?.some(request => {
        const requestId = typeof request === 'object' ? request._id : request
        return requestId?.toString() === userId?.toString()
    }) || false

    const hasReceivedRequest = receivedRequests?.some(request => {
        const requestId = typeof request === 'object' ? request._id : request
        return requestId?.toString() === userId?.toString()
    }) || false

    const handleSendFriendRequest = async () => {
        try {
            await dispatch(sendFriendRequest({ userId })).unwrap()
            dispatch(getFriends())
        } catch (error) {
            console.error('Failed to send friend request:', error)
        }
    }

    console.log('Friend check:', { 
        userId, 
        userInfoFriends: userInfo?.friends,
        isFriend,
        hasSentRequest,
        hasReceivedRequest
    })

    const openPostModal = (post) => {
        setSelectedPost(post)
        setShowPostModal(true)
    }

    if (loading) {
        return (
            <div className='max-w-4xl mx-auto px-4 py-8 flex items-center justify-center'>
                <div className='text-gray-500'>Loading profile...</div>
            </div>
        )
    }

    if (!otherUserInfo) {
        return (
            <div className='max-w-4xl mx-auto px-4 py-8 flex items-center justify-center'>
                <div className='text-gray-500'>User not found</div>
            </div>
        )
    }

    const user = otherUserInfo.user
    const posts = otherUserInfo.posts || []

    return (
        <div className='max-w-5xl mx-auto px-4 py-8'>
            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)}
                className='mb-6 hover:bg-purple-50 px-4 py-2 rounded-xl flex items-center gap-2 transition-all group'
            >
                <i className="ri-arrow-left-line text-xl text-gray-600 group-hover:text-purple-600"></i>
                <span className='font-medium text-gray-700 group-hover:text-purple-600'>Back</span>
            </button>

            {/* Profile Header */}
            <div className='flex items-start gap-10 mb-12'>
                <div className='shrink-0'>
                    <div className='w-40 h-40 rounded-full overflow-hidden bg-linear-to-br from-purple-400 to-pink-400 ring-4 ring-purple-100 shadow-xl'>
                        {user?.profilePic ? (
                            <img src={user.profilePic} alt="profile" className='w-full h-full object-cover' />
                        ) : (
                            <div className='w-full h-full flex items-center justify-center'>
                                <i className="ri-user-line text-7xl text-white"></i>
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex-1'>
                    <div className='flex items-center gap-5 mb-8'>
                        <h2 className='text-3xl font-bold text-gray-900'>
                            {user?.fullName?.firstName} {user?.fullName?.lastName}
                        </h2>
                        {isFriend ? (
                            <button 
                                onClick={handleRemoveFriend}
                                className='px-6 py-2.5 bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:scale-105'
                            >
                                <i className="ri-user-unfollow-line"></i>
                                Remove Friend
                            </button>
                        ) : hasSentRequest ? (
                            <button 
                                disabled
                                className='px-6 py-2.5 bg-gray-300 text-gray-500 rounded-xl font-semibold text-sm flex items-center gap-2 cursor-not-allowed'
                            >
                                <i className="ri-time-line"></i>
                                Pending
                            </button>
                        ) : hasReceivedRequest ? (
                            <button 
                                onClick={() => navigate('/notifications')}
                                className='px-6 py-2.5 bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:scale-105'
                            >
                                <i className="ri-checkbox-circle-line"></i>
                                Respond to Request
                            </button>
                        ) : (
                            <button 
                                onClick={handleSendFriendRequest}
                                className='px-6 py-2.5 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:scale-105'
                            >
                                <i className="ri-user-add-line"></i>
                                Add Friend
                            </button>
                        )}
                    </div>
                    <div className='flex gap-12 mb-6'>
                        <div className='flex gap-2'>
                            <span className='font-bold text-gray-900'>{posts.length}</span>
                            <span className='text-gray-600'>posts</span>
                        </div>
                        <div className='flex gap-2'>
                            <span className='font-bold text-gray-900'>{user?.friends?.length || 0}</span>
                            <span className='text-gray-600'>friends</span>
                        </div>
                    </div>
                    <div>
                        <p className='text-gray-700 whitespace-pre-wrap'>{user?.bio || 'No bio yet'}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className='border-t border-gray-200'>
                <div className='flex justify-center gap-16'>
                    <button className='flex items-center gap-2 py-5 border-t-2 border-purple-600 -mt-0.5'>
                        <i className="ri-grid-fill text-purple-600"></i>
                        <span className='text-xs font-bold tracking-widest text-purple-600'>POSTS</span>
                    </button>
                </div>
            </div>

            {/* Posts Grid */}
            {posts.length > 0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 mt-4 sm:mt-6'>
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            className='relative aspect-square group cursor-pointer rounded-xl overflow-hidden'
                            onClick={() => openPostModal(post)}
                        >
                            <img
                                src={post.imageUrl}
                                alt={post.caption}
                                className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                            />
                            <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 pointer-events-none'>
                                <div className='flex items-center gap-2 text-white font-semibold'>
                                    <i className="ri-heart-fill text-2xl"></i>
                                    <span>{post.likes?.length || 0}</span>
                                </div>
                                <div className='flex items-center gap-2 text-white font-semibold'>
                                    <i className="ri-chat-3-fill text-2xl"></i>
                                    <span>{post.comments?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='mt-16 flex flex-col items-center justify-center py-16'>
                    <div className='w-24 h-24 bg-linear-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-6'>
                        <i className="ri-camera-line text-5xl text-purple-400"></i>
                    </div>
                    <h3 className='text-3xl font-bold text-gray-900 mb-2'>No Posts Yet</h3>
                    <p className='text-sm text-gray-500'>This user hasn't shared any photos.</p>
                </div>
            )}

            {showPostModal && selectedPost && (
                <PostModal
                    post={selectedPost}
                    onClose={() => setShowPostModal(false)}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    isOwner={false}
                    userInfo={userInfo}
                />
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4' onClick={() => setShowConfirmModal(false)}>
                    <div className='bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl' onClick={(e) => e.stopPropagation()}>
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

export default UserProfile