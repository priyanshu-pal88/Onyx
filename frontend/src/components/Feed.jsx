import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getFeedPosts, likePost } from '../store/postSlice'
import { getComments, createComment, editComment, deleteComment } from '../store/commentSlice'

const Feed = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { feedPosts, feedLoading, pagination } = useSelector((state) => state.postReducer)
  const { userInfo } = useSelector((state) => state.userReducer)
  const { comments } = useSelector((state) => state.commentReducer)
  const [page, setPage] = useState(1)
  const [showComments, setShowComments] = useState({})
  const [commentTexts, setCommentTexts] = useState({})
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingCommentText, setEditingCommentText] = useState('')

  useEffect(() => {
    dispatch(getFeedPosts({ page, limit: 10 }))
  }, [dispatch, page])

  const handleLike = async (postId) => {
    try {
      await dispatch(likePost({ id: postId, userId: userInfo._id })).unwrap()
    } catch (error) {
      console.log(error)
    }
  }

  const toggleComments = (postId) => {
    const isShowing = showComments[postId]
    setShowComments(prev => ({
      ...prev,
      [postId]: !isShowing
    }))
    
    if (!isShowing) {
      dispatch(getComments({ postId }))
    }
  }

  const handleCreateComment = async (e, postId) => {
    e.preventDefault()
    const commentText = commentTexts[postId]
    if (!commentText?.trim()) return
    
    try {
      await dispatch(createComment({ postId, text: commentText, userInfo })).unwrap()
      setCommentTexts(prev => ({
        ...prev,
        [postId]: ''
      }))
    } catch (error) {
      console.log(error)
    }
  }

  const handleEditComment = async (commentId) => {
    if (!editingCommentText?.trim()) return
    
    try {
      await dispatch(editComment({ id: commentId, text: editingCommentText })).unwrap()
      setEditingCommentId(null)
      setEditingCommentText('')
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteComment = async (commentId, postId) => {
    try {
      await dispatch(deleteComment({ id: commentId, postId })).unwrap()
    } catch (error) {
      console.log(error)
    }
  }

  const startEditingComment = (comment) => {
    setEditingCommentId(comment._id)
    setEditingCommentText(comment.text)
  }

  const cancelEditingComment = () => {
    setEditingCommentId(null)
    setEditingCommentText('')
  }

  const loadMore = () => {
    if (pagination?.hasMore) {
      setPage(prev => prev + 1)
    }
  }

  if (feedLoading && page === 1) {
    return (
      <div className='flex items-center justify-center py-16'>
        <div className='animate-spin rounded-full h-10 w-10 border-2 border-purple-200 border-t-purple-500'></div>
      </div>
    )
  }

  return (
    <div className='space-y-4 sm:space-y-6 pb-6'>
      {feedPosts && feedPosts.length > 0 ? (
        <>
          {feedPosts.map((post) => (
            <div key={post._id} className='bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden'>
              {/* Post Header */}
              <div className='p-3 sm:p-4 flex items-center gap-2 sm:gap-3'>
                <div 
                  className='w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-linear-to-br from-purple-400 to-pink-400 overflow-hidden cursor-pointer ring-2 ring-purple-100 hover:ring-purple-200 transition-all'
                  onClick={() => {
                    if (post.userId._id === userInfo._id) {
                      navigate('/myProfile')
                    } else {
                      navigate(`/userProfile/${post.userId._id}`)
                    }
                  }}
                >
                  {post.userId.profilePic ? (
                    <img src={post.userId.profilePic} alt="profile" className='w-full h-full object-cover' />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <i className="ri-user-line text-xl text-white"></i>
                    </div>
                  )}
                </div>
                <div className='flex-1 min-w-0'>
                  <h3 
                    className='font-semibold text-sm sm:text-base text-gray-900 cursor-pointer hover:text-purple-600 transition-colors truncate'
                    onClick={() => {
                      if (post.userId._id === userInfo._id) {
                        navigate('/myProfile')
                      } else {
                        navigate(`/userProfile/${post.userId._id}`)
                      }
                    }}
                  >
                    {post.userId.fullName?.firstName} {post.userId.fullName?.lastName}
                  </h3>
                  <p className='text-xs text-gray-500'>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Post Image */}
              {post.imageUrl && (
                <div className='w-full'>
                  <img src={post.imageUrl} alt="post" className='w-full max-h-[350px] sm:max-h-[450px] md:max-h-[500px] object-cover' />
                </div>
              )}

              {/* Post Actions */}
              <div className='p-3 sm:p-4'>
                <div className='flex items-center gap-4 sm:gap-6 mb-3'>
                  <button
                    onClick={() => handleLike(post._id)}
                    className='flex items-center gap-1.5 sm:gap-2 hover:scale-110 transition-transform group'
                  >
                    <i className={`text-xl sm:text-2xl ${post.likes?.some(id => id?.toString() === userInfo._id?.toString()) ? 'ri-heart-fill text-pink-500' : 'ri-heart-line text-gray-600 group-hover:text-pink-500'}`}></i>
                    <span className='text-xs sm:text-sm font-semibold text-gray-700'>{post.likes?.length || 0}</span>
                  </button>
                  <button 
                    onClick={() => toggleComments(post._id)}
                    className='flex items-center gap-1.5 sm:gap-2 hover:scale-110 transition-transform group'
                  >
                    <i className="ri-chat-3-line text-xl sm:text-2xl text-gray-600 group-hover:text-purple-500"></i>
                    <span className='text-xs sm:text-sm font-semibold text-gray-700'>{post.comments?.length || 0}</span>
                  </button>
                </div>

                {/* Post Caption */}
                {post.caption && (
                  <p className='text-sm sm:text-base text-gray-800 mb-2'>
                    <span className='font-semibold mr-2 text-gray-900'>
                      {post.userId.fullName?.firstName} {post.userId.fullName?.lastName}
                    </span>
                    {post.caption}
                  </p>
                )}

                {/* View Comments */}
                {post.comments && post.comments.length > 0 && (
                  <button 
                    onClick={() => toggleComments(post._id)}
                    className='text-sm text-gray-500 hover:text-purple-600 font-medium'
                  >
                    {showComments[post._id] ? 'Hide' : 'View all'} {post.comments.length} comments
                  </button>
                )}

                {/* Comments Section */}
                {showComments[post._id] && (
                  <div className='mt-3 sm:mt-4 border-t border-gray-100 pt-3 sm:pt-4'>
                    {/* Scrollable Comments List */}
                    <div className='max-h-48 sm:max-h-60 overflow-y-auto space-y-2 sm:space-y-3 mb-3 pr-2'>
                      {comments
                        .filter(comment => comment.postId === post._id)
                        .map((comment) => (
                          <div key={comment._id} className='flex gap-2 sm:gap-3 group'>
                            <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-purple-400 to-pink-400 overflow-hidden shrink-0 ring-2 ring-purple-50'>
                              {(comment.userId?.profilePic || comment.user?.profilePic) ? (
                                <img src={comment.userId?.profilePic || comment.user?.profilePic} alt="profile" className='w-full h-full object-cover' />
                              ) : (
                                <div className='w-full h-full flex items-center justify-center'>
                                  <i className="ri-user-line text-sm text-white"></i>
                                </div>
                              )}
                            </div>
                            <div className='flex-1'>
                              {editingCommentId === comment._id ? (
                                <div className='flex items-center gap-1.5 sm:gap-2'>
                                  <input
                                    type="text"
                                    value={editingCommentText}
                                    onChange={(e) => setEditingCommentText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleEditComment(comment._id)}
                                    className='flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-purple-300 rounded-xl outline-none focus:border-purple-400 text-xs sm:text-sm bg-purple-50'
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleEditComment(comment._id)}
                                    className='text-purple-600 hover:text-purple-700 text-xs font-semibold px-2'
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={cancelEditingComment}
                                    className='text-gray-500 hover:text-gray-600 text-xs font-semibold px-2'
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  <div className='flex items-start justify-between gap-1 sm:gap-2'>
                                    <div className='bg-gray-50 rounded-2xl px-2 sm:px-3 py-1.5 sm:py-2 flex-1'>
                                      <span className='font-semibold text-gray-900 text-xs sm:text-sm mr-1 sm:mr-2'>
                                        {comment.userId?.fullName?.firstName || comment.user?.fullName?.firstName} {comment.userId?.fullName?.lastName || comment.user?.fullName?.lastName}
                                      </span>
                                      <span className='text-gray-700 text-xs sm:text-sm'>{comment.text}</span>
                                    </div>
                                    {(comment.userId?._id === userInfo._id || comment.user?._id === userInfo._id) && (
                                      <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                                        <button
                                          onClick={() => startEditingComment(comment)}
                                          className='text-gray-400 hover:text-purple-500 p-1'
                                          title='Edit comment'
                                        >
                                          <i className="ri-edit-line text-sm"></i>
                                        </button>
                                        <button
                                          onClick={() => handleDeleteComment(comment._id, post._id)}
                                          className='text-gray-400 hover:text-red-500 p-1'
                                          title='Delete comment'
                                        >
                                          <i className="ri-delete-bin-line text-sm"></i>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                    
                    {/* Add Comment Input */}
                    <div className='flex items-center gap-1.5 sm:gap-2 mt-3'>                     <input
                        type="text"
                        placeholder='Add a comment...'
                        value={commentTexts[post._id] || ''}
                        onChange={(e) => setCommentTexts(prev => ({
                          ...prev,
                          [post._id]: e.target.value
                        }))}
                        onKeyPress={(e) => e.key === 'Enter' && handleCreateComment(e, post._id)}
                        className='flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-full outline-none focus:border-purple-400 focus:bg-white text-xs sm:text-sm transition-all'
                      />
                      <button
                        onClick={(e) => handleCreateComment(e, post._id)}
                        disabled={!commentTexts[post._id]?.trim()}
                        className={`font-semibold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all ${commentTexts[post._id]?.trim() ? 'text-purple-600 hover:bg-purple-50' : 'text-gray-300'}`}
                      >                       Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Load More Button */}
          {pagination?.hasMore && (
            <div className='flex justify-center py-4'>
              <button
                onClick={loadMore}
                disabled={feedLoading}
                className='bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 transform hover:scale-105'
              >
                {feedLoading ? (
                  <span className='flex items-center gap-2'>
                    <i className="ri-loader-4-line animate-spin"></i>
                    Loading...
                  </span>
                ) : (
                  <span className='flex items-center gap-2'>
                    <i className="ri-arrow-down-line"></i>
                    Load More
                  </span>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className='bg-white rounded-2xl shadow-md p-16 text-center border border-gray-100'>
          <div className='w-20 h-20 bg-linear-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <i className="ri-image-line text-4xl text-purple-400"></i>
          </div>
          <p className='text-gray-800 text-xl font-semibold mb-2'>No posts yet</p>
          <p className='text-gray-500 text-sm'>Start following people to see their posts</p>
        </div>
      )}
    </div>
  )
}

export default Feed
