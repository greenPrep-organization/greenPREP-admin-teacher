import { Button } from 'antd'
import { UnorderedListOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'

const NavigationBar = ({
  onBack,
  onPrevious,
  onNext,
  onChangeStudent,
  currentStudent = 1,
  totalStudents = 1,
  disabled = false
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Button
          type="primary"
          onClick={onBack}
          className="flex h-[40px] w-[80px] items-center justify-center rounded-md bg-[#003087] hover:bg-[#002366] active:bg-[#001a4d]"
        >
          Back
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={onPrevious}
          disabled={currentStudent <= 1 || disabled}
          className="flex h-[40px] items-center justify-center rounded-md border border-[#003087] bg-white text-[#003087] hover:bg-[#f0f2ff]"
          icon={<span className="mr-1">←</span>}
        >
          Previous Student
        </Button>

        <Button
          onClick={onChangeStudent}
          disabled={disabled}
          className="flex h-[40px] items-center justify-center rounded-md border border-[#003087] bg-white text-[#003087] hover:bg-[#f0f2ff]"
          icon={<UnorderedListOutlined />}
        >
          Change Student
        </Button>

        <div className="text-gray-500">of {totalStudents} students</div>

        <Button
          type="primary"
          onClick={onNext}
          disabled={currentStudent >= totalStudents || disabled}
          className="flex h-[40px] items-center justify-center rounded-md bg-[#003087] hover:bg-[#002366] active:bg-[#001a4d]"
        >
          Next Student <span className="ml-1">→</span>
        </Button>
      </div>
    </div>
  )
}

NavigationBar.propTypes = {
  onBack: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onChangeStudent: PropTypes.func.isRequired,
  currentStudent: PropTypes.number,
  totalStudents: PropTypes.number,
  disabled: PropTypes.bool
}

export default NavigationBar
