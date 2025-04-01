import { SearchOutlined } from '@ant-design/icons'
import { Input, Table, Select } from 'antd'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const { Option } = Select

const SessionHistory = ({ studentId }) => {
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [data, setData] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [error, setError] = useState(null)

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const mockData = [
        {
          id: 1,
          date: '12/02/2025',
          sessionName: 'Feb_2025',
          grammarVocab: 40,
          grammarLevel: 'B1',
          listening: 40,
          listeningLevel: 'B1',
          reading: 40,
          readingLevel: 'B1',
          speaking: 40,
          speakingLevel: 'B1',
          writing: 40,
          total: 40,
          level: 'B1'
        },
        {
          id: 2,
          date: '15/02/2025',
          sessionName: 'Feb_2025',
          grammarVocab: 45,
          grammarLevel: 'B2',
          listening: 45,
          listeningLevel: 'B2',
          reading: 45,
          readingLevel: 'B2',
          speaking: 45,
          speakingLevel: 'B2',
          writing: 45,
          total: 45,
          level: 'B2'
        }
      ]

      setData(mockData)
    } catch (error) {
      console.error('Error fetching session history:', error)
      setError('Failed to load session history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (studentId) {
      fetchData()
    }
  }, [studentId])

  const filteredData = data.filter(item => {
    const matchesSearch = item.sessionName.toLowerCase().includes(searchText.toLowerCase())
    const matchesDate = !selectedDate || selectedDate === 'all' || item.date === selectedDate
    const matchesSession = !selectedSession || selectedSession === 'all' || item.sessionName === selectedSession
    const matchesLevel = !selectedLevel || selectedLevel === 'all' || item.level === selectedLevel
    return matchesSearch && matchesDate && matchesSession && matchesLevel
  })

  const dates = [...new Set(data.map(item => item.date))]
  const sessions = [...new Set(data.map(item => item.sessionName))]
  const levels = [...new Set(data.map(item => item.level))]

  if (error) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="text-center text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6">
        <h1 className="mb-4 text-2xl font-semibold">History</h1>
        <div className="mb-4 flex gap-4">
          <Input
            placeholder="Search session name"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            className="max-w-xs"
          />
          <Select
            placeholder="Date"
            onChange={setSelectedDate}
            className="min-w-[120px] rounded-md !bg-[#002B5B] !text-white"
          >
            <Option value="all">All</Option>
            {dates.map(date => (
              <Option key={date} value={date}>
                {date}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Session"
            onChange={setSelectedSession}
            className="min-w-[120px] rounded-md !bg-[#002B5B] !text-white"
          >
            <Option value="all">All</Option>
            {sessions.map(session => (
              <Option key={session} value={session}>
                {session}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Level"
            onChange={setSelectedLevel}
            className="min-w-[120px] rounded-md !bg-[#002B5B] !text-white"
          >
            <Option value="all">All</Option>
            {levels.map(level => (
              <Option key={level} value={level}>
                {level}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <Table
        columns={[
          {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            align: 'center',
            width: 120
          },
          {
            title: 'Session name',
            dataIndex: 'sessionName',
            key: 'sessionName',
            align: 'center'
          },
          {
            title: 'Grammar & Vocab',
            dataIndex: 'grammarVocab',
            key: 'grammarVocab',
            align: 'center',
            render: (score, record) => `${score} | ${record.grammarLevel}`
          },
          {
            title: 'Listening',
            dataIndex: 'listening',
            key: 'listening',
            align: 'center',
            render: (score, record) => `${score} | ${record.listeningLevel}`
          },
          {
            title: 'Reading',
            dataIndex: 'reading',
            key: 'reading',
            align: 'center',
            render: (score, record) => `${score} | ${record.readingLevel}`
          },
          {
            title: 'Speaking',
            dataIndex: 'speaking',
            key: 'speaking',
            align: 'center',
            render: (score, record) => `${score} | ${record.speakingLevel}`
          },
          {
            title: 'Writing',
            dataIndex: 'writing',
            key: 'writing',
            align: 'center'
          },
          {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            align: 'center'
          },
          {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            align: 'center'
          }
        ]}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 3,
          showSizeChanger: true,
          showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total}`
        }}
        className="overflow-x-auto"
      />
    </div>
  )
}

SessionHistory.propTypes = {
  studentId: PropTypes.string.isRequired
}

export default SessionHistory
