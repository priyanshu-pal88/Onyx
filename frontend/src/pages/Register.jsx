import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { toast } from 'react-toastify'

const Register = () => {

  const { register, reset, handleSubmit } = useForm()
  const navigate = useNavigate()
  const submitHandler = async (data) => {
    console.log(data)
    try{const { firstName, lastName, email, password } = data
    let bio =""
    const response = await api.post('/auth/register', 
      { fullName: { firstName, lastName },
       email, 
       password,
       bio
    })
    toast.success("Registered Sucessfully")
    reset()}
    catch(error){
      console.log(error)
      toast.error(error.response?.data?.message || "Could not Register User ")
    }
  }

  return (
    <div className='min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-6 sm:py-12'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-6 sm:mb-8'>
          <div className='inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-3 sm:mb-4'>
            <i className="ri-user-add-fill text-2xl sm:text-3xl text-white"></i>
          </div>
          <h2 className='text-2xl sm:text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>Create Account</h2>
          <p className='text-gray-500 text-sm sm:text-base'>Join Socialize to connect with friends</p>
        </div>
        
        <form onSubmit={handleSubmit(submitHandler)} className='bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-4 sm:space-y-5 border border-gray-100'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>First Name</label>
              <input 
                type="text" 
                {...register("firstName")} 
                className='w-full bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 focus:border-purple-400 rounded-xl px-4 py-3 text-gray-900 outline-none transition-all'
                placeholder='John'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Last Name</label>
              <input 
                type="text" 
                {...register("lastName")} 
                className='w-full bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 focus:border-purple-400 rounded-xl px-4 py-3 text-gray-900 outline-none transition-all'
                placeholder='Doe'
              />
            </div>
          </div>
          
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Email Address</label>
            <div className='relative'>
              <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="email" 
                {...register("email")} 
                className='w-full bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 focus:border-purple-400 rounded-xl pl-11 pr-4 py-3 text-gray-900 outline-none transition-all'
                placeholder='you@example.com'
              />
            </div>
          </div>
          
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Password</label>
            <div className='relative'>
              <i className="ri-lock-password-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="password" 
                {...register("password")} 
                className='w-full bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 focus:border-purple-400 rounded-xl pl-11 pr-4 py-3 text-gray-900 outline-none transition-all'
                placeholder='••••••••'
              />
            </div>
          </div>
          
          <button className='w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]'>
            <i className="ri-user-add-line mr-2"></i>
            Create Account
          </button>
          
          <p className='text-center text-gray-600 text-sm'>
            Already have an account? 
            <button type='button' onClick={() => navigate('/login')} className='text-purple-600 font-semibold hover:text-purple-700 ml-1'>
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register