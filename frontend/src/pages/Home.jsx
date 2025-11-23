import React from 'react'
import SuggestedFriends from '../components/SuggestedFriends'
import Feed from '../components/Feed'

const Home = () => {
  return (
    <div className='min-h-screen flex flex-col lg:flex-row'>
      {/* Main Content Area */}
      <div className='flex-1 max-w-3xl mx-auto w-full p-4 sm:p-6'>
        <div className='mb-4 sm:mb-6'>
          <h2 className='text-xl sm:text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>Home Feed</h2>
          <p className='text-gray-500 text-xs sm:text-sm mt-1'>Stay connected with your friends</p>
        </div>
        <Feed />
      </div>

      {/* Suggested Friends Sidebar */}
      <SuggestedFriends />
    </div>
  )
}

export default Home