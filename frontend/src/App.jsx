import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import MainRoutes from './routes/MainRoutes'
import NavBar from './components/NavBar'
import { verifyUser } from './store/userSlice'


const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(verifyUser())
  }, [dispatch])

  return (
    <div className='bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900 min-h-screen'>
       <NavBar/>
      
      <MainRoutes/>
    </div>
  )
}

export default App