import { Card, Typography, Image } from 'antd'
import defaultAvatar from '@assets/Images/image.png'

const { Title, Text } = Typography

const StudentCard = ({ student }) => {
  const studentImage = student.image && student.image.trim() ? student.image : defaultAvatar

  return (
    <Card
      className="absolute left-[274px] top-[190px] w-[340px] rounded-3xl shadow-lg"
      bordered
      title={<Title level={5}>Student Information</Title>}
    >
      <div className="space-y-4">
        <div className="flex items-start">
          <Text className="w-36 text-gray-500">Student Name:</Text>
          <Text strong>{student.name}</Text>
        </div>

        <div className="flex items-start">
          <Text className="w-36 text-gray-500">ID:</Text>
          <Text strong>{student.id}</Text>
        </div>

        <div className="flex items-start">
          <Text className="w-36 text-gray-500">Class:</Text>
          <Text strong>{student.class}</Text>
        </div>

        <div className="flex items-start">
          <Text className="w-36 text-gray-500">Email:</Text>
          <Text strong>{student.email}</Text>
        </div>

        <div className="flex items-start">
          <Text className="w-36 text-gray-500">Phone number:</Text>
          <Text strong>{student.phone}</Text>
        </div>

        <div className="mt-4 flex justify-center">
          <Image
            src={studentImage}
            preview={false}
            style={{ width: 130, height: 130, borderRadius: 10, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)' }}
          />
        </div>
      </div>
    </Card>
  )
}

export default StudentCard
