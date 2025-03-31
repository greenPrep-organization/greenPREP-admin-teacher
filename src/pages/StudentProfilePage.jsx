import { Breadcrumb } from 'antd'
import StudentSessionInformation from '../features/session/StudentSessionInformation'

export default function StudentProfilePage() {
  const studentData = {
    // name: 'A Nguyen',
    // id: 'GDD210011',
    // class: 'GCD1111',
    // email: 'QWER@gmail.com',
    // phone: '0123456789',
    // dob: '25/03/2025',
    // avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-YXdrhlLuX0ffQOH0xGCVIo8FZ6TYrz.png'
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
              <div className="overflow-hidden rounded-lg bg-white shadow-md">
                <img
                  src={studentData.avatar || '/placeholder.svg'}
                  alt={`${studentData.name}'s avatar`}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
