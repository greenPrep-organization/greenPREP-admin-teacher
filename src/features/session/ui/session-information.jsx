import { useState, useEffect } from 'react'
import { Spin } from 'antd'
import PropTypes from 'prop-types'
import { getUserInfo } from '../api'

const SessionInformation = ({ userId }) => {
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await getUserInfo(userId)
        setUserInfo(response.data)
      } catch (err) {
        setError('Failed to fetch student information')
        console.error('Error fetching info:', err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchInfo()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-white shadow-md">
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="text-center text-red-500">{error}</div>
      </div>
    )
  }

  if (!userInfo) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="text-center text-gray-500">No student information available</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-lg font-medium">Student Information</h2>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full Name:</p>
                <p className="font-medium">{`${userInfo.firstName} ${userInfo.lastName}`}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Student Code:</p>
                <p className="font-medium">{userInfo.studentCode || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Class:</p>
                <p className="font-medium">{userInfo.class || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Email:</p>
                <p className="font-medium">{userInfo.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone number:</p>
                <p className="font-medium">{userInfo.phone || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Current Level:</p>
                <p className="font-medium">{userInfo.currentLevel || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-lg font-medium">Academic Information</h2>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Status:</p>
                <p className="font-medium">{userInfo.status || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Join Date:</p>
                <p className="font-medium">{userInfo.joinDate || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Last Test Date:</p>
                <p className="font-medium">{userInfo.lastTestDate || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Total Sessions:</p>
                <p className="font-medium">{userInfo.totalSessions || '0'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

SessionInformation.propTypes = {
  userId: PropTypes.string.isRequired
}

export default SessionInformation
