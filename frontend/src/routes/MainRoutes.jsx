import React, { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Login = lazy(() => import('../pages/Login'))
const Home = lazy(() => import('../pages/Home'))
const Register = lazy(() => import('../pages/Register'))
const EditProfile = lazy(() => import('../pages/EditProfile'))
const MyProfile = lazy(() => import('../pages/MyProfile'))
const Friends = lazy(() => import('../pages/Friends'))
const UserProfile = lazy(() => import('../pages/UserProfile'))
const Messages = lazy(() => import('../pages/Messages'))
const Notification = lazy(() => import('../pages/Notification'))


const LoadingFallback = () => (
  <div className='flex items-center justify-center min-h-screen'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
  </div>
)

const MainRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.userReducer)
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path='/' element={isAuthenticated ? <Home /> : <Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/myProfile' element={<MyProfile />} />
        <Route path='/friends' element={<Friends />} />
        <Route path='/userProfile/:userId' element={<UserProfile />} />
        <Route path='/edit-profile' element={<EditProfile />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/notifications' element={<Notification />} />
      </Routes>
    </Suspense>
  )
}

export default MainRoutes