// @ts-nocheck
import EditSession from '@/features/session/ui/edit-session'
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useSessions, useUpdateSession } from '@features/session/hooks'
import CreateSessionModal from '@features/session/ui/create-new-session'
import DeleteSessionPopup from '@features/session/ui/delete-session-popup'
import { DEFAULT_PAGINATION } from '@shared/lib/constants/pagination'
import { formatDate, getStatusColor } from '@shared/lib/utils/index'
import { Button, Empty, Input, message, Space, Spin, Table, Typography } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SessionsList = ({ classId }) => {
  const { data: sessions = [], isLoading, isError } = useSessions(classId)
  const updateSessionMutation = useUpdateSession(classId)
  const [filteredSessions, setFilteredSessions] = useState([])
  const [searchText, setSearchText] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [deleteSessionId, setDeleteSessionId] = useState(null)
  const navigate = useNavigate()
  const { Text, Title } = Typography

  useEffect(() => {
    setFilteredSessions(sessions)
  }, [sessions])

  useEffect(() => {
    if (!sessions.length) return
    console.log(sessions)
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

  const handleViewSession = useCallback(
    sessionId => {
      navigate(`/classes-management/${classId}/session/${sessionId}`)
    },
    [navigate]
  )

  const handleEdit = useCallback(session => {
    setSelectedSession(session)
    setEditModalVisible(true)
  }, [])

  const handleUpdate = useCallback(
    updatedSession => {
      if (!selectedSession) return

      const formattedData = {
        sessionName: updatedSession.name,
        sessionKey: updatedSession.key,
        startTime: updatedSession.startTime.toISOString(),
        endTime: updatedSession.endTime.toISOString(),
        status: selectedSession.status,
        ClassID: classId
      }

      updateSessionMutation.mutate(
        {
          sessionId: selectedSession.id,
          data: formattedData
        },
        {
          onSuccess: () => {
            setEditModalVisible(false)
            setSelectedSession(null)
            message.success('Session updated successfully')
          },
          onError: error => {
            message.error(error.message || 'Failed to update session')
          }
        }
      )
    },
    [selectedSession, classId, updateSessionMutation]
  )

  const columns = useMemo(
    () => [
      {
        title: 'Session Name',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        render: (text, record) => (
          <a onClick={() => handleViewSession(record.id)} className="text-blue-800 hover:text-blue-800">
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
        key: 'status',
        align: 'center',
        render: (_, record) => {
          const now = new Date()
          const start = new Date(record.startTime)
          const end = new Date(record.endTime)

          let status = 'NOT_STARTED'
          if (now >= end) {
            status = 'COMPLETE'
          } else if (now >= start && now < end) {
            status = 'IN_PROGRESS'
          }

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
          { text: 'COMPLETE', value: 'COMPLETE' }
        ],
        onFilter: (value, record) => {
          const now = new Date()
          const start = new Date(record.startTime)
          const end = new Date(record.endTime)

          let status = 'NOT_STARTED'
          if (now >= end) {
            status = 'COMPLETE'
          } else if (now >= start && now < end) {
            status = 'IN_PROGRESS'
          }

          return status === value
        }
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
        <div>
          <Title
            level={5}
            style={{
              fontSize: '16px',
              fontWeight: '500',
              marginBottom: '8px',
              paddingBottom: '8px',
              borderBottom: '1px solid #f0f0f0'
            }}
          >
            Sessions List
          </Title>
        </div>
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            className="bg-[#013088] hover:bg-[#003087]/90"
          >
            Create Session
          </Button>
        </div>
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
            showTotal: (total, range) => (
              <Text
                type="secondary"
                style={{
                  position: 'absolute',
                  left: 0,
                  fontSize: '14px'
                }}
              >
                Showing {range[0]}-{range[1]} of {total}
              </Text>
            )
          }}
          className="overflow-x-auto"
        />
      ) : (
        <Empty
          description="No sessions found. Click here to create a new session."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        ></Empty>
      )}

      <CreateSessionModal open={isModalVisible} onClose={() => setIsModalVisible(false)} classId={classId} />

      {deleteSessionId && (
        <DeleteSessionPopup
          isOpen={!!deleteSessionId}
          onClose={() => setDeleteSessionId(null)}
          sessionId={deleteSessionId}
        />
      )}
    </div>
  )
}

export default SessionsList
