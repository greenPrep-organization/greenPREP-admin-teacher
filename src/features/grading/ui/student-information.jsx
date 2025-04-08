import { Typography, Image } from 'antd'
import { getDefaultAvatar } from '@shared/lib/utils/avatarUtils'

const { Text } = Typography

const StudentCard = ({ student }) => {
  const studentImage =
    student.image && student.image.trim() ? (
      <Image src={student.image} preview={false} className="h-[94px] w-[94px] rounded-lg object-cover" />
    ) : (
      <div className="flex h-[94px] w-[94px] items-center justify-center rounded-lg bg-blue-500 text-xl font-bold text-white">
        {getDefaultAvatar(student.name)}
      </div>
    )

  return (
    <div className="w-full rounded-lg bg-white shadow-sm">
      <div className="rounded-t-lg border-[0.3px] border-solid border-[#B9B9B9] bg-[#FAFAFA] px-6 py-4">
        <Text className="text-lg font-medium text-[#202224]">Student information</Text>
      </div>

      <div className="grid grid-cols-3 px-6 py-6 shadow-md">
        {/* Column 1: ID and Class */}
        <div className="flex flex-col justify-center">
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <Text className="text-right text-[#6B7280]">ID:</Text>
            <Text className="font-medium">{student.id}</Text>
          </div>
          <div className="mt-6 grid grid-cols-[100px_1fr] items-center gap-2">
            <Text className="text-right text-[#6B7280]">Class:</Text>
            <Text className="font-medium">{student.class}</Text>
          </div>
        </div>

        {/* Column 2: Email and Phone */}
        <div className="flex flex-col justify-center">
          <div className="grid grid-cols-[120px_1fr] items-center gap-2">
            <Text className="text-right text-[#6B7280]">Email:</Text>
            <Text className="font-medium">{student.email}</Text>
          </div>
          <div className="mt-6 grid grid-cols-[120px_1fr] items-center gap-2">
            <Text className="text-right text-[#6B7280]">Phone number:</Text>
            <Text className="font-medium">{student.phone}</Text>
          </div>
        </div>

        {/* Column 3: Student Image */}
        <div className="flex items-center justify-center">{studentImage}</div>
      </div>
    </div>
  )
}

export default StudentCard
