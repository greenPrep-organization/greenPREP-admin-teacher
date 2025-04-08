import { useState } from 'react'
import { Button, Breadcrumb } from 'antd'
import { useNavigate } from 'react-router-dom'
import StudentCard from '@features/grading/ui/student-information'
import Speaking from '@features/grading/ui/speaking-grading'
import Writing from '@features/grading/ui/writing-grading'
import GradingScoringPanel from '@features/grading/ui/grading-scoring-panel'
import { useGetSpeakingTest } from '@features/grading/api'
import StudentListPopup from '@features/grading/ui/StudentListPopup'
import studentMockData from '@features/grading/constants/studentMockData.js'

function GradingPage() {
  const [activeSection, setActiveSection] = useState('speaking')
  const [currentStudent, setCurrentStudent] = useState(1)
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const navigate = useNavigate()

  const GRADING_CONFIG = {
    SPEAKING_TEST_ID: 'ef6b69aa-2ec2-4c65-bf48-294fd12e13fc',
    TEST_TYPE: 'SPEAKING',
    CLASS_NAME: 'CLASS01',
    TERM: 'Feb_2025',
    DASHBOARD_PATH: 'Dashboard',
    CLASSES_PATH: 'Classes'
  }

  const studentList = studentMockData
  const [studentData, setStudentData] = useState(studentList[0])

  const { data: speakingTest, isLoading: speakingLoading } = useGetSpeakingTest(
    GRADING_CONFIG.SPEAKING_TEST_ID,
    GRADING_CONFIG.TEST_TYPE
  )

  const navigateToPreviousStudent = () => {
    const prevIndex = Math.max(0, currentStudent - 2)
    setCurrentStudent(prevIndex + 1)
    setStudentData(studentList[prevIndex])
  }

  const navigateToNextStudent = () => {
    const nextIndex = Math.min(studentList.length - 1, currentStudent)
    setCurrentStudent(nextIndex + 1)
    setStudentData(studentList[nextIndex])
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleChangeStudent = () => {
    setIsPopupVisible(true)
  }

  const handleClosePopup = () => {
    setIsPopupVisible(false)
  }

  const handleSelectStudent = student => {
    setStudentData(student)
    setCurrentStudent(studentList.findIndex(s => s.id === student.id) + 1)
    setIsPopupVisible(false)
  }

  const handleScoreSubmit = score => {
    console.log(`Submitting ${activeSection} score:`, score)
  }

  const breadcrumbItems = [
    { title: GRADING_CONFIG.DASHBOARD_PATH },
    { title: GRADING_CONFIG.CLASSES_PATH },
    { title: GRADING_CONFIG.CLASS_NAME },
    { title: GRADING_CONFIG.TERM },
    { title: studentData.name },
    { title: activeSection === 'speaking' ? 'Speaking' : 'Writing' }
  ]

  const renderBreadcrumb = () => (
    <div className="flex flex-col gap-2 px-6 py-3">
      <Breadcrumb separator="/" items={breadcrumbItems} className="text-sm text-gray-600" />
      <Button
        onClick={handleBack}
        className="flex w-fit items-center justify-center rounded-lg bg-[#003087] py-1 text-white hover:bg-[#002366]"
      >
        Back
      </Button>
    </div>
  )

  const renderMainContent = () => (
    <div className="space-y-6 px-6 pb-6">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h1 className="mb-1 text-3xl">Student Information: {studentData.name}</h1>
            <span className="text-sm text-gray-400">View student details</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={navigateToPreviousStudent}
              className="flex h-11 min-w-[160px] items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 text-base font-medium shadow-sm"
              icon={<span className="text-[#003087]">←</span>}
            >
              Previous Student
            </Button>
            <Button
              onClick={handleChangeStudent}
              className="flex h-11 min-w-[160px] items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 text-base font-medium shadow-sm"
              icon={<span className="text-[#003087]">☰</span>}
            >
              Change Student
            </Button>
            <Button
              onClick={navigateToNextStudent}
              className="flex h-11 min-w-[160px] items-center justify-center gap-2 rounded-lg bg-[#003087] px-4 text-base font-medium text-white shadow-sm hover:bg-[#002366]"
            >
              Next Student →
            </Button>
          </div>
        </div>
        <div className="text-right text-sm text-gray-500">of {studentList.length} students</div>
      </div>

      <StudentCard student={studentData} />

      <div className="rounded-t-lg bg-transparent">
        <div className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Button
                onClick={() => setActiveSection('speaking')}
                className={`min-w-[120px] rounded-lg px-6 py-5 text-base font-medium ${
                  activeSection === 'speaking'
                    ? 'border-none bg-[#003087] text-white'
                    : 'border border-gray-200 bg-white'
                }`}
              >
                Speaking
              </Button>
              <Button
                onClick={() => setActiveSection('writing')}
                className={`min-w-[120px] rounded-lg px-6 py-5 text-base font-medium ${
                  activeSection === 'writing'
                    ? 'border-none bg-[#003087] text-white'
                    : 'border border-gray-200 bg-white'
                }`}
              >
                Writing
              </Button>
            </div>
            <Button className="rounded-lg bg-red-400 px-8 py-5 text-base font-medium text-white hover:bg-red-500">
              Export to PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white px-6 py-5 shadow-md">
        <GradingScoringPanel type={activeSection} onSubmit={handleScoreSubmit} />
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        {activeSection === 'speaking' ? (
          <Speaking testData={speakingTest} isLoading={speakingLoading} />
        ) : (
          <Writing studentId={studentData.id} />
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      {renderBreadcrumb()}
      {renderMainContent()}
      <StudentListPopup
        visible={isPopupVisible}
        onCancel={handleClosePopup}
        onSelectStudent={handleSelectStudent}
        studentList={studentList}
      />
    </div>
  )
}

export default GradingPage
