// @ts-nocheck
import { CheckOutlined, FileDoneOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons'
import { fetchSessionParticipants } from '@features/dashboard/api'
import { useMyClasses, useSessionData } from '@features/dashboard/hooks'
import CalendarCard from '@features/dashboard/ui/calendar'
import { Alert, Card, Spin } from 'antd'
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { useSelector } from 'react-redux'

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
const performanceData = [
  { level: 'A1', percentage: 60 },
  { level: 'A2', percentage: 70 },
  { level: 'B1', percentage: 30 },
  { level: 'B2', percentage: 50 },
  { level: 'C', percentage: 40 }
]

const DashboardPage = () => {
  const auth = useSelector(state => state.auth)
  const { data: sessionData, isLoading, isError } = useSessionData()
  const { data: myClasses = [], isLoading: classLoading } = useMyClasses(auth.user?.userId)
  const sessionsArray = Array.isArray(sessionData?.data) ? sessionData.data : []
  const mySessions = sessionsArray.filter(session => session?.Classes?.UserID?.trim() === auth.user?.userId?.trim())
  const teacherSessions = sessionsArray.filter(
    session => session?.Classes?.UserID?.trim() === auth.user?.userId?.trim()
  )
  const CompleteCount = teacherSessions.filter(session => session.status?.toUpperCase() === 'NOT_STARTED').length
  const myClassCount = myClasses?.length || 0
  const [ungradedCount, setUngradedCount] = useState(0)

  useEffect(() => {
    const fetchUngraded = async () => {
      try {
        const allUngraded = await Promise.all(
          mySessions.map(session => fetchSessionParticipants(session.ID).then(res => res.filter(p => p.Total === null)))
        )
        setUngradedCount(allUngraded.flat().length)
      } catch (error) {
        console.error('Error fetching ungraded participants', error)
      }
    }

    if (mySessions.length > 0) {
      fetchUngraded()
    }
  }, [mySessions])

  const statsConfig = [
    {
      title: 'Total Student',
      value: '200',
      subtitle: 'Students',
      icon: <UserOutlined className="text-2xl text-blue-500" />,
      bgColor: 'bg-blue-100',
      trendColor: 'text-blue-600',
      isIncrease: true
    },
    {
      title: 'Total Session Completed',
      value: CompleteCount,
      subtitle: 'Session Completed',
      icon: <FileDoneOutlined className="text-2xl text-purple-500" />,
      bgColor: 'bg-purple-100',
      trendColor: 'text-purple-600',
      isIncrease: false
    },
    {
      title: 'My Classes',
      value: myClassCount,
      subtitle: 'Classes Assigned',
      icon: <CheckOutlined className="text-2xl text-yellow-500" />,
      bgColor: 'bg-yellow-100',
      trendColor: 'text-yellow-600',
      isIncrease: true
    },
    {
      title: 'Total Ungrade',
      value: ungradedCount,
      subtitle: 'Exam not graded',
      icon: <WarningOutlined className="text-2xl text-red-500" />,
      bgColor: 'bg-red-100',
      trendColor: 'text-red-600',
      isIncrease: true
    }
  ]

  if (isLoading || classLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin tip="Loading..." size="large" />
      </div>
    )
  }

  if (isError) {
    return (
      <Alert
        message="Error"
        description={`Error fetching sessions: ${isError.message || isError}`}
        type="error"
        showIcon
      />
    )
  }
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
                <div className="text-md whitespace-nowrap font-medium text-gray-600">{stat.title}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="h-8 w-full rounded-md">{stat.subtitle}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="mb-8 flex flex-col gap-6 lg:flex-row">
        <div className="w-full space-y-6 lg:w-2/3">
          <Card
            title={<span className="text-lg text-[#ba77f2]">Student Performance by Level</span>}
            className="min-h-[300px] shadow-md"
          >
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
                }
              }}
              series={[
                {
                  name: 'Performance',
                  data: performanceData.map((item, index) => ({
                    x: item.level,
                    y: item.percentage,
                    fillColor: ['#1890ff', '#13c2c2', '#fa8c16', '#722ed1', '#f5222d'][index % 5]
                  }))
                }
              ]}
              type="bar"
              height={283}
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
              height={345}
            />
          </Card>
        </div>

        <div className="flex w-1/3 flex-col justify-between space-y-0">
          <div className="min-h-[425px]">
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
