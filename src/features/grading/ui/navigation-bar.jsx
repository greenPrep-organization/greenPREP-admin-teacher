import { Button } from 'antd'
import PropTypes from 'prop-types'
import { LeftOutlined, UnorderedListOutlined, RightOutlined } from '@ant-design/icons'

const NavigationBar = ({
  onPrevious,
  onNext,
  onChangeStudent,
  currentStudent = 1,
  totalStudents = 1,
  disabled = false,
  studentName = ''
}) => {
  return (
    <div className="">
      <div className="flex items-center justify-between border-b border-gray-100 py-4">
        <div>
          <h1 className="mb-1 text-2xl font-semibold">Student Information: {studentName}</h1>
          <span className="text-sm text-gray-400">View student details</span>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <Button
              onClick={onPrevious}
              disabled={currentStudent <= 1 || disabled}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-1.5 shadow-sm hover:bg-gray-50"
              icon={<LeftOutlined className="text-[#003087]" />}
            >
              Previous Student
            </Button>

            <div className="relative pb-6">
              <Button
                onClick={onChangeStudent}
                disabled={disabled}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-1.5 shadow-sm hover:bg-gray-50"
                icon={<UnorderedListOutlined className="text-[#003087]" />}
              >
                Change Student
              </Button>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-gray-400">
                of {totalStudents} students
              </span>
            </div>

            <Button
              onClick={onNext}
              disabled={currentStudent >= totalStudents || disabled}
              className="flex items-center gap-2 rounded-lg bg-[#003087] px-4 py-1.5 text-white shadow-sm hover:bg-[#002366]"
            >
              Next Student
              <RightOutlined />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

NavigationBar.propTypes = {
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onChangeStudent: PropTypes.func.isRequired,
  currentStudent: PropTypes.number,
  totalStudents: PropTypes.number,
  disabled: PropTypes.bool,
  studentName: PropTypes.string
}

export default NavigationBar
