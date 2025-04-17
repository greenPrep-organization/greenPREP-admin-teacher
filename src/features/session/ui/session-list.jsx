// @ts-nocheck
import EditSession from '@/features/session/ui/edit-session'
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useSessions, useUpdateSession } from '@features/session/hooks'
import CreateSessionModal from '@features/session/ui/create-new-session'
import DeleteSessionPopup from '@features/session/ui/delete-session-popup'
import { formatDate, getStatusColor } from '@shared/lib/utils/index'
import { Button, Empty, Input, message, Space, Spin, Table, Typography } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SessionsList = ({ classId }) => {
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sessions, setSessions] = useState([])
  const limit = 10

  // Updated hook: pass an object with necessary API parameters
  const {
    data: sessionsResponse,
    isLoading,
    isError,
    refetch
  } = useSessions({
    classId,
    sessionName: searchText, // using searchText for filtering session name
    status: undefined, // adjust if needed
    page: currentPage,
    limit
  })

  // Derive sessions and pagination values from the response

  const updateSessionMutation = useUpdateSession(classId)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [deleteSessionId, setDeleteSessionId] = useState(null)
  const navigate = useNavigate()
  const { Title } = Typography

  const handlePageChange = pagination => {
    setCurrentPage(pagination)
  }

  // When sessionsResponse changes, update the local 'page' state if needed
  useEffect(() => {
    if (sessionsResponse && sessionsResponse?.sessions) {
      setSessions(sessionsResponse.sessions)
    }
  }, [sessionsResponse])

  const handleViewSession = useCallback(
    sessionId => {
      navigate(`/classes-management/${classId}/session/${sessionId}`)
    },
    [navigate, classId]
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
            refetch()
          },
          onError: error => {
            message.error(error.message || 'Failed to update session')
          }
        }
      )
    },
    [selectedSession, classId, updateSessionMutation, refetch]
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
        sorter: (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
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
        title: 'Status',
        key: 'status',
        align: 'center',
        render: (_, record) => {
          const color = getStatusColor(record.status)
          return (
            <span
              className={`box-border rounded-[5px] px-6 py-1 text-center text-[13px] font-normal ${color.bg} ${color.text}`}
            >
              {record.status?.replace('_', ' ')}
            </span>
          )
        },
        filters: [
          { text: 'NOT STARTED', value: 'NOT_STARTED' },
          { text: 'ON GOING', value: 'ON_GOING' },
          { text: 'COMPLETE', value: 'COMPLETE' }
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
          onChange={e => {
            setSearchText(e.target.value)
          }}
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

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : isError ? (
        <div className="flex h-64 flex-col items-center justify-center">
          <div className="mb-4 text-lg text-red-500">Unable to load sessions. Please try again later.</div>
          <Button type="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      ) : sessions.length > 0 ? (
        <Table
          dataSource={sessions}
          columns={columns}
          rowKey="id"
          pagination={{
            current: sessionsResponse.currentPage,
            pageSize: sessionsResponse.limit,
            total: sessionsResponse.total,
            showTotal: (total, range) => (total > 0 ? `Showing ${range[0]}-${range[1]} of ${total}` : 'No data'),
            onChange: handlePageChange,
            itemRender: (page, type, originalElement) => {
              if (type === 'page') {
                return (
                  <Button
                    type={page === currentPage ? 'primary' : 'default'}
                    className={page === currentPage ? 'bg-blue-700 hover:bg-blue-800' : 'bg-white hover:bg-gray-50'}
                  >
                    {page}
                  </Button>
                )
              }
              return originalElement
            }
          }}
          className="overflow-x-auto"
        />
      ) : (
        <Empty
          description="No sessions found. To create a new session click on create session."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
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
