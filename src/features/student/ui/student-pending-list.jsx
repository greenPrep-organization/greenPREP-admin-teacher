import { SearchOutlined } from '@ant-design/icons'
import { usePendingSessionRequests } from '@features/student/hooks/index'
import { DEFAULT_PAGINATION } from '@shared/lib/constants/pagination'
import { Button, Input, Table, message } from 'antd'
import { useEffect, useState } from 'react'

const PendingList = ({ sessionId }) => {
  const { data: pendingDataRaw = [], isLoading, isError } = usePendingSessionRequests(sessionId)
  const [pendingData, setPendingData] = useState([])
  const [pendingPagination, setPendingPagination] = useState(DEFAULT_PAGINATION)
  const [pendingSearchText, setPendingSearchText] = useState('')

  // When data is fetched or updated, apply filtering and pagination.
  useEffect(() => {
    console.log(pendingDataRaw, 'pending')
    if (!pendingDataRaw.length) return

    const filtered = pendingDataRaw.filter(
      item =>
        item.studentName.toLowerCase().includes(pendingSearchText.toLowerCase()) ||
        item.studentId.toLowerCase().includes(pendingSearchText.toLowerCase()) ||
        item.className.toLowerCase().includes(pendingSearchText.toLowerCase())
    )

    // Update local pagination and filtered data.
    setPendingPagination(prev => ({
      ...prev,
      total: filtered.length,
      current: 1
    }))
    setPendingData(filtered.slice(0, pendingPagination.pageSize))
  }, [pendingDataRaw, pendingSearchText, pendingPagination.pageSize])

  const handleEnrollStudent = async record => {
    try {
      // Here you might call an API to enroll the student
      const newData = pendingData.filter(item => item.key !== record.key)
      setPendingData(newData)
      message.success(`${record.studentName} has been enrolled successfully`)
    } catch {
      message.error('Failed to enroll student')
    }
  }

  const handleRejectStudent = async record => {
    try {
      // Here you might call an API to reject the student
      const newData = pendingData.filter(item => item.key !== record.key)
      setPendingData(newData)
      message.success(`${record.studentName}'s request has been rejected`)
    } catch {
      message.error('Failed to reject student')
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
            onClick={() => handleEnrollStudent(record)}
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
    // Implement pagination change by slicing the filtered results.
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
      total: filtered.length
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
        <div className="mb-4 flex justify-between">
          <div className="relative">
            <Input
              placeholder="Search by student name, ID or class"
              prefix={<SearchOutlined className="text-text-secondary" />}
              value={pendingSearchText}
              onChange={e => handlePendingSearch(e.target.value)}
              className="w-64"
            />
          </div>
        </div>
      </div>
      <Table
        columns={pendingColumns}
        dataSource={pendingData}
        pagination={pendingPagination}
        onChange={handlePendingTableChange}
        loading={false}
        scroll={{ x: 800 }}
      />
    </div>
  )
}

export default PendingList
