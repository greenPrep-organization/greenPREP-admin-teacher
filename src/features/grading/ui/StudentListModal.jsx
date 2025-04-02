import { Modal, Button } from 'antd'

const StudentListModal = ({ visible, onCancel, students, onSelectStudent }) => {
  return (
    <Modal open={visible} onCancel={onCancel} footer={null} width={1013} className="top-[170px] ml-[370px]">
      <div className="flex h-full flex-col rounded-[20px] bg-white p-6">
        <div className="mb-6 text-2xl font-bold">Student List</div>
        <div className="scrollbar-thin scrollbar-thumb-[#003087] right-12 max-h-[400px] overflow-y-auto">
          <div className="grid grid-cols-4 border-b pb-3 font-semibold text-gray-500">
            <div>Name</div>
            <div className="text-center">Writing</div>
            <div className="text-center">Speaking</div>
            <div className="text-right"></div>
          </div>
          {students.map((student, index) => (
            <div
              key={index}
              className="grid grid-cols-4 items-center border border-x-0 border-b border-t-0 border-solid border-gray-200 py-4"
            >
              <div>{student.name}</div>
              <div className="text-center">{student.writing}</div>
              <div className="text-center">{student.speaking}</div>
              <div className="text-right">
                <Button
                  onClick={() => onSelectStudent(student)}
                  className="right-10 h-10 rounded-full border border-[#003087] bg-[#003087] text-white hover:bg-[#0056a3]"
                >
                  Select
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default StudentListModal
