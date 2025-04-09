import { Avatar, Breadcrumb, message, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import SessionHistory from '@features/session/ui/session-history'
import SessionInformation from '@features/session/ui/session-information'
import { fetchStudentProfile } from '@features/student-profile/api'
import { getDefaultAvatar } from '@shared/lib/utils/avatarUtils'

export default function StudentProfilePage() {
  const { studentId } = useParams()
  const navigate = useNavigate()

  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (studentId) {
      setLoading(true)
      fetchStudentProfile(studentId)
        .then(data => {
          setStudent(data)
        })
        .catch(() => {
          message.error('Failed to load student profile')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [studentId])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Breadcrumb separator="/">
                <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item>Classes</Breadcrumb.Item>
                <Breadcrumb.Item>CLASS01</Breadcrumb.Item>
                <Breadcrumb.Item>Feb_2025</Breadcrumb.Item>
                <Breadcrumb.Item>{student?.name || 'Student'}</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <button
            className="mb-4 flex items-center gap-1 rounded bg-[#002B5B] px-4 py-1 text-sm font-medium text-white hover:bg-[#002B5B]/90"
            onClick={() => navigate(-1)}
          >
            Back
          </button>

          <h1 className="mb-6 text-2xl font-bold">Student Details</h1>

          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SessionInformation userId={studentId} />
            </div>

            <div className="lg:col-span-1">
              <div className="flex items-center justify-center overflow-hidden rounded-lg bg-white p-4 shadow-md">
                <Avatar size={215} src={student?.avatarUrl} className="bg-gray-500 text-white">
                  {getDefaultAvatar(student?.name)}
                </Avatar>
              </div>
              <div className="mt-4 text-center">
                <p className="text-lg font-semibold">{student?.name}</p>
                <p className="text-gray-600">{student?.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <SessionHistory userId={studentId} />
          </div>
        </main>
      </div>
    </div>
  )
}
