import { useState } from 'react'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import StudentCard from '@features/grading/ui/studentInformation'
import Speaking from '@features/grading/ui/speaking-grading'
import Writing from '@features/grading/ui/writing-grading'
import Feedback from '@features/grading/ui/feedback-grading'
import NavigationBar from '@features/grading/ui/navigation-bar'
import { useGetSpeakingTest } from '@features/grading/api'
import StudentListModal from '@features/grading/ui/StudentListModal'
import writingMockData from '@features/grading/constants/writingmockdata'

function GradingPage() {
  const [activeSection, setActiveSection] = useState('speaking')
  const [currentStudent, setCurrentStudent] = useState(1)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState({
    name: 'A Nguyen',
    id: 'GDD210011',
    class: 'GCD1111',
    email: '123@gmail.com',
    phone: '0123456789',
    image: '',
    writing: 'Not graded',
    speaking: 'Not graded'
  })

  const studentMockData = writingMockData[selectedStudent.id]

  const navigate = useNavigate()

  const { data: speakingTest, isLoading: speakingLoading } = useGetSpeakingTest(
    'ef6b69aa-2ec2-4c65-bf48-294fd12e13fc',
    'SPEAKING'
  )

  const students = [
    {
      name: 'A Nguyen',
      id: 'GDD210011',
      class: 'GCD1111',
      email: '123@gmail.com',
      phone: '0123456789',
      image: '',
      writing: 'Not graded',
      speaking: 'Not graded'
    },
    {
      name: 'B Tran',
      id: 'GDD210012',
      class: 'GCD1111',
      email: 'btran@gmail.com',
      phone: '0123456790',
      image: '',
      writing: 'Not graded',
      speaking: 'Not graded'
    },
    {
      name: 'C Nguyen',
      id: 'GDD210013',
      class: 'GCD1111',
      email: 'cnguyen@gmail.com',
      phone: '0123456791',
      image: '',
      writing: 'Not graded',
      speaking: 'Not graded'
    },
    {
      name: 'A Le',
      id: 'GDD210014',
      class: 'GCD1111',
      email: 'ale@gmail.com',
      phone: '0123456792',
      image: '',
      writing: 'Not graded',
      speaking: 'Not graded'
    },
    {
      name: 'M. Hieu',
      id: 'GDD210015',
      class: 'GCD1111',
      email: 'mhieu@gmail.com',
      phone: '0123456793',
      image: '',
      writing: 'Not graded',
      speaking: 'Not graded'
    }
  ]

  const handleBack = () => {
    navigate(-1)
  }

  const handlePreviousStudent = () => {
    const currentIndex = students.findIndex(s => s.id === selectedStudent.id)
    if (currentIndex > 0) {
      setSelectedStudent(students[currentIndex - 1])
      setCurrentStudent(currentIndex)
    }
  }

  const handleNextStudent = () => {
    const currentIndex = students.findIndex(s => s.id === selectedStudent.id)
    if (currentIndex < students.length - 1) {
      setSelectedStudent(students[currentIndex + 1])
      setCurrentStudent(currentIndex + 2)
    }
  }

  const handleChangeStudent = () => {
    setIsModalVisible(true)
  }

  const handleSelectStudent = student => {
    setSelectedStudent(student)
    setIsModalVisible(false)
    setCurrentStudent(students.findIndex(s => s.id === student.id) + 1)
  }

  const renderBreadcrumb = () => (
    <div className="mb-4">
      <div className="text-sm text-gray-600">
        Dashboard / Classes / CLASS01 / Feb_2025 / {selectedStudent.name} /{' '}
        {activeSection === 'speaking' ? 'Speaking' : 'Writing'}
      </div>
      <h1 className="mt-2 text-2xl font-bold">Grading</h1>
    </div>
  )

  const renderMainContent = () => (
    <div>
      <div className="mb-6">
        <NavigationBar
          onBack={handleBack}
          onPrevious={handlePreviousStudent}
          onNext={handleNextStudent}
          onChangeStudent={handleChangeStudent}
          currentStudent={currentStudent}
          totalStudents={students.length}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-6">
        <div className="h-fit w-[340px]">
          <StudentCard student={selectedStudent} />
        </div>

        <div className="flex-1">
          <div className="align-center flex rounded-t-[10px] bg-[#f3f4f6] pb-[12px] pl-[12px] pt-[12px]">
            <Button
              type={activeSection === 'speaking' ? 'primary' : 'default'}
              onClick={() => setActiveSection('speaking')}
              className={`mr-[12px] h-[36px] min-w-[120px] rounded-lg border ${
                activeSection === 'speaking'
                  ? 'border-none bg-[#003087] text-white hover:bg-[#002366]'
                  : 'border-gray-300 bg-white'
              }`}
            >
              Speaking
            </Button>
            <Button
              type={activeSection === 'writing' ? 'primary' : 'default'}
              onClick={() => setActiveSection('writing')}
              className={`h-[36px] min-w-[120px] border ${
                activeSection === 'writing'
                  ? 'border-none bg-[#003087] text-white hover:bg-[#002366]'
                  : 'border-gray-300 bg-white'
              }`}
            >
              Writing
            </Button>
          </div>

          <div className="rounded-b-[10px] border border-gray-200 bg-white p-6 shadow-md">
            {activeSection === 'speaking' ? (
              <Speaking testData={speakingTest} isLoading={speakingLoading} />
            ) : (
              <Writing studentData={studentMockData} studentId={selectedStudent.id} />
            )}
          </div>

          <div className="mt-6">
            <Feedback />
          </div>
        </div>
      </div>

      <StudentListModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        students={students}
        onSelectStudent={handleSelectStudent}
      />
    </div>
  )

  const isLoading = activeSection === 'speaking' ? speakingLoading : false

  return (
    <div className="">
      {renderBreadcrumb()}
      {renderMainContent()}
    </div>
  )
}

export default GradingPage
