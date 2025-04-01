import { UserOutlined } from '@ant-design/icons'
import { useUserProfile } from '@features/profile/api/profileAPI'
import { Avatar, Button, Card, Divider, message, Spin } from 'antd'
import { useParams } from 'react-router-dom'

const TeacherProfile = () => {
  const userId = useParams()
  const { data: userData, isLoading, isError } = useUserProfile(userId || '1')
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (isError) {
    message.error('Unable to load profile information. Please try again later.')
    return null
  }
  console.log(userData)

  const handleEdit = () => {
    alert('Edit')
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Profile</h1>
      <Card className="mb-6 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <Avatar size={100} icon={<UserOutlined />} className="bg-gray-800" />
          <div className="flex-grow">
            <h2 className="text-2xl font-semibold text-gray-800">
              {userData.firstName} {userData.lastName}
            </h2>
            <p className="text-gray-600">{userData.personalEmail}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="primary" className="bg-blue-800 hover:bg-blue-700" size="large">
              Change Password
            </Button>
            <Button type="default" size="large" onClick={handleEdit}>
              Edit
            </Button>
          </div>
        </div>
      </Card>
      <Card className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="mb-1 text-gray-600">Role</p>
            <p className="text-gray-500">{userData.role}</p>
          </div>
          <div>
            <p className="mb-1 text-gray-600">Classes</p>
            {userData.classes.map((cls, index) => (
              <p key={index} className="text-gray-500">
                {cls}
              </p>
            ))}
          </div>
        </div>
        <Divider className="my-6" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="mb-1 text-gray-600">Phone number</p>
            <p className="text-gray-500">{userData.phone}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default TeacherProfile
