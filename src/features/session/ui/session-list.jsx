import EditSession from '@/features/session/ui/edit-session'
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useSessions } from '@features/session/hooks'
import CreateSessionModal from '@features/session/ui/create-new-session'
import DeleteSessionPopup from '@features/session/ui/delete-session-popup'
import { DEFAULT_PAGINATION } from '@shared/lib/constants/pagination'
import { formatDate, getStatusColor } from '@shared/lib/utils/index'
import { Button, Empty, Input, Space, Spin, Table, message } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const testSets = [
  {
    id: 1,
    name: 'Test Set 1'
  },
  {
    id: 2,
    name: 'Test Set 2'
  },
  {
    id: 3,
    name: 'Test Set 3'
  },
  {
    id: 4,
    name: 'Test Set 4'
  }
]

const SessionsList = ({ classId }) => {
  const { data: sessions = [], isLoading, isError } = useSessions(classId)
  const [filteredSessions, setFilteredSessions] = useState([])
  const [searchText, setSearchText] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [deleteSessionId, setDeleteSessionId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    console.log(sessions)
    setFilteredSessions(sessions)
  }, [sessions])

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
    setFilteredSessions(updatedSessions)
    setDeleteSessionId(null)
    message.success('Session deleted successfully')
  }

  const handleViewSession = useCallback(
    id => {
      navigate(`/session/${id}`, { replace: true })
    },
    [navigate]
  )

  const handleEdit = useCallback(session => {
    setSelectedSession(session)
    setEditModalVisible(true)
  }, [])

  const handleUpdate = useCallback(
    updatedSession => {
      const updatedSessions = sessions.map(session =>
        session.id === selectedSession.id ? { ...session, ...updatedSession } : session
      )
      setFilteredSessions(updatedSessions)
      setEditModalVisible(false)
      setSelectedSession(null)
      message.success('Session updated successfully')
    },
    [selectedSession, sessions]
  )

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
            <a onClick={() => handleEdit(record)}>
              <EditOutlined className="text-green-500" />
            </a>
            <a onClick={() => setDeleteSessionId(record.id)}>
              <DeleteOutlined className="text-red-500" />
            </a>
          </Space>
        )
      }
    ],
    [handleViewSession, handleEdit]
  )

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <div className="mb-4 text-lg text-red-500">Unable to load sessions. Please try again later.</div>
        <Button type="primary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sessions List</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          style={{ backgroundColor: '#013088' }}
        >
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

      <EditSession
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false)
          setSelectedSession(null)
        }}
        onUpdate={handleUpdate}
        initialValues={selectedSession}
      />

      {filteredSessions.length > 0 ? (
        <Table
          dataSource={filteredSessions}
          columns={columns}
          rowKey="id"
          pagination={{
            ...DEFAULT_PAGINATION,
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
        testSets={testSets}
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
