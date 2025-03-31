import { Card, Typography, Image } from 'antd'
import { getDefaultAvatar } from '@shared/ui/index.js'

const { Title, Text } = Typography

const StudentCard = ({ student }) => {
  const studentImage =
    student.image && student.image.trim() ? (
      <Image src={student.image} preview={false} className="h-[140px] w-[140px] rounded-lg shadow-md" />
    ) : (
      <div className="flex h-[140px] w-[140px] items-center justify-center rounded-lg bg-blue-500 text-4xl font-bold text-white shadow-md">
        {getDefaultAvatar(student.name)}
      </div>
    )

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

        <div className="mt-4 flex justify-center">{studentImage}</div>
      </div>
    </Card>
  )
}

export default StudentCard
