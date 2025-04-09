import CalendarCard from '@features/dashboard/ui/calendar'
import { PieChart } from '@features/dashboard/ui/piechart'
import axiosInstance from '@shared/config/axios'
import { useQuery } from '@tanstack/react-query'
import { Card, Progress, Tooltip } from 'antd'
import { useState } from 'react'

const fetchSessions = async () => {
  const response = await axiosInstance.get(`/sessions/all`)
  return response.data
}

const studentCountData = {
  A1: { passed: 30, total: 50 },
  A2: { passed: 35, total: 50 },
  B1: { passed: 15, total: 50 },
  B2: { passed: 25, total: 50 },
  C: { passed: 20, total: 50 }
}

const DashboardPage = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions
  })

  const [hoveredLevel, setHoveredLevel] = useState(null)

  if (isLoading) return <p>Loading sessions...</p>
  if (error) return <p>Error fetching sessions: {error.message}</p>

  const sessionsArray = Array.isArray(data?.data) ? data.data : []
  const notStartedCount = sessionsArray.filter(session => session.status?.toUpperCase() === 'NOT_STARTED').length

  const performanceData = [
    { level: 'A1', percentage: 60 },
    { level: 'A2', percentage: 70 },
    { level: 'B1', percentage: 30 },
    { level: 'B2', percentage: 50 },
    { level: 'C', percentage: 40 }
  ]

  const statsConfig = [
    { title: 'Total Student', value: '50', subtitle: 'Student' },
    { title: 'Total Session Started', value: '50', subtitle: 'Session Started' },
    { title: 'Total Session Completed', value: '120', subtitle: 'Session Completed' },
    { title: 'Total Ungrade', value: notStartedCount, subtitle: 'Test not graded' }
  ]

  return (
    <div className="p-4">
      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map(({ title, value, subtitle }) => (
          <Card key={title} className="shadow-sm hover:shadow-lg">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">{title}</span>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-2xl font-bold">{value}</span>
              </div>
              <span className="mt-1 text-sm text-gray-400">{subtitle}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-8 flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-2/3">
          <Card title="Student Performance" className="h-full shadow-sm">
            <div className="flex flex-col space-y-4">
              {performanceData.map(item => (
                <div
                  key={item.level}
                  className="flex items-center"
                  onMouseEnter={() => setHoveredLevel(item.level)}
                  onMouseLeave={() => setHoveredLevel(null)}
                >
                  <span className="w-8 pt-5 font-medium">{item.level}</span>
                  <Tooltip
                    title={`${studentCountData[item.level].passed}/${studentCountData[item.level].total} students passed`}
                    visible={hoveredLevel === item.level}
                  >
                    <Progress
                      percent={item.percentage}
                      strokeColor={{
                        '0%': '#1890ff',
                        '100%': '#52c41a'
                      }}
                      showInfo={false}
                      className="mx-4 flex-1 pt-5"
                      strokeLinecap="square"
                    />
                  </Tooltip>
                  <span className="w-12 pt-5 text-right">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="w-1/3">
          <CalendarCard />
        </div>
      </div>

      <PieChart />
    </div>
  )
}

export default DashboardPage
