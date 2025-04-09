import { CheckOutlined, FileDoneOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons'
import CalendarCard from '@features/dashboard/ui/calendar'
import axiosInstance from '@shared/config/axios'
import { useQuery } from '@tanstack/react-query'
import { Card, message } from 'antd'
import Chart from 'react-apexcharts'

const fetchSessions = async () => {
  const response = await axiosInstance.get(`/sessions/all`)
  return response.data
}
const fetchUser = async (params = {}) => {
  try {
    const { page = 1, limit = 10, search = '' } = params
    const { data } = await axiosInstance.post('/users/teachers', {
      params: {
        page,
        limit,
        search
      }
    })
    return data
  } catch (error) {
    message.error('Error fetching teachers')
    throw error
  }
}

// Mock data
const studentCountData = {
  A1: { passed: 30, total: 50 },
  A2: { passed: 35, total: 50 },
  B1: { passed: 15, total: 50 },
  B2: { passed: 25, total: 50 },
  C: { passed: 20, total: 50 }
}
const skillComparisonData = {
  'Class 1A': {
    Listening: 80,
    Speaking: 40,
    Reading: 75,
    Writing: 70,
    Grammar: 60
  },
  'Class 2B': {
    Listening: 60,
    Speaking: 85,
    Reading: 65,
    Writing: 55,
    Grammar: 70
  },
  'Class 3C': {
    Listening: 45,
    Speaking: 55,
    Reading: 60,
    Writing: 80,
    Grammar: 50
  }
}

const DashboardPage = () => {
  const {
    data: sessionData,
    error,
    isLoading
  } = useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions
  })

  const {
    data: userData,
    isLoading: isLoadingUsers,
    error: userError
  } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => fetchUser({ page: 1, limit: 100 }),
    retry: 1
  })

  if (isLoading || isLoadingUsers) return <p>Loading...</p>
  if (error) return <p>Error fetching sessions: {error.message}</p>
  if (userError) return <p>Error fetching users: {userError.message}</p>

  const sessionsArray = Array.isArray(sessionData?.data) ? sessionData.data : []
  const usersArray = Array.isArray(userData?.data) ? userData.data : []
  // eslint-disable-next-line no-unused-vars
  const totalUsers = usersArray.length

  const notStartedCount = sessionsArray.filter(session => session.status?.toUpperCase() === 'NOT_STARTED').length
  const startedCount = sessionsArray.filter(session => session.status?.toUpperCase() === 'STARTED').length

  const performanceData = [
    { level: 'A1', percentage: 60 },
    { level: 'A2', percentage: 70 },
    { level: 'B1', percentage: 30 },
    { level: 'B2', percentage: 50 },
    { level: 'C', percentage: 40 }
  ]

  const statsConfig = [
    {
      title: 'Total Student',
      value: '200',
      subtitle: 'students',
      icon: <UserOutlined className="text-2xl text-blue-500" />,
      bgColor: 'bg-blue-100',
      trendColor: 'text-blue-600',
      isIncrease: true
    },
    {
      title: 'Total Session Started',
      value: startedCount,
      subtitle: 'Session Started',
      icon: <FileDoneOutlined className="text-2xl text-purple-500" />,
      bgColor: 'bg-purple-100',
      trendColor: 'text-purple-600',
      isIncrease: false
    },
    {
      title: 'Total Session Completed',
      value: '50',
      subtitle: 'Session Completed',
      icon: <CheckOutlined className="text-2xl text-yellow-500" />,
      bgColor: 'bg-yellow-100',
      trendColor: 'text-yellow-600',
      isIncrease: true
    },
    {
      title: 'Total Ungrade',
      value: notStartedCount,
      subtitle: 'Exam not ungrade',
      icon: <WarningOutlined className="text-2xl text-red-500" />,
      bgColor: 'bg-red-100',
      trendColor: 'text-red-600',
      isIncrease: true
    }
  ]

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-6 pb-5 md:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat, index) => (
          <Card
            key={index}
            className={`rounded-2xl p-4 shadow-md transition-all duration-300 hover:shadow-xl ${stat.bgColor}`}
            bodyStyle={{ padding: '1rem' }}
          >
            <div className="flex h-full flex-col justify-between">
              <div className="mb-4 flex items-center justify-between">
                <div>{stat.icon}</div>
              </div>
              <div>
                <div className="text-md font-medium text-gray-600">{stat.title}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="h-8 w-full rounded-md">{stat.subtitle}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-8 flex flex-col gap-6 lg:flex-row">
        <div className="w-full space-y-6 lg:w-2/3">
          <Card title="Student Performance by Level" className="min-h-[300px] shadow-md">
            <Chart
              options={{
                chart: {
                  type: 'bar',
                  animations: { enabled: true, speed: 800 }
                },
                plotOptions: {
                  bar: { horizontal: true, barHeight: '40%' }
                },
                xaxis: {
                  categories: performanceData.map(item => item.level)
                },
                dataLabels: {
                  enabled: true,
                  formatter: val => `${val}%`
                },
                tooltip: {
                  y: {
                    formatter: (val, opts) => {
                      const level = performanceData[opts.dataPointIndex].level
                      const passed = studentCountData[level].passed
                      const total = studentCountData[level].total
                      return `${passed}/${total} students passed (${val}%)`
                    }
                  }
                },
                colors: ['#1890ff', '#13c2c2', '#fa8c16', '#722ed1', '#f5222d']
              }}
              series={[
                {
                  name: 'Performance',
                  data: performanceData.map(item => item.percentage)
                }
              ]}
              type="bar"
              height={305}
            />
          </Card>

          <Card title="Skill Comparison Across Classes" className="min-h-[400px] shadow-md">
            <Chart
              options={{
                chart: {
                  type: 'radar',
                  toolbar: { show: false },
                  animations: { enabled: true, speed: 800 }
                },
                xaxis: {
                  categories: ['Listening', 'Speaking', 'Reading', 'Writing', 'Grammar']
                },
                stroke: {
                  width: 3
                },
                fill: {
                  opacity: 0.2
                },
                markers: {
                  size: 5
                },
                legend: {
                  position: 'top'
                },
                colors: ['#f5222d', '#1890ff', '#52c41a', '#722ed1', '#fa8c16']
              }}
              series={Object.entries(skillComparisonData).map(([className, skills]) => ({
                name: className,
                data: [skills.Listening, skills.Speaking, skills.Reading, skills.Writing, skills.Grammar]
              }))}
              type="radar"
              height={355}
            />
          </Card>
        </div>

        <div className="flex w-full flex-col justify-between space-y-6 lg:w-1/3">
          <div className="min-h-[300px]">
            <CalendarCard />
          </div>
          <Card title="Pass vs Fail Student Distribution" className="shadow-md">
            <Chart
              options={{
                labels: ['Pass', 'Fail'],
                chart: {
                  type: 'donut',
                  animations: { enabled: true, speed: 800 }
                },
                legend: {
                  position: 'top'
                },
                colors: ['#52c41a', '#f5222d'],
                dataLabels: { enabled: true }
              }}
              series={[
                Object.values(studentCountData).reduce((acc, cur) => acc + cur.passed, 0),
                Object.values(studentCountData).reduce((acc, cur) => acc + (cur.total - cur.passed), 0)
              ]}
              type="donut"
              height={600}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
