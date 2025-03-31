

const StudentCard = ({ student }) => {
  return (
    <div className="absolute left-[274px] top-[190px] h-[600px] w-[350px] rounded-3xl border border-gray-200 bg-white shadow-lg">
      <div className="rounded-t-3xl border-b border-gray-200 bg-[#B9B9B9]/50 p-6">
        <h1 className="text-md font-medium text-gray-800">Student information</h1>
      </div>

      <div className="space-y-6 p-6">
        <div className="flex items-start">
          <div className="w-36 text-xl text-gray-500">Student Name:</div>
          <div className="text-xl">{student.name}</div>
        </div>

        <div className="flex items-start">
          <div className="w-36 text-xl text-gray-500">ID:</div>
          <div className="text-xl">{student.id}</div>
        </div>

        <div className="flex items-start">
          <div className="w-36 text-xl text-gray-500">Class:</div>
          <div className="text-xl">{student.class}</div>
        </div>

        <div className="flex items-start">
          <div className="w-36 text-xl text-gray-500">Email:</div>
          <div className="text-xl">{student.email}</div>
        </div>

        <div className="flex items-start">
          <div className="w-36 text-xl text-gray-500">Phone number:</div>
          <div className="text-xl">{student.phone}</div>
        </div>

        <div className="absolute left-[65px] top-[400px] h-[158px] w-[158px] overflow-hidden rounded-[10px] border border-gray-200">
          <img
            src={student.image}
            alt="Student"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default StudentCard;
