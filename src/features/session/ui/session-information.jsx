import { useState, useEffect } from 'react'
import { Spin } from 'antd'
import PropTypes from 'prop-types'

const SessionInformation = ({ studentId }) => {
  const [loading, setLoading] = useState(false)
  const [studentInfo, setStudentInfo] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        setLoading(true)
        setError(null)

        const mockData = {
          name: 'A Nguyen',
          id: 'GDD210011',
          class: 'GCD1111',
          email: 'QWER@gmail.com',
          phone: '0123456789',
          dob: '25/03/2025'
        }

        setStudentInfo(mockData)
      } catch (err) {
        setError('Failed to fetch student information')
        console.error('Error fetching student info:', err)
      } finally {
        setLoading(false)
      }
    }

    if (studentId) {
      fetchStudentInfo()
    }
  }, [studentId])

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

  if (!studentInfo) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="text-center text-gray-500">No student information available</div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-medium">Student Information</h2>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Student Name:</p>
              <p className="font-medium">{studentInfo.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">ID:</p>
              <p className="font-medium">{studentInfo.id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Class:</p>
              <p className="font-medium">{studentInfo.class}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Email:</p>
              <p className="font-medium">{studentInfo.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone number:</p>
              <p className="font-medium">{studentInfo.phone}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Date of Birth:</p>
              <p className="font-medium">{studentInfo.dob}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

SessionInformation.propTypes = {
  studentId: PropTypes.string.isRequired
}

export default SessionInformation
