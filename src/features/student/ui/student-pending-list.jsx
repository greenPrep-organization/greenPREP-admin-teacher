import { SearchOutlined } from '@ant-design/icons'
import { getPendingSessionRequests } from '@features/student/api'
import { DEFAULT_PAGINATION } from '@shared/lib/constants/pagination'
import { Button, Input, Table, message } from 'antd'
import { useEffect, useState } from 'react'

const PendingList = ({ sessionId }) => {
  const [loading, setLoading] = useState(false)
  const [pendingData, setPendingData] = useState([])
  const [pendingPagination, setPendingPagination] = useState(DEFAULT_PAGINATION)

  const [pendingSearchText, setPendingSearchText] = useState('')

  const handleEnrollStudent = async record => {
    try {
      setLoading(true)
      const newPendingData = pendingData.filter(item => item.key !== record.key)
      setPendingData(newPendingData)

      message.success(`${record.studentName} has been enrolled successfully`)
    } catch {
      message.error('Failed to enroll student')
    } finally {
      setLoading(false)
    }
  }
  const handleRejectStudent = async record => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      const newPendingData = pendingData.filter(item => item.key !== record.key)
      setPendingData(newPendingData)
      message.success(`${record.studentName}'s request has been rejected`)
    } catch {
      message.error('Failed to reject student')
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingData = async (params = {}) => {
    try {
      setLoading(true)

      // Call the API function instead of using mock data
      const response = await getPendingSessionRequests(sessionId)
      // Assuming the API returns an object with a "data" array:
      const apiData = response.data

      // Map the API fields to your component's expected fields.
      // Adjust this mapping as needed based on available information.
      const mappedData = apiData.map(item => ({
        key: item.ID,
        studentName: item.UserID, // Replace with actual student name if available
        studentId: item.UserID, // Or use another field that represents student id
        className: item.SessionID // Or another field if applicable
      }))

      // Implement filtering and pagination on mappedData
      const filtered = mappedData.filter(
        item =>
          item.studentName.toLowerCase().includes(pendingSearchText.toLowerCase()) ||
          item.studentId.toLowerCase().includes(pendingSearchText.toLowerCase()) ||
          item.className.toLowerCase().includes(pendingSearchText.toLowerCase())
      )

      setPendingData(filtered.slice((params.current - 1) * params.pageSize, params.current * params.pageSize))

      setPendingPagination({
        current: params.current || 1,
        pageSize: params.pageSize || 10,
        total: filtered.length
      })
    } catch {
      message.error('Failed to fetch pending data')
    } finally {
      setLoading(false)
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
    fetchPendingData({
      ...newPagination,
      pageSize: 10
    })
  }
  const handlePendingSearch = value => {
    setPendingSearchText(value)
  }

  useEffect(() => {
    fetchPendingData(pendingPagination)
  }, [pendingSearchText])
  useEffect(() => {
    fetchPendingData(pendingPagination)
  }, [pendingSearchText])
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
        loading={loading}
        scroll={{ x: 800 }}
      />
    </div>
  )
}
export default PendingList
