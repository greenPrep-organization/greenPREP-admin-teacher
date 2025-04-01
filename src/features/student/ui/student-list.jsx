import { SearchOutlined } from '@ant-design/icons'
import { DEFAULT_PAGINATION } from '@shared/lib/constants/pagination'
import { Button, Input, Select, Table, Tabs, message } from 'antd'
import { useEffect, useState } from 'react'

const Studentlist = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pendingData, setPendingData] = useState([])
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION)
  const [pendingPagination, setPendingPagination] = useState(DEFAULT_PAGINATION)
  const [searchText, setSearchText] = useState('')
  const [pendingSearchText, setPendingSearchText] = useState('')
  const [readyToPublish, setReadyToPublish] = useState(false)

  const levelOptions = [
    { value: 'A1', label: 'A1' },
    { value: 'A2', label: 'A2' },
    { value: 'B1', label: 'B1' },
    { value: 'B2', label: 'B2' },
    { value: 'C1', label: 'C1' },
    { value: 'C2', label: 'C2' }
  ]

  const canSelectLevel = record => {
    return !Object.values(record.scores).includes('Ungraded')
  }

  const handleLevelChange = async (value, record) => {
    try {
      setLoading(true)

      const newData = data.map(item => {
        if (item.key === record.key) {
          return { ...item, level: value }
        }
        return item
      })
      setData(newData)

      message.success('Level updated successfully')

      const allHaveLevel = newData.every(item => item.level)
      setReadyToPublish(allHaveLevel)
    } catch {
      message.error('Failed to update level')
    } finally {
      setLoading(false)
    }
  }

  const handleEnrollStudent = async record => {
    try {
      setLoading(true)
      const newPendingData = pendingData.filter(item => item.key !== record.key)
      setPendingData(newPendingData)

      const newStudent = {
        ...record,
        scores: {
          grammar: 'Ungraded',
          listening: 'Ungraded',
          reading: 'Ungraded',
          speaking: 'Ungraded',
          writing: 'Ungraded'
        }
      }
      setData([...data, newStudent])

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

  const columns = [
    {
      title: 'Student Name',
      dataIndex: 'studentName',
      key: 'studentName',
      width: '20%',
      sorter: (a, b) => a.studentName.localeCompare(b.studentName)
    },
    {
      title: 'Grammar & Vocab',
      dataIndex: ['scores', 'grammar'],
      key: 'grammar',
      width: '12%'
    },
    {
      title: 'Listening',
      dataIndex: ['scores', 'listening'],
      key: 'listening',
      width: '12%'
    },
    {
      title: 'Reading',
      dataIndex: ['scores', 'reading'],
      key: 'reading',
      width: '12%'
    },
    {
      title: 'Speaking',
      dataIndex: ['scores', 'speaking'],
      key: 'speaking',
      width: '12%'
    },
    {
      title: 'Writing',
      dataIndex: ['scores', 'writing'],
      key: 'writing',
      width: '12%'
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: '10%',
      render: (_, record) => {
        const scores = Object.values(record.scores)
        if (scores.includes('Ungraded')) return 'Pending'
        const total = scores.reduce((sum, score) => sum + Number.parseFloat(score), 0)
        return (total / scores.length).toFixed(1)
      }
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: '10%',
      render: (level, record) => (
        <Select
          value={level}
          options={levelOptions}
          disabled={!canSelectLevel(record)}
          onChange={value => handleLevelChange(value, record)}
          style={{ width: '100%' }}
          placeholder="Select level"
        />
      )
    }
  ]

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

  const fetchData = async (params = {}) => {
    try {
      setLoading(true)

      const mockData = Array.from({ length: 50 }, (_, index) => ({
        key: index.toString(),
        studentName: `Student ${index + 1}`,
        scores: {
          grammar: Math.random() > 0.2 ? (Math.random() * 10).toFixed(1) : 'Ungraded',
          listening: Math.random() > 0.2 ? (Math.random() * 10).toFixed(1) : 'Ungraded',
          reading: Math.random() > 0.2 ? (Math.random() * 10).toFixed(1) : 'Ungraded',
          speaking: Math.random() > 0.2 ? (Math.random() * 10).toFixed(1) : 'Ungraded',
          writing: Math.random() > 0.2 ? (Math.random() * 10).toFixed(1) : 'Ungraded'
        },
        level: Math.random() > 0.3 ? levelOptions[Math.floor(Math.random() * levelOptions.length)].value : undefined
      }))

      const filtered = mockData.filter(item => item.studentName.toLowerCase().includes(searchText.toLowerCase()))

      setData(filtered.slice((params.current - 1) * params.pageSize, params.current * params.pageSize))
      setPagination({
        current: params.current || 1,
        pageSize: params.pageSize || 10,
        total: filtered.length
      })

      const allHaveLevel = filtered.every(item => item.level)
      setReadyToPublish(allHaveLevel)
    } catch {
      message.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingData = async (params = {}) => {
    try {
      setLoading(true)

      const mockPendingData = Array.from({ length: 20 }, (_, index) => ({
        key: `pending-${index}`,
        studentName: `A Nguyen`,
        studentId: `GCD21${index.toString().padStart(4, '0')}`,
        className: 'GCD1102'
      }))

      const filtered = mockPendingData.filter(
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

  useEffect(() => {
    fetchData(pagination)
  }, [searchText])

  useEffect(() => {
    fetchPendingData(pendingPagination)
  }, [pendingSearchText])

  const handleTableChange = newPagination => {
    fetchData({
      ...newPagination,
      pageSize: 10
    })
  }

  const handlePendingTableChange = newPagination => {
    fetchPendingData({
      ...newPagination,
      pageSize: 10
    })
  }

  const handleSearch = value => {
    setSearchText(value)
  }

  const handlePendingSearch = value => {
    setPendingSearchText(value)
  }

  const handleReadyToPublish = () => {
    if (!readyToPublish) {
      message.warning('Please ensure all students have been assigned a level')
      return
    }
    message.success('Session ready to be published')
  }

  const items = [
    {
      key: '1',
      label: (
        <div className="flex items-center gap-2 font-medium">
          <div className="px-4 py-1">Participants List</div>
          <div className="h-[20px] w-full bg-primary"></div>
        </div>
      ),
      children: (
        <div className="participant-list mt-8">
          <div className="mb-4 flex justify-between">
            <div className="relative">
              <Input
                placeholder="Search by student name"
                prefix={<SearchOutlined className="text-text-secondary" />}
                value={searchText}
                onChange={e => handleSearch(e.target.value)}
                className="w-64"
              />
            </div>
            <Button
              type="primary"
              disabled={!readyToPublish}
              onClick={handleReadyToPublish}
              className={`${readyToPublish ? 'bg-primary text-white' : 'bg-bg-gray text-text-disabled'}`}
            >
              Ready to Publish
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={data}
            pagination={pagination}
            onChange={handleTableChange}
            loading={loading}
            scroll={{ x: 1200 }}
          />
        </div>
      )
    },
    {
      key: '2',
      label: <div className="px-4 py-1 font-medium">Pending Request</div>,
      children: (
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
  ]

  return (
    <div className="rounded-lg bg-white">
      <Tabs
        defaultActiveKey="1"
        items={items}
        className="px-6"
        tabBarStyle={{
          margin: 0,
          borderBottom: 'none'
        }}
      />
    </div>
  )
}

export default Studentlist
