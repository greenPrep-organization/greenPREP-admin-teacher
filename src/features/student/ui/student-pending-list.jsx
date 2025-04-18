// @ts-nocheck
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { saveToIndexedDB } from '@features/session/api/indexdb'
import {
  useApproveSessionRequest,
  usePendingSessionRequests,
  useRejectSessionRequest
} from '@features/student/hooks/index'
import ApproveSessionPopup from '@features/student/ui/approve-session-request'
import RejectSessionPopup from '@features/student/ui/reject-session-request'
import { DEFAULT_PAGINATION } from '@shared/lib/constants/pagination'
import { Button, Input, Table, message } from 'antd'
import { useEffect, useState } from 'react'

const PendingList = ({ sessionId, onStudentApproved, setSeenPendingCount }) => {
  // Include refetch from the custom hook to reload data
  const { data: pendingDataRaw = [], isLoading, isError, refetch } = usePendingSessionRequests(sessionId)
  const [pendingData, setPendingData] = useState([])
  const [pendingPagination, setPendingPagination] = useState({
    ...DEFAULT_PAGINATION,
    size: 'default'
  })
  const [pendingSearchText, setPendingSearchText] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const { mutate: approveRequest, isPending: isApproving } = useApproveSessionRequest(sessionId)
  const { mutate: rejectRequest, isPending: isRejecting } = useRejectSessionRequest(sessionId)

  useEffect(() => {
    setSeenPendingCount(pendingDataRaw.length)
    saveToIndexedDB(sessionId, pendingDataRaw.length)
    if (!pendingDataRaw.length) return

    const filtered = pendingDataRaw.filter(
      item =>
        item.studentName.toLowerCase().includes(pendingSearchText.toLowerCase()) ||
        item.studentId.toLowerCase().includes(pendingSearchText.toLowerCase()) ||
        item.className.toLowerCase().includes(pendingSearchText.toLowerCase())
    )

    setPendingPagination(prev => ({
      ...prev,
      total: filtered.length,
      current: 1
    }))
    setPendingData(filtered.slice(0, pendingPagination.pageSize))
  }, [pendingDataRaw, pendingSearchText, pendingPagination.pageSize])

  const handleRejectStudent = async record => {
    setSelectedRequest(record)
    setIsRejectModalOpen(true)
  }

  const handleApproveStudent = async record => {
    setSelectedRequest(record)
    setIsApproveModalOpen(true)
  }

  const handleConfirmApprove = async () => {
    try {
      await approveRequest(selectedRequest.key)
      const newData = pendingData.filter(item => item.key !== selectedRequest.key)
      setPendingData(newData)
      setPendingPagination(prev => ({
        ...prev,
        total: prev.total - 1
      }))
      message.success(`${selectedRequest.studentName} has been approved successfully`)
      onStudentApproved()
    } catch (error) {
      message.error(error.message || 'Failed to approve student')
    } finally {
      setIsApproveModalOpen(false)
      setSelectedRequest(null)
    }
  }

  const handleConfirmReject = async () => {
    try {
      await rejectRequest(selectedRequest.key)
      const newData = pendingData.filter(item => item.key !== selectedRequest.key)
      setPendingData(newData)
      setPendingPagination(prev => ({
        ...prev,
        total: prev.total - 1
      }))
      message.success(`${selectedRequest.studentName}'s request has been rejected`)
    } catch (error) {
      message.error(error.message || 'Failed to reject student')
    } finally {
      setIsRejectModalOpen(false)
      setSelectedRequest(null)
    }
  }

  const pendingColumns = [
    {
      title: 'Student Name',
      dataIndex: 'studentName',
      key: 'studentName',
      align: 'center',
      width: '30%',
      sorter: (a, b) => a.studentName.localeCompare(b.studentName)
    },
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      key: 'studentId',
      width: '25%',
      align: 'center'
    },
    {
      title: 'Class Name',
      dataIndex: 'className',
      key: 'className',
      width: '25%',
      align: 'center'
    },
    {
      title: 'Action',
      key: 'action',
      width: '20%',
      align: 'center',
      render: (_, record) => (
        <div className="flex flex-row justify-center">
          <Button
            type="text"
            className="flex items-center justify-center text-green-500 hover:text-green-700"
            onClick={() => handleApproveStudent(record)}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-green-500">✓</span>
          </Button>
          <Button
            type="text"
            className="flex items-center justify-center text-red-500 hover:text-red-700"
            onClick={() => handleRejectStudent(record)}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-red-500">✕</span>
          </Button>
        </div>
      )
    }
  ]

  const handlePendingTableChange = newPagination => {
    const start = (newPagination.current - 1) * newPagination.pageSize
    const end = newPagination.current * newPagination.pageSize
    const filtered = pendingDataRaw.filter(
      item =>
        item.studentName.toLowerCase().includes(pendingSearchText.toLowerCase()) ||
        item.studentId.toLowerCase().includes(pendingSearchText.toLowerCase()) ||
        item.className.toLowerCase().includes(pendingSearchText.toLowerCase())
    )
    setPendingData(filtered.slice(start, end))
    setPendingPagination({
      ...newPagination,
      total: filtered.length,
      size: 'default'
    })
  }

  const handlePendingSearch = value => {
    setPendingSearchText(value)
  }

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Failed to fetch pending data</p>

  return (
    <div>
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="relative">
            <Input
              placeholder="Search by student name, ID or class"
              prefix={<SearchOutlined className="text-text-secondary" />}
              value={pendingSearchText}
              onChange={e => handlePendingSearch(e.target.value)}
              className="w-64"
            />
          </div>
          <div className="flex gap-3">
            <Button type="default" icon={<ReloadOutlined />} onClick={refetch}>
              Refresh
            </Button>
            <Button
              danger
              disabled={!pendingData.length}
              onClick={async () => {
                try {
                  const keys = pendingData.map(item => item.key)
                  for (const key of keys) {
                    await rejectRequest(key)
                  }
                  setPendingData([])
                  setPendingPagination(prev => ({
                    ...prev,
                    total: 0
                  }))
                  message.success('All pending requests have been rejected.')
                } catch {
                  message.error('Failed to reject all requests')
                }
              }}
            >
              Reject All
            </Button>
          </div>
        </div>
      </div>
      <Table
        columns={pendingColumns}
        dataSource={pendingData}
        pagination={pendingPagination}
        onChange={handlePendingTableChange}
        loading={isLoading}
        scroll={{ x: 800 }}
      />
      <ApproveSessionPopup
        isOpen={isApproveModalOpen}
        onClose={() => {
          setIsApproveModalOpen(false)
          setSelectedRequest(null)
        }}
        onApprove={handleConfirmApprove}
        studentName={selectedRequest?.studentName}
        loading={isApproving}
      />
      <RejectSessionPopup
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false)
          setSelectedRequest(null)
        }}
        onReject={handleConfirmReject}
        studentName={selectedRequest?.studentName}
        loading={isRejecting}
      />
    </div>
  )
}

export default PendingList
