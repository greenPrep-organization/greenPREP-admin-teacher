import SessionHistory from '@features/session/ui/session-history'
import SessionInformation from '@features/session/ui/session-information'
import { getDefaultAvatar } from '@shared/lib/utils/avatarUtils'
import { Avatar, Breadcrumb } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

export default function StudentProfilePage() {
  const { studentId } = useParams()
  const navigate = useNavigate()

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
                <Breadcrumb.Item>A Nguyen</Breadcrumb.Item>
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
              <SessionInformation
                // @ts-ignore
                studentId={studentId}
              />
            </div>

            <div className="lg:col-span-1">
              <div className="flex items-center justify-center overflow-hidden rounded-lg bg-white p-4 shadow-md">
                <Avatar size={215} className="bg-gray-500 text-white">
                  {getDefaultAvatar('A Nguyen')} {/* Tạm thời hardcode tên, sau này sẽ lấy từ API */}
                </Avatar>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <SessionHistory
              // @ts-ignore
              studentId={studentId}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
