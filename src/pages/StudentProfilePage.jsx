import { useStudentProfile } from '@features/student-profile/hooks'
import StudentSessionHistory from '@features/student-profile/ui/student-session-history'
import StudentSessionInformation from '@features/student-profile/ui/student-session-information'
import { getDefaultAvatar } from '@shared/lib/utils/avatarUtils'
import { Avatar, Breadcrumb, Spin, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function StudentProfilePage() {
  const { studentId } = useParams()
  const navigate = useNavigate()

  const [student, setStudent] = useState(null)
  const { data: userData, isLoading, isError } = useStudentProfile(studentId)

  useEffect(() => {
    if (userData) {
      setStudent(userData)
    }
    if (isError) {
      message.error('Không thể tải thông tin học sinh.')
    }
  }, [userData, isError])

  if (isLoading || !student) {
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
                <Breadcrumb.Item>{student?.lastName || 'Student'}</Breadcrumb.Item>
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
              <StudentSessionInformation userId={studentId} />
            </div>

            <div className="lg:col-span-1">
              <div className="flex items-center justify-center overflow-hidden rounded-lg bg-white p-4 shadow-md">
                <Avatar size={215} className="bg-gray-500 text-white">
                  <div className="text-4xl">{getDefaultAvatar(student?.lastName)}</div>
                </Avatar>
              </div>
              <div className="mt-4 text-center">
                <p className="text-lg font-semibold">
                  {student?.firstName} {student?.lastName}
                </p>
                <p className="text-gray-600">{student?.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <StudentSessionHistory userId={studentId} />
          </div>
        </main>
      </div>
    </div>
  )
}
