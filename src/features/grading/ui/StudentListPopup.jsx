import { Button, Modal, Input, Pagination, Spin } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import debounce from 'lodash/debounce'

const StudentListPopup = ({
  visible,
  onCancel,
  onSelectStudent,
  selectedStudentId,
  participantsData,
  isLoading,
  currentPage,
  onPageChange,
  onSearch,
  pageSize
}) => {
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    if (visible) {
      setSearchText('')
    }
  }, [visible])

  const debouncedSearch = debounce(value => {
    setSearchText(value)
    onSearch(value)
  }, 300)

  const handleSearch = e => {
    const value = e.target.value
    debouncedSearch(value)
  }

  const isCurrentlyGrading = studentId => {
    const studentInCurrentPage = participantsData?.data?.some(s => s.ID === selectedStudentId)
    return studentInCurrentPage && studentId === selectedStudentId
  }

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      style={{
        top: 181,
        left: '50%',
        marginLeft: '-450px',
        padding: 0
      }}
      styles={{
        body: {
          height: 600,
          padding: 0,
          borderRadius: '16px',
          overflow: 'hidden'
        }
      }}
      className="student-list-modal"
    >
      <div className="flex h-full flex-col bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="mb-4 text-2xl font-bold text-gray-800">Student List</div>
          <Input
            placeholder="Search by student name"
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={handleSearch}
            className="w-full max-w-sm rounded-lg"
            value={searchText}
            allowClear
          />
        </div>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <div className="flex flex-1 flex-col">
            <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50 px-6 py-3 font-medium text-gray-500">
              <div>Name</div>
              <div className="text-center">Writing</div>
              <div className="text-center">Speaking</div>
              <div className="text-right">Status</div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {participantsData?.data?.length === 0 ? (
                <div className="flex h-full items-center justify-center text-gray-500">No students found</div>
              ) : (
                participantsData?.data?.map(student => (
                  <div
                    key={student.ID}
                    className={`grid grid-cols-4 items-center border-b border-gray-100 px-6 py-4 hover:bg-gray-50 ${
                      isCurrentlyGrading(student.ID) ? 'bg-blue-50 hover:bg-blue-50' : ''
                    }`}
                  >
                    <div className="font-medium text-gray-900">{student.User.fullName}</div>
                    <div className="text-center">
                      <span
                        className={`rounded-full px-2 py-1 text-sm ${student.Writing ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {student.Writing ?? 'Ungraded'}
                      </span>
                    </div>
                    <div className="text-center">
                      <span
                        className={`rounded-full px-2 py-1 text-sm ${student.Speaking ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {student.Speaking ?? 'Ungraded'}
                      </span>
                    </div>
                    <div className="text-right">
                      {isCurrentlyGrading(student.ID) ? (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                          Currently Grading
                        </span>
                      ) : (
                        <Button
                          type="primary"
                          onClick={() => onSelectStudent(student)}
                          className="h-8 rounded-full bg-[#003087] px-4 hover:bg-[#0056a3] active:bg-[#001a4d]"
                        >
                          Select
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {participantsData?.data?.length > 0 && (
              <div className="border-t border-gray-200 bg-white px-6 py-4">
                <Pagination
                  current={currentPage}
                  total={participantsData?.pagination?.totalItems || 0}
                  pageSize={pageSize}
                  onChange={onPageChange}
                  showSizeChanger={false}
                  className="flex justify-center"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

StudentListPopup.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSelectStudent: PropTypes.func.isRequired,
  selectedStudentId: PropTypes.string.isRequired,
  participantsData: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired
}

export default StudentListPopup
