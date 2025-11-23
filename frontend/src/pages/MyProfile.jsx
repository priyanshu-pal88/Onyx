import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getPosts, createPost, editPost, deletePost } from '../store/postSlice'
import PostModal from '../components/PostModal'

const MyProfile = () => {
    const { userInfo } = useSelector((state) => state.userReducer)
    const { posts, loading, createPostLoading } = useSelector((state) => state.postReducer)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showPostModal, setShowPostModal] = useState(false)
    const [selectedPost, setSelectedPost] = useState(null)
    const [caption, setCaption] = useState('')
    const [file, setFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [friendCount, setFriendCount] = useState(userInfo?.friends?.length)

    useEffect(() => {
        
        dispatch(getPosts())
    }, [dispatch])

   

    const handleCreatePost = async (e) => {
        e.preventDefault()
        if (!file) {
            alert('Please select an image')
            return
        }
        try {
            const formData = new FormData()
            formData.append('caption', caption)
            formData.append('file', file)

            await dispatch(createPost(formData)).unwrap()
            setShowCreateModal(false)
            setCaption('')
            setFile(null)
            setImagePreview(null)
            dispatch(getPosts())
        } catch (error) {
            console.log(error)
        }
    }

    const handleEditPost = async (e) => {
        e.preventDefault()
        try {
            await dispatch(editPost({ id: selectedPost._id, caption })).unwrap()
            setShowEditModal(false)
            setSelectedPost(null)
            setCaption('')
            dispatch(getPosts())
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeletePost = async (id) => {
        try {
            await dispatch(deletePost({ id })).unwrap()
            setShowDeleteModal(false)
            setSelectedPost(null)
            dispatch(getPosts())
        } catch (error) {
            console.log(error)
        }
    }

    const openDeleteModal = (post) => {
        setSelectedPost(post)
        setShowDeleteModal(true)
    }

    const openEditModal = (post) => {
        setSelectedPost(post)
        setCaption(post.caption)
        setShowPostModal(false)
        setShowEditModal(true)
    }

    const openPostModal = (post) => {
        setSelectedPost(post)
        setShowPostModal(true)
    }

    const handleEditFromPostModal = (post) => {
        setShowPostModal(false)
        openEditModal(post)
    }

    const handleDeleteFromPostModal = (post) => {
        setShowPostModal(false)
        openDeleteModal(post)
    }

    const userPosts = posts.filter(post => {
        const postUserId = typeof post.userId === 'object' ? post.userId?._id : post.userId
        return postUserId?.toString() === userInfo?._id?.toString()
    })

    console.log('Filtered userPosts:', userPosts)

    return (
        <div className='max-w-5xl mx-auto px-4 py-4 sm:py-8'>
            <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 mb-8 sm:mb-12'>
                <div className='shrink-0'>
                    <div className='w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden bg-linear-to-br from-purple-400 to-pink-400 ring-4 ring-purple-100 shadow-xl'>
                        {userInfo?.profilePic ? (
                            <img src={userInfo.profilePic} alt="profile" className='w-full h-full object-cover' />
                        ) : (
                            <div className='w-full h-full flex items-center justify-center'>
                                <i className="ri-user-line text-7xl text-white"></i>
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex-1 w-full sm:w-auto text-center sm:text-left'>
                    <div className='flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-5 mb-6 sm:mb-8'>
                        <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900'>
                            {userInfo?.fullName?.firstName} {userInfo?.fullName?.lastName}
                        </h2>
                        <button onClick={() => navigate('/edit-profile')} className='px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-900 hover:bg-linear-to-r hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105'>
                            <i className="ri-edit-line mr-2"></i>
                            Edit Profile
                        </button>
                        <button className='p-2.5 hover:bg-gray-100 rounded-xl transition-all'>
                          <i className="ri-settings-3-line text-2xl text-gray-600"></i>
                        </button>
                    </div>
                    <div className='flex gap-6 sm:gap-8 lg:gap-12 mb-4 sm:mb-6 justify-center sm:justify-start'>
                        <div className='flex gap-1 sm:gap-2'>
                            <span className='font-bold text-gray-900 text-sm sm:text-base'>{userPosts.length}</span>
                            <span className='text-gray-600 text-sm sm:text-base'>posts</span>
                        </div>
                        <div className='flex gap-1 sm:gap-2 cursor-pointer group' onClick={()=>navigate('/friends')}>
                            <span className='font-bold text-gray-900 group-hover:text-purple-600 text-sm sm:text-base'>{userInfo?.friends?.length || friendCount }</span>
                            <span className='text-gray-600 group-hover:text-purple-600 text-sm sm:text-base'>Friends</span>
                        </div>
                       
                    </div>
                    <div>
                        <p className='text-gray-700 whitespace-pre-wrap'>{userInfo?.bio || 'No bio yet'}</p>
                    </div>
                </div>
            </div>
            <div className='border-t border-gray-200'>
                <div className='flex justify-center gap-16'>
                    <button className='flex items-center gap-2 py-5 border-t-2 border-purple-600 -mt-0.5'>
                        <i className="ri-grid-fill text-purple-600"></i>
                        <span className='text-xs font-bold tracking-widest text-purple-600'>POSTS</span>
                    </button>
                </div>
            </div>


            {/* Posts Grid */}
            {userPosts.length > 0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 mt-4 sm:mt-6'>
                    {userPosts.map((post) => (
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
                            {/* Delete Confirmation Popup - appears on this post */}
                            {showDeleteModal && selectedPost?._id === post._id ? (
                                <div className='absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-10'>
                                    <div className='bg-white rounded-2xl p-6 w-11/12 max-w-xs'>
                                        <h3 className='text-lg font-bold text-gray-900 mb-2'>Delete Post?</h3>
                                        <p className='text-gray-600 text-sm mb-5'>This action cannot be undone.</p>
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setShowDeleteModal(false)
                                                    setSelectedPost(null)
                                                }}
                                                className='flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 text-sm hover:bg-gray-50 font-semibold'
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeletePost(selectedPost._id)
                                                }}
                                                className='flex-1 px-4 py-2.5 bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl text-sm font-semibold shadow-md'
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
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
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className='mt-16 flex flex-col items-center justify-center py-16'>
                    <div className='w-24 h-24 bg-linear-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-6'>
                        <i className="ri-camera-line text-5xl text-purple-400"></i>
                    </div>
                    <h3 className='text-3xl font-bold text-gray-900 mb-2'>Share Photos</h3>
                    <p className='text-sm text-gray-500 mb-6'>When you share photos, they will appear on your profile.</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className='bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105'
                    >
                        <i className="ri-add-circle-line mr-2"></i>
                        Share your first photo
                    </button>
                </div>
            )}

            {/* Create Post Modal */}
            {showCreateModal && (
                <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl'>
                        <div className='flex justify-between items-center mb-6'>
                            <h3 className='text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>Create New Post</h3>
                            <button onClick={() => setShowCreateModal(false)} className='hover:bg-gray-100 p-2 rounded-xl transition-all'>
                                <i className="ri-close-line text-2xl text-gray-600"></i>
                            </button>
                        </div>
                        <form onSubmit={handleCreatePost}>
                            <div className='mb-5'>
                                <label className='block text-sm font-semibold mb-3 text-gray-700'>Select Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const selectedFile = e.target.files[0]
                                        if (selectedFile) {
                                            setFile(selectedFile)
                                            setImagePreview(URL.createObjectURL(selectedFile))
                                        }
                                    }}
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-gray-900 bg-gray-50 hover:bg-gray-100 focus:bg-white focus:border-purple-400 transition-all'
                                    required
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="preview"
                                        className='w-full h-64 object-cover rounded-2xl mt-4 shadow-md'
                                    />
                                )}
                            </div>
                            <div className='mb-6'>
                                <label className='block text-sm font-semibold mb-3 text-gray-700'>Caption</label>
                                <textarea
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-gray-900 bg-gray-50 hover:bg-gray-100 focus:bg-white focus:border-purple-400 transition-all resize-none'
                                    rows="3"
                                    placeholder='Write a caption...'
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={createPostLoading}
                                className='w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105'
                            >
                                {createPostLoading ? (
                                    <>
                                        <div className='animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent'></div>
                                        <span>Posting...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-send-plane-fill"></i>
                                        <span>Post</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl'>
                        <div className='flex justify-between items-center mb-6'>
                            <h3 className='text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>Edit Post</h3>
                            <button onClick={() => setShowEditModal(false)} className='hover:bg-gray-100 p-2 rounded-xl transition-all'>
                                <i className="ri-close-line text-2xl text-gray-600"></i>
                            </button>
                        </div>
                        <form onSubmit={handleEditPost}>
                            <div className='mb-6'>
                                <img
                                    src={selectedPost?.imageUrl}
                                    alt="post"
                                    className='w-full h-64 object-cover rounded-2xl mb-5 shadow-md'
                                />
                                <label className='block text-sm font-semibold mb-3 text-gray-700'>Caption</label>
                                <textarea
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-gray-900 bg-gray-50 hover:bg-gray-100 focus:bg-white focus:border-purple-400 transition-all resize-none'
                                    rows="3"
                                />
                            </div>
                            <button
                                type="submit"
                                className='w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105'
                            >
                                <i className="ri-check-line mr-2"></i>
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Create Button */}
            {userPosts.length > 0 && (
                <button
                    onClick={() => setShowCreateModal(true)}
                    className='fixed bottom-8 right-8 w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110'
                >
                    <i className="ri-add-line text-4xl"></i>
                </button>
            )}

            {/* Post Detail Modal */}
            {showPostModal && selectedPost && (
                <PostModal
                    post={selectedPost}
                    onClose={() => setShowPostModal(false)}
                    onEdit={handleEditFromPostModal}
                    onDelete={handleDeleteFromPostModal}
                    isOwner={true}
                    userInfo={userInfo}
                />
            )}
        </div>
    )
}

export default MyProfile