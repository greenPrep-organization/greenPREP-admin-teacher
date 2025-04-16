import { useState, useEffect } from 'react'
import { Button } from 'antd'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import StudentCard from '@features/grading/ui/student-information'
import Speaking from '@features/grading/ui/speaking-grading'
import Writing from '@features/grading/ui/writing-grading'
import GradingScoringPanel from '@features/grading/ui/grading-scoring-panel'
import StudentListPopup from '@features/grading/ui/StudentListPopup'
import { useGetSpeakingTest, useGetSessionParticipants } from '@features/grading/api'
import axiosInstance from '@shared/config/axios'
import AppBreadcrumb from '@/shared/ui/Breadcrumb'
import { useQuery } from '@tanstack/react-query'
import { LeftOutlined } from '@ant-design/icons'
import { sharedState } from '@features/grading/constants/shared-state'
import { message } from 'antd'
import Title from 'antd/es/typography/Title'

const fetchSessionDetail = async sessionId => {
  const res = await axiosInstance.get(`/sessions/${sessionId}`)
  return res.data.data
}

function GradingPage() {
  const location = useLocation()
  const getSectionFromQuery = () => {
    const params = new URLSearchParams(location.search)
    const section = params.get('section')
    return section === 'writing' ? 'writing' : 'speaking'
  }
  const [activeSection, setActiveSection] = useState(getSectionFromQuery())
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [isSpeakingGraded, setIsSpeakingGraded] = useState(false)
  const [isWritingGraded, setIsWritingGraded] = useState(false)
  const [isFirstCompletionNotice, setIsFirstCompletionNotice] = useState(true)
  const [speakingScore, setSpeakingScore] = useState('')
  const [writingScore, setWritingScore] = useState('')
  const [previousSpeakingScore, setPreviousSpeakingScore] = useState('')
  const [previousWritingScore, setPreviousWritingScore] = useState('')
  const [studentData, setStudentData] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0)
  const [searchText, setSearchText] = useState('')
  const pageSize = 10
  const navigate = useNavigate()
  const { sessionId, participantId } = useParams()

  const { data: speakingTestData, isLoading: speakingLoading } = useGetSpeakingTest(participantId)

  const {
    data: participantsData,
    isLoading: participantsLoading,
    refetch: refetchParticipants
  } = useGetSessionParticipants(sessionId, {
    page: currentPage,
    limit: pageSize,
    search: searchText
  })

  const { data: sessionDetail } = useQuery({
    queryKey: ['session-detail', sessionId],
    queryFn: () => fetchSessionDetail(sessionId),
    enabled: !!sessionId
  })

  const className = sessionDetail?.Classes?.className ?? 'Loading...'
  const sessionName = sessionDetail?.sessionName ?? 'Loading...'

  useEffect(() => {
    if (isPopupVisible) {
      setCurrentPage(1)
      setSearchText('')
    }
  }, [isPopupVisible])

  useEffect(() => {
    if (participantsData?.data) {
      const currentStudent = participantsData.data.find(p => p.ID === participantId)
      if (currentStudent) {
        const studentInfo = {
          id: currentStudent.ID,
          userId: currentStudent.UserID,
          name: currentStudent.User.fullName,
          email: currentStudent.User.email,
          phone: currentStudent.User.phone,
          class: currentStudent.User.class,
          speaking: currentStudent.Speaking,
          writing: currentStudent.Writing,
          studentCode: currentStudent.User.studentCode,
          classId: currentStudent.ClassID
        }
        setStudentData(studentInfo)

        const studentIndex = participantsData.data.findIndex(p => p.ID === participantId)
        if (studentIndex !== -1) {
          const globalIndex = (currentPage - 1) * pageSize + studentIndex + 1
          setCurrentStudentIndex(Math.min(globalIndex, participantsData.pagination.totalItems))
        }
      }
    }
  }, [participantsData, participantId, currentPage, pageSize])

  useEffect(() => {
    if (!studentData) return

    setSpeakingScore(studentData.speaking?.toString() || '')
    setWritingScore(studentData.writing?.toString() || '')
    setPreviousSpeakingScore(studentData.speaking?.toString() || '')
    setPreviousWritingScore(studentData.writing?.toString() || '')
    setIsSpeakingGraded(!!studentData.speaking)
    setIsWritingGraded(!!studentData.writing)
    setIsFirstCompletionNotice(!(studentData.speaking && studentData.writing))

    if (participantId) {
      const draft = sharedState.getDraft(participantId)
      if (draft.score) {
        if (draft.score.speaking !== null) {
          setSpeakingScore(draft.score.speaking.toString())
        }
        if (draft.score.writing !== null) {
          setWritingScore(draft.score.writing.toString())
        }
      }
    }
  }, [studentData, participantId])

  useEffect(() => {
    setActiveSection(getSectionFromQuery())
  }, [location.search])
  const navigateToPreviousStudent = async () => {
    if (participantsData?.data) {
      const currentIndex = participantsData.data.findIndex(s => s.ID === participantId)

      if (currentIndex > 0) {
        const prevStudent = participantsData.data[currentIndex - 1]
        const prevIndex = (currentPage - 1) * pageSize + currentIndex
        setCurrentStudentIndex(Math.min(prevIndex, participantsData.pagination.totalItems))
        navigate(`/grading/${sessionId}/${prevStudent.ID}`)
      } else if (currentPage > 1) {
        const prevPage = currentPage - 1
        const prevPageResponse = await axiosInstance.get(`/session-participants/${sessionId}`, {
          params: { page: prevPage, limit: pageSize, search: searchText }
        })

        if (prevPageResponse.data.data.length > 0) {
          const lastStudentInPrevPage = prevPageResponse.data.data[prevPageResponse.data.data.length - 1]
          const prevIndex = prevPage * pageSize
          setCurrentStudentIndex(Math.min(prevIndex, participantsData.pagination.totalItems))
          setCurrentPage(prevPage)
          navigate(`/grading/${sessionId}/${lastStudentInPrevPage.ID}`)
        }
      }
    }
  }

  const navigateToNextStudent = async () => {
    if (participantsData?.data) {
      const currentIndex = participantsData.data.findIndex(s => s.ID === participantId)

      if (currentIndex < participantsData.data.length - 1) {
        const nextStudent = participantsData.data[currentIndex + 1]
        const nextIndex = (currentPage - 1) * pageSize + currentIndex + 2
        setCurrentStudentIndex(Math.min(nextIndex, participantsData.pagination.totalItems))
        navigate(`/grading/${sessionId}/${nextStudent.ID}`)
      } else if (currentPage < participantsData.pagination.totalPages) {
        const nextPage = currentPage + 1
        const nextPageResponse = await axiosInstance.get(`/session-participants/${sessionId}`, {
          params: { page: nextPage, limit: pageSize, search: searchText }
        })

        if (nextPageResponse.data.data.length > 0) {
          const firstStudentInNextPage = nextPageResponse.data.data[0]
          const nextIndex = (nextPage - 1) * pageSize + 1
          setCurrentStudentIndex(Math.min(nextIndex, participantsData.pagination.totalItems))
          setCurrentPage(nextPage)
          navigate(`/grading/${sessionId}/${firstStudentInNextPage.ID}`)
        }
      }
    }
  }

  const handleViewStudentDetails = () => {
    if (studentData) {
      navigate(`/classes-management/${sessionId.split('-')[0]}/${sessionId}/students/${studentData.userId}`)
    }
  }

  const handleChangeStudent = () => {
    setIsPopupVisible(true)
  }

  const handleClosePopup = () => {
    setIsPopupVisible(false)
  }

  const handleSelectStudent = student => {
    navigate(`/grading/${sessionId}/${student.ID}`)
    setIsPopupVisible(false)
  }

  const handleScoreSubmit = async (score, section) => {
    try {
      const studentAnswers = sharedState.getFeedbackWithStudentAnswerId(participantId, section)
      const payload = {
        sessionParticipantID: participantId,
        teacherGradedScore: parseInt(score),
        skillName: section.toUpperCase(),
        studentAnswers
      }

      console.log('Submitting payload:', payload)

      await axiosInstance.post(`/grades/teacher-grade`, payload)

      if (section === 'speaking') {
        setIsSpeakingGraded(true)
        setSpeakingScore(score.toString())
        if (isWritingGraded) setIsFirstCompletionNotice(false)
        message.success('Speaking score and feedback submitted successfully!')
      } else if (section === 'writing') {
        setIsWritingGraded(true)
        setWritingScore(score.toString())
        if (isSpeakingGraded) setIsFirstCompletionNotice(false)
        message.success('Writing score and feedback submitted successfully!')
      }

      if (participantId) {
        sharedState.clearDraft(participantId)
      }
    } catch (error) {
      console.error(`Error submitting ${section} score and feedback:`, error)
      message.error(`Failed to submit ${section} score and feedback. Please try again.`)
    }
  }

  const handleScoreChange = value => {
    if (activeSection === 'speaking') {
      setSpeakingScore(value)
      if (participantId) {
        sharedState.updateScore(participantId, 'speaking', value)
      }
    } else if (activeSection === 'writing') {
      setWritingScore(value)
      if (participantId) {
        sharedState.updateScore(participantId, 'writing', value)
      }
    }
  }

  const handleSectionChange = newSection => {
    setActiveSection(newSection)
  }

  const handleSearch = value => {
    setSearchText(value)
    setCurrentPage(1)
  }

  const handlePageChange = page => {
    setCurrentPage(page)
    refetchParticipants()
  }

  const breadcrumbItems = [
    { label: 'Classes', path: '/classes-management' },
    {
      label: className,
      path: `/classes-management/${sessionDetail?.Classes?.ID}`,
      state: {
        classInfo: {
          ID: sessionDetail?.Classes?.ID,
          className: sessionDetail?.Classes?.className
        }
      }
    },
    {
      label: sessionName,
      path: `/classes-management/${sessionDetail?.Classes?.ID}/session/${sessionId}`,
      state: {
        classInfo: {
          ID: sessionDetail?.Classes?.ID,
          className: sessionDetail?.Classes?.className
        }
      }
    },
    {
      label: studentData?.name || 'Student',
      path: `/classes-management/${sessionDetail?.Classes?.ID}/${sessionId}/students/${studentData?.userId}`,
      state: {
        classInfo: {
          ID: sessionDetail?.Classes?.ID,
          className: sessionDetail?.Classes?.className
        }
      }
    },
    {
      label: activeSection === 'speaking' ? 'Speaking Assessment' : 'Writing Assessment'
    }
  ]

  const renderBreadcrumb = () => (
    <div className="flex flex-col">
      <AppBreadcrumb items={breadcrumbItems} />
      <Button
        onClick={() => navigate(`/classes-management/${sessionId.split('-')[0]}/session/${sessionId}`)}
        type="primary"
        icon={<LeftOutlined />}
        style={{ backgroundColor: '#013088', border: 'none', width: 'fit-content' }}
      >
        Back
      </Button>
    </div>
  )

  const renderMainContent = () => (
    <div className="space-y-6 pt-6">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div>
            <Title level={3} style={{ textAlign: 'left', marginBottom: '24px' }}>
              Student Information: {studentData?.name}
            </Title>
            <span
              className="cursor-pointer text-sm text-gray-400 hover:text-blue-600"
              onClick={handleViewStudentDetails}
            >
              View student details
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={navigateToPreviousStudent}
              disabled={currentStudentIndex <= 1}
              className={`flex h-11 min-w-[160px] items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 text-base font-medium shadow-sm ${
                currentStudentIndex <= 1 ? 'cursor-not-allowed opacity-50' : ''
              }`}
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
              disabled={currentStudentIndex >= (participantsData?.pagination?.totalItems || 0)}
              className={`flex h-11 min-w-[160px] items-center justify-center gap-2 rounded-lg bg-[#003087] px-4 text-base font-medium text-white shadow-sm hover:bg-[#002366] ${
                currentStudentIndex >= (participantsData?.pagination?.totalItems || 0)
                  ? 'cursor-not-allowed opacity-50'
                  : ''
              }`}
            >
              Next Student →
            </Button>
          </div>
        </div>
        <div className="text-right text-sm text-gray-500">
          {currentStudentIndex} of {participantsData?.pagination?.totalItems || 0} students
        </div>
      </div>

      {studentData && <StudentCard student={studentData} />}

      <div className="rounded-t-lg bg-transparent">
        <div className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Button
                onClick={() => handleSectionChange('speaking')}
                className={`min-w-[120px] rounded-lg px-6 py-5 text-base font-medium ${
                  activeSection === 'speaking'
                    ? 'border-none bg-[#003087] text-white'
                    : 'border border-gray-200 bg-white'
                }`}
              >
                Speaking
              </Button>
              <Button
                onClick={() => handleSectionChange('writing')}
                className={`min-w-[120px] rounded-lg px-6 py-5 text-base font-medium ${
                  activeSection === 'writing'
                    ? 'border-none bg-[#003087] text-white'
                    : 'border border-gray-200 bg-white'
                }`}
              >
                Writing
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white px-6 py-5 shadow-md">
        <GradingScoringPanel
          type={activeSection}
          onSubmit={handleScoreSubmit}
          onSectionChange={handleSectionChange}
          isSpeakingGraded={isSpeakingGraded}
          isWritingGraded={isWritingGraded}
          isFirstCompletionNotice={isFirstCompletionNotice}
          score={activeSection === 'speaking' ? speakingScore : writingScore}
          onScoreChange={handleScoreChange}
          previousScore={activeSection === 'speaking' ? previousSpeakingScore : previousWritingScore}
          sessionParticipantId={participantId}
        />
      </div>

      <div className="rounded-lg bg-white shadow-lg">
        {activeSection === 'speaking' ? (
          <Speaking
            testData={speakingTestData?.data?.topic}
            isLoading={speakingLoading}
            sessionParticipantId={participantId}
          />
        ) : (
          <Writing sessionParticipantId={participantId} />
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      {renderBreadcrumb()}
      {renderMainContent()}
      <StudentListPopup
        visible={isPopupVisible}
        onCancel={handleClosePopup}
        onSelectStudent={handleSelectStudent}
        selectedStudentId={participantId}
        participantsData={participantsData}
        isLoading={participantsLoading}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        pageSize={pageSize}
      />
    </div>
  )
}

export default GradingPage
