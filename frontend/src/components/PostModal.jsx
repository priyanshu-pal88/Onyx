import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPosts, likePost } from '../store/postSlice'
import { getComments, createComment, editComment, deleteComment } from '../store/commentSlice'

const PostModal = ({ post, onClose, onEdit, onDelete, isOwner, userInfo }) => {
    const [showMenu, setShowMenu] = useState(false)
    // const [isLiked, setIsLiked] = useState(post.likes?.includes(userInfo?._id))
    const [isLiked, setIsLiked] = useState(
        post.likes?.some(id => id?.toString() === userInfo?._id)
    )
    const [likeCount, setLikeCount] = useState(post.likes?.length || 0)
    const [commentText, setCommentText] = useState('')
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editingCommentText, setEditingCommentText] = useState('')
    const [commentMenuId, setCommentMenuId] = useState(null)

    const dispatch = useDispatch()
    const { comments, loading } = useSelector((state) => state.commentReducer)

    useEffect(() => {
        dispatch(getComments({ postId: post._id }))
    }, [dispatch, post._id,setCommentText])

    useEffect(() => {
        setIsLiked(post.likes?.some(id => id?.toString() === userInfo?._id?.toString()))
        setLikeCount(post.likes?.length || 0)
    }, [post.likes, userInfo?._id])

    const handleLike = async () => {

        const wasLiked = isLiked
        const prevCount = likeCount
        
        setIsLiked(!isLiked)
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
        
        try {
            await dispatch(likePost({ id: post._id, userId: userInfo?._id })).unwrap()
            
        } catch (error) {
            // Rollback on error
            setIsLiked(wasLiked)
            setLikeCount(prevCount)
            console.log(error)
        }
    }

    const handleCreateComment = async (e) => {
        e.preventDefault()
        if (!commentText.trim()) return
        try {
            await dispatch(createComment({ postId: post._id, text: commentText , userInfo})).unwrap()
            setCommentText('')
            
        } catch (error) {
            console.log(error)
        }
    }

    const handleEditComment = async (commentId) => {
        if (!editingCommentText.trim()) return
        try {
            await dispatch(editComment({ id: commentId, text: editingCommentText })).unwrap()
            setEditingCommentId(null)
            setEditingCommentText('')
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            await dispatch(deleteComment({ id: commentId, postId: post._id })).unwrap()
        } catch (error) {
            console.log(error)
        }
    }

    const startEditComment = (comment) => {
        setEditingCommentId(comment._id)
        setEditingCommentText(comment.text)
        setCommentMenuId(null)
    }

    return (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4' onClick={onClose}>
            <div className='bg-white rounded-2xl sm:rounded-3xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col sm:flex-row overflow-hidden shadow-2xl' onClick={(e) => e.stopPropagation()}>

                <div className='w-full sm:w-3/5 bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2 sm:p-4'>
                    <img
                        src={post.imageUrl}
                        alt={post.caption}
                        className='max-w-full max-h-[40vh] sm:max-h-[90vh] object-contain rounded-xl sm:rounded-2xl shadow-lg'
                    />
                </div>

                <div className='w-full sm:w-2/5 flex flex-col bg-white max-h-[55vh] sm:max-h-full'>

                    <div className='flex items-center justify-between p-5 border-b border-gray-100'>
                        <div className='flex items-center gap-3'>
                            <div className='w-11 h-11 rounded-full bg-linear-to-br from-purple-400 to-pink-400 overflow-hidden ring-2 ring-purple-100'>
                                {post.user?.profilePic ? (
                                    <img src={post.user.profilePic} alt="profile" className='w-full h-full object-cover' />
                                ) : (
                                    <div className='w-full h-full flex items-center justify-center'>
                                        <i className="ri-user-line text-xl text-white"></i>
                                    </div>
                                )}
                            </div>
                            <span className='font-bold text-gray-900'>
                                {post.user?.fullName?.firstName} {post.user?.fullName?.lastName}
                            </span>
                        </div>
                        {isOwner && (
                            <div className='relative'>
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className='text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-xl transition-all'
                                >
                                    <i className="ri-more-fill text-xl"></i>
                                </button>
                                {showMenu && (
                                    <div className='absolute right-0 top-12 bg-white shadow-xl rounded-2xl py-2 w-36 z-10 border border-gray-100'>
                                        <button
                                            onClick={() => {
                                                onEdit(post)
                                                setShowMenu(false)
                                            }}
                                            className='w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-900 font-medium flex items-center gap-2'
                                        >
                                            <i className="ri-edit-line"></i>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                onDelete(post)
                                                setShowMenu(false)
                                            }}
                                            className='w-full px-4 py-2.5 text-left hover:bg-red-50 text-red-500 font-medium flex items-center gap-2'
                                        >
                                            <i className="ri-delete-bin-line"></i>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className='flex-1 overflow-y-auto p-5'>

                        {post.caption && (
                            <div className='flex gap-3 mb-6 pb-5 border-b border-gray-100'>
                                <div className='w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-400 overflow-hidden shrink-0 ring-2 ring-purple-100'>
                                    {post.user?.profilePic ? (
                                        <img src={post.user.profilePic} alt="profile" className='w-full h-full object-cover' />
                                    ) : (
                                        <div className='w-full h-full flex items-center justify-center'>
                                            <i className="ri-user-line text-xl text-white"></i>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <span className='font-bold text-gray-900 mr-2'>
                                        {post.user?.fullName?.firstName} {post.user?.fullName?.lastName}
                                    </span>
                                    <span className='text-gray-700'>{post.caption}</span>
                                </div>
                            </div>
                        )}

                        <div className='space-y-4'>
                            {comments.map((comment) => (
                                <div key={comment._id} className='flex gap-3 group'>
                                    <div className='w-9 h-9 rounded-full bg-linear-to-br from-purple-400 to-pink-400 overflow-hidden shrink-0 ring-2 ring-purple-100'>
                                        {(comment.userId?.profilePic || comment.user?.profilePic) ? (
                                            <img src={comment.userId?.profilePic || comment.user?.profilePic} alt="profile" className='w-full h-full object-cover' />
                                        ) : (
                                            <div className='w-full h-full flex items-center justify-center'>
                                                <i className="ri-user-line text-base text-white"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className='flex-1'>
                                        <div className='flex items-start justify-between'>
                                            <div className='flex-1'>
                                                <span className='font-semibold text-gray-900 text-sm mr-2'>
                                                    {comment.userId?.fullName?.firstName || comment.user?.fullName?.firstName} {comment.userId?.fullName?.lastName || comment.user?.fullName?.lastName}
                                                </span>
                                                {editingCommentId === comment._id ? (
                                                    <div className='mt-2'>
                                                        <input
                                                            type="text"
                                                            value={editingCommentText}
                                                            onChange={(e) => setEditingCommentText(e.target.value)}
                                                            className='w-full px-3 py-2 border border-purple-300 rounded-xl text-gray-900 text-sm outline-none focus:border-purple-400 bg-purple-50'
                                                            autoFocus
                                                        />
                                                        <div className='flex gap-2 mt-2'>
                                                            <button
                                                                onClick={() => handleEditComment(comment._id)}
                                                                className='text-purple-600 text-xs font-bold hover:text-purple-700'
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingCommentId(null)
                                                                    setEditingCommentText('')
                                                                }}
                                                                className='text-gray-500 text-xs font-bold hover:text-gray-700'
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className='text-gray-700 text-sm'>{comment.text}</span>
                                                )}
                                            </div>
                                            {/* Check if comment belongs to current user */}
                                            {(() => {
                                                const commentUserId = typeof comment.userId === 'object' ? comment.userId?._id : comment.userId
                                                const commentUserIdAlt = comment.user?._id
                                                const currentUserId = userInfo?._id
                                                const isCommentOwner = commentUserId?.toString() === currentUserId?.toString() || 
                                                                      commentUserIdAlt?.toString() === currentUserId?.toString()
                                                
                                                return isCommentOwner && editingCommentId !== comment._id && (
                                                    <div className='relative opacity-0 group-hover:opacity-100 transition-opacity'>
                                                        <button
                                                            onClick={() => setCommentMenuId(commentMenuId === comment._id ? null : comment._id)}
                                                            className='text-gray-400 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-lg'
                                                        >
                                                            <i className="ri-more-fill"></i>
                                                        </button>
                                                        {commentMenuId === comment._id && (
                                                            <div className='absolute right-0 top-8 bg-white shadow-xl rounded-xl py-1.5 w-28 z-10 border border-gray-100'>
                                                                <button
                                                                    onClick={() => startEditComment(comment)}
                                                                    className='w-full px-3 py-2 text-left hover:bg-gray-50 text-gray-900 text-sm font-medium flex items-center gap-2'
                                                                >
                                                                    <i className="ri-edit-line"></i>
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        handleDeleteComment(comment._id)
                                                                        setCommentMenuId(null)
                                                                    }}
                                                                    className='w-full px-3 py-2 text-left hover:bg-red-50 text-red-500 text-sm font-medium flex items-center gap-2'
                                                                >
                                                                    <i className="ri-delete-bin-line"></i>
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {comments.length === 0 && !loading && (
                                <div className='text-center py-8'>
                                    <i className="ri-chat-3-line text-4xl text-gray-300 mb-2"></i>
                                    <p className='text-gray-400 text-sm'>No comments yet. Be the first to comment!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='border-t border-gray-100 p-5'>
                        <div className='flex items-center gap-5 mb-3'>
                            <button onClick={handleLike} className='hover:scale-110 transition-transform'>
                                {isLiked ? (
                                    <i className="ri-heart-fill text-3xl text-pink-500"></i>
                                ) : (
                                    <i className="ri-heart-line text-3xl text-gray-700 hover:text-pink-500"></i>
                                )}
                            </button>
                            <button className='hover:scale-110 transition-transform'>
                                <i className="ri-chat-3-line text-3xl text-gray-700 hover:text-purple-500"></i>
                            </button>
                            <button className='hover:scale-110 transition-transform'>
                                <i className="ri-send-plane-line text-3xl text-gray-700 hover:text-purple-500"></i>
                            </button>
                            <button className='ml-auto hover:scale-110 transition-transform'>
                                <i className="ri-bookmark-line text-3xl text-gray-700 hover:text-purple-500"></i>
                            </button>
                        </div>
                        <p className='font-bold text-gray-900 text-sm mb-1'>
                            {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                        </p>
                        <p className='text-gray-400 text-xs uppercase tracking-wide'>
                            {new Date(post.createdAt).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                            })}
                        </p>
                    </div>

                    <div className='border-t border-gray-100 p-5 flex items-center gap-3'>
                        <input
                            type="text"
                            placeholder='Add a comment...'
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCreateComment(e)}
                            className='flex-1 outline-none text-gray-900 placeholder-gray-400 bg-gray-50 px-4 py-2.5 rounded-full border border-gray-200 focus:border-purple-400 focus:bg-white transition-all'
                        />
                        <button
                            onClick={handleCreateComment}
                            disabled={!commentText.trim()}
                            className={`font-bold text-sm px-4 py-2.5 rounded-full transition-all ${commentText.trim() ? 'text-white bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg' : 'text-gray-300 bg-gray-100'}`}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostModal
