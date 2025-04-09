import { Card } from 'antd'

export const PieChart = () => {
  const statisticsData = [
    { status: 'Approved', value: 10 },
    { status: 'Pending', value: 40 },
    { status: 'Rejected', value: 50 }
  ]

  return (
    <Card title="Statistics" className="w-full shadow-sm">
      <div className="flex flex-col items-center md:flex-row">
        <div className="relative mb-4 h-48 w-48 md:mb-0 md:mr-6">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            {
              statisticsData.reduce(
                (acc, item, index) => {
                  const total = statisticsData.reduce((sum, curr) => sum + curr.value, 0)
                  const percent = (item.value / total) * 100
                  const prevPercent = acc.prevPercent
                  const angle = (prevPercent / 100) * 360
                  const largeArcFlag = percent > 50 ? 1 : 0
                  const x1 = 50 + 50 * Math.cos((angle * Math.PI) / 180)
                  const y1 = 50 + 50 * Math.sin((angle * Math.PI) / 180)
                  const x2 = 50 + 50 * Math.cos(((angle + percent * 3.6) * Math.PI) / 180)
                  const y2 = 50 + 50 * Math.sin(((angle + percent * 3.6) * Math.PI) / 180)
                  const path = (
                    <path
                      key={index}
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={['#4ADE80', '#60A5FA', '#F87171'][index % 3]}
                    />
                  )
                  return {
                    paths: [...acc.paths, path],
                    prevPercent: prevPercent + percent
                  }
                },
                { paths: [], prevPercent: 0 }
              ).paths
            }
            <circle cx="50" cy="50" r="30" fill="white" />
          </svg>
        </div>
        <div className="flex-1 space-y-4">
          {statisticsData.map((item, index) => (
            <div key={item.status} className="flex items-start justify-between">
              <div className="flex items-center">
                <div
                  className="mr-2 h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: ['#4ADE80', '#60A5FA', '#F87171'][index % 3]
                  }}
                />
                <span>{item.status}</span>
              </div>
              <span className="font-semibold">
                {item.value} (
                {Math.round((item.value / statisticsData.reduce((sum, curr) => sum + curr.value, 0)) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
