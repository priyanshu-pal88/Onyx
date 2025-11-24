import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../store/userSlice'
import api from '../api/axios'

const NavBar = () => {

    const {isAuthenticated,loading,userInfo} = useSelector((state)=>state.userReducer) 
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [showResults, setShowResults] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const searchRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
          setShowResults(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Search users with debounce
    useEffect(() => {
      const searchUsers = async () => {
        if (searchQuery.trim() === '') {
          setSearchResults([])
          setShowResults(false)
          return
        }

        setSearchLoading(true)
        try {
          const response = await api.get(`/users/search?query=${searchQuery}`)
          setSearchResults(response.data.users)
          setShowResults(true)
        } catch (error) {
          console.log(error)
          setSearchResults([])
        } finally {
          setSearchLoading(false)
        }
      }

      const debounceTimer = setTimeout(searchUsers, 300)
      return () => clearTimeout(debounceTimer)
    }, [searchQuery])

    const handleUserClick = (userId) => {
      if (userId === userInfo._id) {
        navigate('/myProfile')
      } else {
        navigate(`/userProfile/${userId}`)
      }
      setSearchQuery('')
      setShowResults(false)
    }

    const logoutHandler = async() => {
      try{ await dispatch(logoutUser()).unwrap()
        navigate('/')
      }
      catch(err){
        console.log(err)
      }
    }

  return (
    <nav className='flex justify-between items-center px-4 sm:px-6 py-3 sticky top-0 bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100 z-50'>
        {isAuthenticated && (
          <>
            <div onClick={()=>navigate('/')} className='cursor-pointer group flex items-center gap-2 sm:gap-3 shrink-0'>
                <img src="/Onyx1.png" alt="Onyx" className='h-8 sm:h-10 w-8 sm:w-10 object-contain group-hover:scale-110 transition-transform duration-300' />
                <span className='font-bold text-xl sm:text-2xl bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hidden sm:block'>Onyx</span>
            </div>
            <div className='flex flex-1 mx-2 sm:mx-4 md:w-1/2 md:flex-initial max-w-md relative' ref={searchRef}>
                <div className='relative flex items-center w-full'>
                    <i className='ri-search-line absolute left-3 sm:left-4 text-gray-400 text-base sm:text-lg'></i>
                    <input 
                        type="text" 
                        name="search" 
                        placeholder='Search...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='w-full bg-gray-50 hover:bg-gray-100 focus:bg-white rounded-full outline-none border border-gray-200 focus:border-purple-300 pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-700 placeholder-gray-400 transition-all duration-200'
                    />
                </div>
                
                {/* Search Results Dropdown */}
                {showResults && (
                    <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-50 border border-gray-100'>
                        {searchLoading ? (
                            <div className='p-6 text-center'>
                                <div className='animate-spin rounded-full h-8 w-8 border-2 border-purple-200 border-t-purple-500 mx-auto'></div>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className='py-2'>
                                {searchResults.map((user) => (
                                    <div 
                                        key={user._id}
                                        onClick={() => handleUserClick(user._id)}
                                        className='flex items-center gap-3 px-4 py-3 hover:bg-linear-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer transition-all'
                                    >
                                        <div className='w-12 h-12 rounded-full bg-linear-to-br from-purple-400 to-pink-400 overflow-hidden shrink-0 ring-2 ring-white shadow-md'>
                                            {user.profilePic ? (
                                                <img src={user.profilePic} alt="profile" className='w-full h-full object-cover' />
                                            ) : (
                                                <div className='w-full h-full flex items-center justify-center'>
                                                    <i className="ri-user-line text-xl text-white"></i>
                                                </div>
                                            )}
                                        </div>
                                        <div className='flex-1'>
                                            <h3 className='font-semibold text-gray-900'>
                                                {user.fullName.firstName} {user.fullName.lastName}
                                            </h3>
                                            {user.bio && (
                                                <p className='text-xs text-gray-500 truncate'>{user.bio}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='p-6 text-center text-gray-500'>
                                <i className="ri-user-search-line text-3xl mb-2"></i>
                                <p>No users found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
          </>
        )}
            {
                !loading && (
                    isAuthenticated ? (
                        <>
                        {/* Desktop Navigation */}
                        <div className='hidden md:flex items-center gap-2'>
                            <button onClick={()=>navigate('/notifications')} className='p-2.5 hover:bg-purple-50 rounded-xl transition-all group' title='Notifications'>
                              <i className="ri-notification-3-fill text-xl text-gray-600 group-hover:text-purple-600"></i>
                            </button>
                            <button onClick={() => navigate('/myprofile')} className='p-2.5 hover:bg-purple-50 rounded-xl transition-all group' title='Profile'>
                              <i className="ri-user-3-fill text-xl text-gray-600 group-hover:text-purple-600"></i>
                            </button>
                            <button onClick={()=>navigate('/friends')} className='p-2.5 hover:bg-purple-50 rounded-xl transition-all group' title='Friends'>
                              <i className="ri-team-fill text-xl text-gray-600 group-hover:text-purple-600"></i>
                            </button>
                            <button onClick={()=>navigate('/messages')} className='p-2.5 hover:bg-purple-50 rounded-xl transition-all group' title='Messages'>
                              <i className="ri-messenger-fill text-xl text-gray-600 group-hover:text-purple-600"></i>
                            </button>
                            <button onClick={logoutHandler} className='ml-2 px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300' title='Logout'>
                              <i className="ri-logout-box-r-line mr-1"></i>
                              Logout
                            </button>
                        </div>
                        {/* Mobile Menu Button */}
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className='md:hidden p-2 hover:bg-purple-50 rounded-xl transition-all'>
                          <i className={`text-2xl text-gray-600 ${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
                        </button>
                        </>
                    ) : (
                        <div className='flex gap-2 sm:gap-3'>
                            <button onClick={() => navigate('/login')} className='px-3 sm:px-5 py-2 text-sm sm:text-base text-purple-600 hover:bg-purple-50 rounded-xl font-semibold transition-all'>Login</button>
                            <button onClick={() => navigate('/register')} className='px-3 sm:px-5 py-2 text-sm sm:text-base bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300'>Sign Up</button>
                        </div>
                    )
                )
            }
            
            {/* Mobile Menu Dropdown */}
            {isAuthenticated && mobileMenuOpen && (
              <div className='md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg'>
                <div className='px-4 py-3 space-y-2'>
                  <button onClick={()=>{navigate('/notifications'); setMobileMenuOpen(false)}} className='w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 rounded-xl transition-all text-left'>
                    <i className="ri-notification-3-fill text-xl text-gray-600"></i>
                    <span className='font-medium text-gray-900'>Notifications</span>
                  </button>
                  <button onClick={()=>{navigate('/myprofile'); setMobileMenuOpen(false)}} className='w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 rounded-xl transition-all text-left'>
                    <i className="ri-user-3-fill text-xl text-gray-600"></i>
                    <span className='font-medium text-gray-900'>Profile</span>
                  </button>
                  <button onClick={()=>{navigate('/friends'); setMobileMenuOpen(false)}} className='w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 rounded-xl transition-all text-left'>
                    <i className="ri-team-fill text-xl text-gray-600"></i>
                    <span className='font-medium text-gray-900'>Friends</span>
                  </button>
                  <button onClick={()=>{navigate('/messages'); setMobileMenuOpen(false)}} className='w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 rounded-xl transition-all text-left'>
                    <i className="ri-messenger-fill text-xl text-gray-600"></i>
                    <span className='font-medium text-gray-900'>Messages</span>
                  </button>
                  <button onClick={()=>{logoutHandler(); setMobileMenuOpen(false)}} className='w-full flex items-center gap-3 px-4 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-xl transition-all text-left font-medium'>
                    <i className="ri-logout-box-r-line text-xl"></i>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}

        
        
    </nav>
  )
}

export default NavBar