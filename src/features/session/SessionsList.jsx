import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import DeleteSessionPopup from '@features/session/ui/delete-session-popup'
import { formatDate } from '@shared/lib/utils/index'
import { Breadcrumb, Button, Empty, Input, message, Space, Spin, Table, Tooltip } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'

const generateFakeData = () => {
  const statuses = ['Not Started', 'Ongoing', 'Completed']
  const now = new Date()

  return Array.from({ length: 50 }, (_, i) => {
    let startTime, endTime
    const status = statuses[i % 3]

    if (status === 'Not Started') {
      startTime = new Date(now.getTime() + 86400000 * ((i % 10) + 1))
      endTime = new Date(startTime.getTime() + 10800000)
    } else if (status === 'Ongoing') {
      startTime = new Date(now.getTime() - 3600000)
      endTime = new Date(now.getTime() + 3600000)
    } else {
      startTime = new Date(now.getTime() - 86400000 * ((i % 5) + 1))
      endTime = new Date(startTime.getTime() + 10800000)
    }

    return {
      id: `session-${i + 1}`,
      name: `Session ${i + 1}`,
      key: `GREFEB${i + 1}`,
      startTime,
      endTime,
      participants: Math.floor(Math.random() * 20) + 1,
      status
    }
  })
}

const SessionsList = () => {
  const [sessions, setSessions] = useState([])
  const [filteredSessions, setFilteredSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [deleteSessionId, setDeleteSessionId] = useState(null)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = generateFakeData()
        const sortedData = [...data].sort((a, b) => b.startTime.getTime() - a.startTime.getTime())

        setSessions(sortedData)
        setFilteredSessions(sortedData)
        setLoading(false)
      } catch (err) {
        setError('Unable to load sessions. Please try again later.')
        console.error(err)
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  useEffect(() => {
    if (!sessions.length) return

    const filtered = sessions.filter(session => {
      const matchesSearch =
        session.name.toLowerCase().includes(searchText.toLowerCase()) ||
        session.key.toLowerCase().includes(searchText.toLowerCase()) ||
        formatDate(session.startTime).includes(searchText) ||
        formatDate(session.endTime).includes(searchText)

      return matchesSearch
    })

    setFilteredSessions(filtered)
  }, [searchText, sessions])

  const handleDelete = async () => {
    if (!deleteSessionId) return
    setSessions(prevSessions => prevSessions.filter(session => session.id !== deleteSessionId))
    setDeleteSessionId(null)
    message.success('Session deleted successfully')
  }
  const handleViewSession = useCallback(id => {
    message.info(`Navigating to session details for ${id}`)
  }, [])

  const columns = useMemo(() => [
    {
      title: 'Session Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (text, record) => (
        <a onClick={() => handleViewSession(record.id)} className="text-blue-600 hover:text-blue-800">
          {text}
        </a>
      )
    },
    {
      title: 'Session Key',
      dataIndex: 'key',
      key: 'key',
      align: 'center'
    },
    {
      title: 'Start Date',
      dataIndex: 'startTime',
      key: 'startTime',
      align: 'center',
      render: date => formatDate(date),
      sorter: (a, b) => a.startTime.getTime() - b.startTime.getTime(),
      defaultSortOrder: 'descend'
    },
    {
      title: 'End Date',
      dataIndex: 'endTime',
      key: 'endTime',
      align: 'center',
      render: date => formatDate(date)
    },
    {
      title: 'Number of Participants',
      dataIndex: 'participants',
      key: 'participants',
      align: 'center'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: status => {
        let color = ''
        switch (status) {
          case 'Not Started':
            color = 'bg-blue-100 text-blue-800'
            break
          case 'Ongoing':
            color = 'bg-purple-100 text-purple-800'
            break
          case 'Completed':
            color = 'bg-green-100 text-green-800'
            break
        }
        return (
          <span className={`box-border rounded-[5px] px-6 py-1 text-center text-[13px] font-normal ${color}`}>
            {status}
          </span>
        )
      },
      filters: [
        { text: 'Not Started', value: 'Not Started' },
        { text: 'Ongoing', value: 'Ongoing' },
        { text: 'Completed', value: 'Completed' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined className="text-green-500" />}
              onClick={() => message.info(`Edit session ${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined className="text-red-500" />}
              onClick={() => setDeleteSessionId(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ])

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <div className="mb-4 text-lg text-red-500">{error}</div>
        <Button type="primary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>Classes</Breadcrumb.Item>
        <Breadcrumb.Item>Class List</Breadcrumb.Item>
        <Breadcrumb.Item>Class Details</Breadcrumb.Item>
        <Breadcrumb.Item>Sessions List</Breadcrumb.Item>
      </Breadcrumb>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sessions List</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('Create new session')}>
          Create Session
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search by name, key, date..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="w-full md:w-80"
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : filteredSessions.length > 0 ? (
        <Table
          dataSource={filteredSessions}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 3,
            showSizeChanger: true,
            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total}`
          }}
          className="overflow-x-auto"
        />
      ) : (
        <Empty
          description="No sessions found. Click here to create a new session."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('Create new session')}>
            Create Session
          </Button>
        </Empty>
      )}
      {deleteSessionId && (
        <DeleteSessionPopup
          isOpen={!!deleteSessionId}
          onClose={() => setDeleteSessionId(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default SessionsList
