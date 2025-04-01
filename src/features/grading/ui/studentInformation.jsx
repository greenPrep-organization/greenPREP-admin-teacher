import { Typography } from 'antd'

const { Text } = Typography

const StudentCard = ({ student }) => {
  return (
    <div className="overflow-hidden rounded-xl border-gray-200 shadow-2xl">
      <div className="flex h-[60px] items-center border-b border-gray-100 bg-[#f3f4f6] pl-[20px]">
        <h3 className="text-base font-medium">Student Information</h3>
      </div>

      <div className="px-5 py-4">
        <div className="space-y-3">
          <div className="flex items-center">
            <Text className="w-[120px] text-gray-500">Student Name:</Text>
            <Text className="font-medium">{student.name}</Text>
          </div>

          <div className="flex items-center">
            <Text className="w-[120px] text-gray-500">ID:</Text>
            <Text className="font-medium">{student.id}</Text>
          </div>

          <div className="flex items-center">
            <Text className="w-[120px] text-gray-500">Class:</Text>
            <Text className="font-medium">{student.class}</Text>
          </div>

          <div className="flex items-center">
            <Text className="w-[120px] text-gray-500">Email:</Text>
            <Text className="font-medium">{student.email}</Text>
          </div>

          <div className="flex items-center">
            <Text className="w-[120px] text-gray-500">Phone number:</Text>
            <Text className="font-medium">{student.phone}</Text>
          </div>

          <div className="mt-4 flex justify-center">
            <div className="flex h-[140px] w-[140px] items-center justify-center rounded-lg bg-[#1677FF] text-4xl font-bold text-white">
              {student.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentCard
