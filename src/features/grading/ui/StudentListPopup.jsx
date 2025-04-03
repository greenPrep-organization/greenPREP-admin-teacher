import { Button, Modal } from 'antd'
import PropTypes from 'prop-types'

const StudentListPopup = ({ visible, onCancel, onSelectStudent, studentList }) => {
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={1013}
      style={{
        top: 181,
        left: 100,
        borderRadius: 20,
        overflow: 'hidden'
      }}
      bodyStyle={{
        height: 660,
        borderRadius: 20,
        padding: 0
      }}
    >
      <div className="flex h-full flex-col rounded-[20px] bg-white p-6">
        <div className="mb-6 text-2xl font-bold">Student List</div>
        <div className="scrollbar-thin scrollbar-thumb-[#003087] max-h-[400px] overflow-y-auto pr-7">
          <div className="grid grid-cols-4 border-b pb-3 font-semibold text-gray-500">
            <div>Name</div>
            <div className="text-center">Writing</div>
            <div className="text-center">Speaking</div>
            <div className="text-right"></div>
          </div>
          {studentList.map((student, index) => (
            <div
              key={index}
              className="grid grid-cols-4 items-center border border-x-0 border-b border-t-0 border-solid border-gray-200 py-4"
            >
              <div>{student.name}</div>
              <div className="text-center">{student.writing}</div>
              <div className="text-center">{student.speaking}</div>
              <div className="text-right">
                <Button
                  type="primary"
                  onClick={() => onSelectStudent(student)}
                  className="h-10 w-[80px] rounded-full bg-[#003087] hover:bg-[#0056a3] active:bg-[#001a4d]"
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

StudentListPopup.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSelectStudent: PropTypes.func.isRequired,
  studentList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      writing: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      speaking: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      id: PropTypes.string,
      class: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      image: PropTypes.string
    })
  ).isRequired
}

export default StudentListPopup
