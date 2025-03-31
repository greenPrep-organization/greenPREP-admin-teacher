export default function StudentSessionInformation({ student }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-medium">Student Information</h2>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Student Name:</p>
              <p className="font-medium">{student.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">ID:</p>
              <p className="font-medium">{student.id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Class:</p>
              <p className="font-medium">{student.class}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Email:</p>
              <p className="font-medium">{student.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone number:</p>
              <p className="font-medium">{student.phone}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Mail:</p>
              <p className="font-medium">{student.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
