import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { getSessionsByClassId } from '@features/session/api' // Adjust the path to where your fetch function is declared
import CreateSessionModal from '@features/session/ui/create-new-session'
import DeleteSessionPopup from '@features/session/ui/delete-session-popup'
import { formatDate, getStatusColor } from '@shared/lib/utils/index'
import { Breadcrumb, Button, Empty, Input, message, Space, Spin, Table, Tooltip } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'

const SessionsList = () => {
  const [sessions, setSessions] = useState([])
  const [filteredSessions, setFilteredSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [deleteSessionId, setDeleteSessionId] = useState(null)

  // Fetch sessions from the API using the external function
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await getSessionsByClassId('1db40057-623d-4597-b267-520dedd4dc76')
        if (response.status === 200) {
          const data = response.data.data
          // Map API response fields to table fields
          const mappedSessions = data
            .map(item => ({
              id: item.ID,
              name: item.sessionName,
              key: item.sessionKey,
              startTime: new Date(item.startTime),
              endTime: new Date(item.endTime),
              // Defaulting Number of Participants to 0 (update if needed)
              participants: 0,
              status: item.status
            }))
            .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())

          setSessions(mappedSessions)
          setFilteredSessions(mappedSessions)
        }
        setLoading(false)
      } catch (err) {
        setError('Unable to load sessions. Please try again later.')
        console.error(err)
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  // Filter sessions by search text
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
    const updatedSessions = sessions.filter(session => session.id !== deleteSessionId)
    setSessions(updatedSessions)
    setFilteredSessions(updatedSessions)
    setDeleteSessionId(null)
    message.success('Session deleted successfully')
  }

  const handleViewSession = useCallback(id => {
    message.info(`Navigating to session details for ${id}`)
  }, [])

  const handleCreateSession = useCallback(
    async sessionData => {
      try {
        const newSession = {
          id: `session-${sessions.length + 1}`,
          name: sessionData.name,
          key: sessionData.key,
          startTime: sessionData.startTime,
          endTime: sessionData.endTime,
          participants: 0,
          status: 'Pending'
        }

        const updatedSessions = [newSession, ...sessions]
        setSessions(updatedSessions)
        setFilteredSessions(updatedSessions)
      } catch (err) {
        message.error('Failed to create session')
        console.error(err)
      }
    },
    [sessions]
  )

  const columns = useMemo(
    () => [
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
          const { bg, text } = getStatusColor(status)
          return (
            <span className={`box-border rounded-[5px] px-6 py-1 text-center text-[13px] font-normal ${bg} ${text}`}>
              {status}
            </span>
          )
        },
        filters: [
          { text: 'NOT_STARTED', value: 'NOT_STARTED' },
          { text: 'IN_PROGRESS', value: 'IN_PROGRESS' },
          { text: 'COMPLETED', value: 'COMPLETED' }
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
    ],
    [handleViewSession]
  )

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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
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
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Create Session
          </Button>
        </Empty>
      )}

      <CreateSessionModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleCreateSession}
      />
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
