import WritingGrade from '@features/grading/ui/writing-grading'
const DashboardPage = () => {
  return (
    <>
      <div>
        <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
        <p>Welcome to the Dashboard! This is a public page to test the layout.</p>
      </div>
      <WritingGrade />
    </>
  )
}

export default DashboardPage
