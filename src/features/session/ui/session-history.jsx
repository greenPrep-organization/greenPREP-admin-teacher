import { SearchOutlined } from '@ant-design/icons'
import { Input, Table, Select, Empty } from 'antd'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getUserSessionHistory } from '../api'

const { Option } = Select

const SessionHistory = ({ userId }) => {
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [data, setData] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return

      try {
        setLoading(true)
        setError(null)
        const response = await getUserSessionHistory(userId)
        setData(response.data || [])
      } catch (err) {
        setError(err.message || 'Failed to fetch session history')
        console.error('Error fetching history:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [userId])

  const filteredData = data.filter(item => {
    const matchesSearch = item.sessionName.toLowerCase().includes(searchText.toLowerCase())
    const matchesDate = !selectedDate || selectedDate === 'all' || item.date === selectedDate
    const matchesSession = !selectedSession || selectedSession === 'all' || item.sessionName === selectedSession
    const matchesLevel = !selectedLevel || selectedLevel === 'all' || item.finalLevel === selectedLevel
    return matchesSearch && matchesDate && matchesSession && matchesLevel
  })

  const dates = [...new Set(data.map(item => item.date))]
  const sessions = [...new Set(data.map(item => item.sessionName))]
  const levels = [...new Set(data.map(item => item.finalLevel))]

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      align: 'center',
      width: 120,
      render: text => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: 'Session name',
      dataIndex: 'sessionName',
      key: 'sessionName',
      align: 'center',
      width: 180,
      render: text => <span style={{ color: '#1890ff', fontWeight: 500 }}>{text}</span>
    },
    {
      title: 'Grammar & Vocab',
      dataIndex: 'grammarScore',
      key: 'grammar',
      align: 'center',
      width: 150,
      render: (score, record) => (
        <div>
          <span
            style={{
              color: score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#ff4d4f',
              fontWeight: 500,
              marginRight: '8px'
            }}
          >
            {score}
          </span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: '#e6f7ff',
              color: '#1890ff',
              fontWeight: 500
            }}
          >
            {record.grammarLevel}
          </span>
        </div>
      )
    },
    {
      title: 'Listening',
      dataIndex: 'listeningScore',
      key: 'listening',
      align: 'center',
      width: 150,
      render: (score, record) => (
        <div>
          <span
            style={{
              color: score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#ff4d4f',
              fontWeight: 500,
              marginRight: '8px'
            }}
          >
            {score}
          </span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: '#e6f7ff',
              color: '#1890ff',
              fontWeight: 500
            }}
          >
            {record.listeningLevel}
          </span>
        </div>
      )
    },
    {
      title: 'Reading',
      dataIndex: 'readingScore',
      key: 'reading',
      align: 'center',
      width: 150,
      render: (score, record) => (
        <div>
          <span
            style={{
              color: score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#ff4d4f',
              fontWeight: 500,
              marginRight: '8px'
            }}
          >
            {score}
          </span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: '#e6f7ff',
              color: '#1890ff',
              fontWeight: 500
            }}
          >
            {record.readingLevel}
          </span>
        </div>
      )
    },
    {
      title: 'Speaking',
      dataIndex: 'speakingScore',
      key: 'speaking',
      align: 'center',
      width: 150,
      render: (score, record) => (
        <div>
          <span
            style={{
              color: score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#ff4d4f',
              fontWeight: 500,
              marginRight: '8px'
            }}
          >
            {score}
          </span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: '#e6f7ff',
              color: '#1890ff',
              fontWeight: 500
            }}
          >
            {record.speakingLevel}
          </span>
        </div>
      )
    },
    {
      title: 'Writing',
      dataIndex: 'writingScore',
      key: 'writing',
      align: 'center',
      width: 150,
      render: (score, record) => (
        <div>
          <span
            style={{
              color: score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#ff4d4f',
              fontWeight: 500,
              marginRight: '8px'
            }}
          >
            {score}
          </span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: '#e6f7ff',
              color: '#1890ff',
              fontWeight: 500
            }}
          >
            {record.writingLevel}
          </span>
        </div>
      )
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      align: 'center',
      width: 100,
      render: score => (
        <span
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#ff4d4f'
          }}
        >
          {score}
        </span>
      )
    },
    {
      title: 'Final Level',
      dataIndex: 'finalLevel',
      key: 'finalLevel',
      align: 'center',
      width: 120,
      render: level => (
        <span
          style={{
            padding: '4px 12px',
            borderRadius: '16px',
            backgroundColor: '#1890ff',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          {level}
        </span>
      )
    }
  ]

  if (error) {
    return <div style={{ padding: '24px', textAlign: 'center', color: '#ff4d4f' }}>{error}</div>
  }

  return (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>Session History</h2>
      <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
        <Input
          placeholder="Search session name"
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select style={{ width: 120 }} placeholder="Date" allowClear value={selectedDate} onChange={setSelectedDate}>
          <Option value="all">All</Option>
          {dates.map(date => (
            <Option key={date} value={date}>
              {date}
            </Option>
          ))}
        </Select>
        <Select
          style={{ width: 120 }}
          placeholder="Session"
          allowClear
          value={selectedSession}
          onChange={setSelectedSession}
        >
          <Option value="all">All</Option>
          {sessions.map(session => (
            <Option key={session} value={session}>
              {session}
            </Option>
          ))}
        </Select>
        <Select style={{ width: 120 }} placeholder="Level" allowClear value={selectedLevel} onChange={setSelectedLevel}>
          <Option value="all">All</Option>
          {levels.map(level => (
            <Option key={level} value={level}>
              {level}
            </Option>
          ))}
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 5,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
        }}
        scroll={{ x: 'max-content' }}
        bordered
        locale={{
          emptyText: <Empty description="No data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }}
      />
    </div>
  )
}

SessionHistory.propTypes = {
  userId: PropTypes.string.isRequired
}

export default SessionHistory
