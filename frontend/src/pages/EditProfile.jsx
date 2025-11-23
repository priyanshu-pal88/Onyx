import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { updateUser, updateUserOptimistically } from '../store/userSlice'

const EditProfile = () => {
  const { userInfo, loading } = useSelector((state) => state.userReducer)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState(null)

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      firstName: userInfo?.fullName?.firstName || '',
      lastName: userInfo?.fullName?.lastName || '',
      bio: userInfo?.bio || '',
      password: ''
    }
  })

  const onSubmit = async (data) => {
    try {

      const optimisticUpdate = {
        
        fullName: {
          firstName: data.firstName,
          lastName: data.lastName
        },
        bio: data.bio
      }


      if (imagePreview) {
        optimisticUpdate.profilePic = imagePreview
      }

      dispatch(updateUserOptimistically(optimisticUpdate))

      navigate('/myprofile')


      const formData = new FormData()
      formData.append("firstName", data.firstName)
      formData.append("lastName", data.lastName)
      formData.append("bio", data.bio)
      formData.append("password", data.password || "")

      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0])
      }

      dispatch(updateUser(formData))

    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div className='max-w-3xl mx-auto px-4 py-4 sm:py-8'>
      <div className='bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>Edit Profile</h1>
            <p className='text-gray-500 text-xs sm:text-sm mt-1'>Update your profile information</p>
          </div>
          <button
            onClick={() => navigate('/myprofile')}
            className='text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all'
          >
            <i className="ri-close-line text-xl sm:text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5 sm:space-y-6'>
          {/* Profile Picture */}
          <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-8 pb-5 sm:pb-6 border-b border-gray-100'>
            <div className='w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-br from-purple-400 to-pink-400 overflow-hidden ring-4 ring-purple-100'>
              {imagePreview || userInfo?.profilePic ? (
                <img src={imagePreview || userInfo.profilePic} alt="profile" className='w-full h-full object-cover' />
              ) : (
                <div className='w-full h-full flex items-center justify-center'>
                  <i className="ri-user-line text-5xl text-white"></i>
                </div>
              )}
            </div>
            <div className='flex-1'>
              <h3 className='font-semibold text-gray-900 mb-1'>{userInfo?.email}</h3>
              <input
                type="file"
                {...register('image', {
                  onChange: (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const url = URL.createObjectURL(file)
                      setImagePreview(url)
                    }
                  }
                })}
                accept="image/*"
                className='hidden'
                id="profile-image-input"
              />
              <label
                htmlFor="profile-image-input"
                className='inline-flex items-center gap-2 text-purple-600 text-sm font-semibold hover:text-purple-700 cursor-pointer bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-xl transition-all'
              >
                <i className="ri-image-edit-line"></i>
                Change profile photo
              </label>
            </div>
          </div>


          <div>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              First Name
            </label>
            <input
              type="text"
              {...register('firstName', { required: 'First name is required' })}
              className='w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-purple-400 bg-gray-50 hover:bg-gray-100 focus:bg-white text-gray-900 transition-all'
              placeholder='First Name'
            />
            {errors.firstName && (
              <p className='text-red-500 text-sm mt-1.5 flex items-center gap-1'>
                <i className="ri-error-warning-line"></i>
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Last Name
            </label>
            <input
              type="text"
              {...register('lastName', { required: 'Last name is required' })}
              className='w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-purple-400 bg-gray-50 hover:bg-gray-100 focus:bg-white text-gray-900 transition-all'
              placeholder='Last Name'
            />
            {errors.lastName && (
              <p className='text-red-500 text-sm mt-1.5 flex items-center gap-1'>
                <i className="ri-error-warning-line"></i>
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Bio
            </label>
            <textarea
              {...register('bio')}
              rows="4"
              className='w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-purple-400 bg-gray-50 hover:bg-gray-100 focus:bg-white text-gray-900 resize-none transition-all'
              placeholder='Tell us about yourself...'
            />
          </div>

          {/* Password */}
          <div>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              New Password <span className='text-gray-400 font-normal'>(leave blank to keep current)</span>
            </label>
            <div className='relative'>
              <i className="ri-lock-password-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="password"
                {...register('password', {
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className='w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-purple-400 bg-gray-50 hover:bg-gray-100 focus:bg-white text-gray-900 transition-all'
                placeholder='New Password'
              />
            </div>
            {errors.password && (
              <p className='text-red-500 text-sm mt-1.5 flex items-center gap-1'>
                <i className="ri-error-warning-line"></i>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className='flex gap-3 pt-4'>
            <button
              type="submit"
              disabled={loading}
              className='flex-1 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105'
            >
              {loading ? (
                <span className='flex items-center justify-center gap-2'>
                  <i className="ri-loader-4-line animate-spin"></i>
                  Saving...
                </span>
              ) : (
                <span className='flex items-center justify-center gap-2'>
                  <i className="ri-check-line"></i>
                  Save Changes
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/myprofile')}
              className='px-8 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfile