import { useState } from 'react'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import StudentCard from '@features/grading/ui/studentInformation'
import Speaking from '@features/grading/ui/speaking-grading'
import Writing from '@features/grading/ui/writing-grading'
import Feedback from '@features/grading/ui/feedback-grading'
import NavigationBar from '@features/grading/ui/navigation-bar'
import { useGetSpeakingTest } from '@features/grading/api'

function GradingPage() {
  const [activeSection, setActiveSection] = useState('speaking')
  const [currentStudent, setCurrentStudent] = useState(1)
  const navigate = useNavigate()

  const { data: speakingTest, isLoading: speakingLoading } = useGetSpeakingTest(
    'ef6b69aa-2ec2-4c65-bf48-294fd12e13fc',
    'SPEAKING'
  )

  const studentData = {
    name: 'A Nguyen',
    id: 'GDD210011',
    class: 'GCD1111',
    email: '123@gmail.com',
    phone: '0123456789',
    image: ''
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handlePreviousStudent = () => {
    setCurrentStudent(prev => Math.max(1, prev - 1))
  }

  const handleNextStudent = () => {
    setCurrentStudent(prev => Math.min(40, prev + 1))
  }

  const handleChangeStudent = () => {
    console.log('Change student clicked')
  }

  const renderBreadcrumb = () => (
    <div className="mb-4">
      <div className="text-sm text-gray-600">
        Dashboard / Classes / CLASS01 / Feb_2025 / A Nguyen / {activeSection === 'speaking' ? 'Speaking' : 'Writing'}
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
          totalStudents={40}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-6">
        <div className="h-fit w-[340px]">
          <StudentCard student={studentData} />
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
              <Writing />
            )}
          </div>

          <div className="mt-6">
            <Feedback />
          </div>
        </div>
      </div>
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
