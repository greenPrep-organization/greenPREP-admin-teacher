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
  const CompleteCount = teacherSessions.filter(session => session.status?.toUpperCase() === 'COMPLETED').length
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
      title: 'Total Students',
      value: '200',
      subtitle: 'Across all classes',
      icon: <UserOutlined className="text-3xl" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Completed Sessions',
      value: CompleteCount,
      subtitle: 'This semester',
      icon: <FileDoneOutlined className="text-3xl" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'My Classes',
      value: myClassCount,
      subtitle: 'Assigned to you',
      icon: <CheckOutlined className="text-3xl" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Ungraded Exams',
      value: ungradedCount,
      subtitle: 'Require attention',
      icon: <WarningOutlined className="text-3xl" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ]

  if (isLoading || classLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin tip="Loading dashboard..." size="large" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4">
        <Alert
          message="Error Loading Dashboard"
          description={`There was an error fetching your data: ${isError.message || isError}`}
          type="error"
          showIcon
          closable
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <h1 className="mb-6 text-2xl font-semibold text-gray-800">Teacher Dashboard</h1>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat, index) => (
          <div
            key={index}
            className={`rounded-lg border ${stat.borderColor} ${stat.bgColor} p-4 shadow-sm transition-all hover:shadow-md`}
          >
            <div className="flex items-center">
              <div className={`mr-4 rounded-full p-3 ${stat.bgColor} ${stat.color}`}>{stat.icon}</div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-7 lg:flex-row">
        <div className="flex-1 space-y-6 lg:w-2/3">
          <Card
            title="Student Performance by Level"
            className="rounded-lg border-2 shadow-sm"
            headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }}
            bodyStyle={{ padding: '18px 24px' }}
          >
            <Chart
              options={{
                chart: {
                  type: 'bar',
                  animations: { enabled: true, speed: 800 },
                  toolbar: { show: false },
                  fontFamily: 'Inter, sans-serif'
                },
                plotOptions: {
                  bar: {
                    horizontal: true,
                    barHeight: '60%',
                    borderRadius: 2
                  }
                },
                xaxis: {
                  categories: performanceData.map(item => item.level),
                  labels: {
                    style: {
                      colors: '#6b7280',
                      fontSize: '12px'
                    }
                  }
                },
                yaxis: {
                  labels: {
                    style: {
                      colors: '#6b7280',
                      fontSize: '12px'
                    }
                  }
                },
                dataLabels: {
                  enabled: true,
                  formatter: val => `${val}%`,
                  style: {
                    fontSize: '12px',
                    colors: ['#fff']
                  }
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
                grid: {
                  borderColor: '#f3f4f6'
                }
              }}
              series={[
                {
                  name: 'Performance',
                  data: performanceData.map((item, index) => ({
                    x: item.level,
                    y: item.percentage,
                    fillColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index % 5]
                  }))
                }
              ]}
              type="bar"
              height={255}
            />
          </Card>

          <Card
            title="Skill Comparison Across Classes"
            className="rounded-lg border-2 shadow-sm"
            headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }}
            bodyStyle={{ padding: '16px 24px' }}
          >
            <Chart
              options={{
                chart: {
                  type: 'radar',
                  toolbar: { show: false },
                  animations: { enabled: true, speed: 800 },
                  fontFamily: 'Inter, sans-serif'
                },
                xaxis: {
                  categories: ['Listening', 'Speaking', 'Reading', 'Writing', 'Grammar'],
                  labels: {
                    style: {
                      colors: '#6b7280',
                      fontSize: '12px'
                    }
                  }
                },
                stroke: {
                  width: 2
                },
                fill: {
                  opacity: 0.2
                },
                markers: {
                  size: 4
                },
                legend: {
                  position: 'top',
                  fontSize: '14px',
                  labels: {
                    colors: '#374151'
                  }
                },
                colors: ['#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b']
              }}
              series={Object.entries(skillComparisonData).map(([className, skills]) => ({
                name: className,
                data: [skills.Listening, skills.Speaking, skills.Reading, skills.Writing, skills.Grammar]
              }))}
              type="radar"
              height={300}
            />
          </Card>
        </div>

        <div className="flex flex-col gap-7 lg:w-1/3">
          <CalendarCard />
          <Card
            title="Pass vs Fail Distribution"
            className="space-y-6 rounded-lg border-2 p-2 shadow-sm"
            headStyle={{ borderBottom: '1px solid #f0f0f0' }}
          >
            <Chart
              options={{
                labels: ['Passed', 'Failed'],
                chart: {
                  type: 'donut',
                  animations: { enabled: true, speed: 800 },
                  fontFamily: 'Inter, sans-serif'
                },
                legend: {
                  position: 'top',
                  labels: {
                    colors: '#374151'
                  }
                },
                colors: ['#10b981', '#ef4444'],
                dataLabels: {
                  enabled: true,
                  style: {
                    fontSize: '12px',
                    colors: ['#fff']
                  }
                },
                plotOptions: {
                  pie: {
                    donut: {
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          label: 'Total Students',
                          color: '#6b7280'
                        }
                      }
                    }
                  }
                }
              }}
              series={[
                Object.values(studentCountData).reduce((acc, cur) => acc + cur.passed, 120),
                Object.values(studentCountData).reduce((acc, cur) => acc + (cur.total - cur.passed), 0)
              ]}
              type="donut"
              height={215}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
