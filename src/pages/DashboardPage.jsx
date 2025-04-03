import { ArrowUpOutlined } from '@ant-design/icons'
import { Card, Progress } from 'antd'

import { DonutChart } from '@features/dashboard/ui/piechart'
import CalendarCard from '@features/dashboard/ui/calendar'

const DashboardPage = () => {
  // Sample data
  const performanceData = [
    { level: 'A1', percentage: 60 },
    { level: 'A2', percentage: 70 },
    { level: 'B1', percentage: 30 },
    { level: 'B2', percentage: 50 },
    { level: 'C', percentage: 40 }
  ]

  // const statisticsData = [
  //   { status: 'Approved', value: 10 },
  //   { status: 'Pending', value: 40 },
  //   { status: 'Rejected', value: 50 }
  // ]

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats Cards - 4 columns */}

      <div>
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            ['Total Student', '50', 'Student'],
            ['Total Session Started', '50', 'Session Started'],
            ['Total Session Completed', '120', 'Session Completed'],
            ['Total Ungrade', '120', 'Ungrade']
          ].map(([title, value, subtitle]) => (
            <Card key={title} className="shadow-md hover:shadow-lg">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">{title}</span>
                <div className="mt-2 flex items-end justify-between">
                  <span className="text-2xl font-bold">{value}</span>
                  <span className="flex items-center text-green-500">
                    <ArrowUpOutlined className="mr-1" /> 12%
                  </span>
                </div>
                <span className="mt-1 text-sm text-gray-400">{subtitle}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content - 3 columns */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Student Performance */}
          <Card title="Student Performance" className="shadow-md">
            <div className="flex flex-col space-y-4">
              {performanceData.map(item => (
                <div key={item.level} className="flex items-center">
                  <span className="w-8 font-medium">{item.level}</span>
                  <Progress
                    percent={item.percentage}
                    strokeColor={{
                      '0%': '#1890ff',
                      '100%': '#52c41a'
                    }}
                    showInfo={false}
                    className="mx-4 flex-1"
                    strokeLinecap="square"
                  />
                  <span className="w-12 text-right">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Participants */}
          <Card title="Number of Participants" className="shadow-md">
            <div className="flex flex-col items-center">
              <Progress
                type="circle"
                percent={66}
                strokeColor="#1890ff"
                format={() => (
                  <div className="text-center">
                    <span className="block text-2xl font-bold">66%</span>
                    <span className="text-sm text-gray-500">Completion</span>
                  </div>
                )}
                width={150}
                className="mb-4"
              />
              <div className="text-center">
                <p className="font-medium">50 People</p>
                <p className="text-sm text-gray-500">of 150 people</p>
              </div>
            </div>
          </Card>
          <CalendarCard />
        </div>
      </div>
      <DonutChart />
    </div>
  )
}

export default DashboardPage
