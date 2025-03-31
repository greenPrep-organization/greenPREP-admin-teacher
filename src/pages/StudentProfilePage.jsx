import { Avatar, Breadcrumb } from 'antd'
import StudentSessionInformation from '../features/session/StudentSessionInformation'

export default function StudentProfilePage() {
  const studentData = {
    name: 'A Nguyen',
    id: 'GDD210011',
    class: 'GCD1111',
    email: 'QWER@gmail.com',
    phone: '0123456789',
    dob: '25/03/2025',
    avatar: '' // Nếu không có ảnh, avatar sẽ dùng chữ cái đầu
  }

  // Lấy chữ cái đầu của tên
  const getInitials = name => {
    return name ? name.charAt(0).toUpperCase() : '?'
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <div className="mb-4 flex items-center gap-2 text-sm">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item>Classes</Breadcrumb.Item>
              <Breadcrumb.Item>Class List</Breadcrumb.Item>
              <Breadcrumb.Item>Class Details</Breadcrumb.Item>
              <Breadcrumb.Item>Sessions List</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <button className="mb-4 rounded-md bg-blue-600 px-3 py-1 text-sm text-white">← Back</button>

          <h1 className="mb-6 text-2xl font-bold">Student Details</h1>

          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <StudentSessionInformation student={studentData} />
            </div>

            <div className="lg:col-span-1">
              <div className="flex items-center justify-center overflow-hidden rounded-lg bg-white p-4 shadow-md">
                {studentData.avatar ? (
                  <img
                    src={studentData.avatar}
                    alt={`${studentData.name}'s avatar`}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <Avatar size={215} className="bg-gray-500 text-white">
                    {getInitials(studentData.name)}
                  </Avatar>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
