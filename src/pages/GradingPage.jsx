import { useState } from 'react';
import { Button, Breadcrumb } from 'antd';
import { useNavigate } from 'react-router-dom';
import StudentCard from '@features/grading/ui/studentInformation';
import Speaking from '@features/grading/ui/speaking-grading';
import Writing from '@features/grading/ui/writing-grading';
import NavigationBar from '@features/grading/ui/navigation-bar';
import { useGetSpeakingTest } from '@features/grading/api';
import StudentListPopup from '@features/grading/ui/StudentListPopup';
import studentMockData from '@features/grading/constants/studentMockData.js';

function GradingPage() {
  const [activeSection, setActiveSection] = useState('speaking');
  const [currentStudent, setCurrentStudent] = useState(1);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const navigate = useNavigate();

  const GRADING_CONFIG = {
    SPEAKING_TEST_ID: 'ef6b69aa-2ec2-4c65-bf48-294fd12e13fc',
    TEST_TYPE: 'SPEAKING',
    CLASS_NAME: 'CLASS01',
    TERM: 'Feb_2025',
    DASHBOARD_PATH: 'Dashboard',
    CLASSES_PATH: 'Classes',
  };

  const studentList = studentMockData;
  const [studentData, setStudentData] = useState(studentList[0]);

  const { data: speakingTest, isLoading: speakingLoading } = useGetSpeakingTest(
      GRADING_CONFIG.SPEAKING_TEST_ID,
      GRADING_CONFIG.TEST_TYPE
  );

  const navigateToPreviousStudent = () => {
    const prevIndex = Math.max(0, currentStudent - 2);
    setCurrentStudent(prevIndex + 1);
    setStudentData(studentList[prevIndex]);
  };

  const navigateToNextStudent = () => {
    const nextIndex = Math.min(studentList.length - 1, currentStudent);
    setCurrentStudent(nextIndex + 1);
    setStudentData(studentList[nextIndex]);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleChangeStudent = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const handleSelectStudent = (student) => {
    setStudentData(student);
    setCurrentStudent(studentList.findIndex(s => s.id === student.id) + 1);
    setIsPopupVisible(false);
  };

  const breadcrumbItems = [
    { title: GRADING_CONFIG.DASHBOARD_PATH },
    { title: GRADING_CONFIG.CLASSES_PATH },
    { title: GRADING_CONFIG.CLASS_NAME },
    { title: GRADING_CONFIG.TERM },
    { title: studentData.name },
    { title: activeSection === 'speaking' ? 'Speaking' : 'Writing' },
  ];

  const renderBreadcrumb = () => (
      <div className="mb-4">
        <Breadcrumb items={breadcrumbItems} className="text-sm text-gray-600" />
        <h1 className="mt-2 text-2xl font-bold">Grading</h1>
      </div>
  );

  const renderMainContent = () => (
      <div>
        <div className="mb-6">
          <NavigationBar
              onBack={handleBack}
              onPrevious={navigateToPreviousStudent}
              onNext={navigateToNextStudent}
              onChangeStudent={handleChangeStudent}
              currentStudent={currentStudent}
              totalStudents={studentList.length}
              disabled={isLoading}
          />
        </div>

        <div className="flex gap-6">
          <div className="h-fit w-[340px]">
            <StudentCard student={studentData} />
          </div>

          <div className="flex-1">
            <div className="flex items-center rounded-t-[10px] bg-gray-100 p-3">
              <Button
                  type={activeSection === 'speaking' ? 'primary' : 'default'}
                  onClick={() => setActiveSection('speaking')}
                  className={`mr-3 h-9 min-w-[120px] rounded-lg ${
                      activeSection === 'speaking'
                          ? 'bg-[#003087] text-white hover:bg-[#002366]'
                          : 'bg-white text-black border-gray-300'
                  }`}
              >
                Speaking
              </Button>
              <Button
                  type={activeSection === 'writing' ? 'primary' : 'default'}
                  onClick={() => setActiveSection('writing')}
                  className={`h-9 min-w-[120px] rounded-lg ${
                      activeSection === 'writing'
                          ? 'bg-[#003087] text-white hover:bg-[#002366]'
                          : 'bg-white text-black border-gray-300'
                  }`}
              >
                Writing
              </Button>
            </div>

            <div className="rounded-b-[10px] border border-gray-200 bg-white p-6 shadow-md">
              {activeSection === 'speaking' ? (
                  <Speaking testData={speakingTest} isLoading={speakingLoading} />
              ) : (
                  <Writing studentId={studentData.id} />
              )}
            </div>
          </div>
        </div>
      </div>
  );

  const isLoading = activeSection === 'speaking' ? speakingLoading : false;

  return (
      <div className="container mx-auto">
        {renderBreadcrumb()}
        {renderMainContent()}
        <StudentListPopup
            visible={isPopupVisible}
            onCancel={handleClosePopup}
            onSelectStudent={handleSelectStudent}
            studentList={studentList}
        />
      </div>
  );
}

export default GradingPage;
