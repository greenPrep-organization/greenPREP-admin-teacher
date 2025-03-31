import StudentCard from '@pages/Grading/StudentInformation/Student-Information'

const student = {
  name: 'A Nguyen',
  id: 'GDD210011',
  class: 'GCD1111',
  email: '123@gmail.com',
  phone: '0123456789'
}

const DashboardPage = () => {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <p>Welcome to the Dashboard! This is a public page to test the layout.</p>
      <StudentCard student={student} />
    </div>
  )
}

export default DashboardPage
