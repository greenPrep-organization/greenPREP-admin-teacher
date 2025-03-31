import { useState, useEffect } from 'react'
import { Table, Input, Button, Tabs, Select, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const SessionParticipantList = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 50
  })
  const [searchText, setSearchText] = useState('')
  const [readyToPublish, setReadyToPublish] = useState(false)

  const levelOptions = [
    { value: 'A1', label: 'A1' },
    { value: 'A2', label: 'A2' },
    { value: 'B1', label: 'B1' },
    { value: 'B2', label: 'B2' },
    { value: 'C1', label: 'C1' },
    { value: 'C2', label: 'C2' }
  ]

  // Kiểm tra xem học sinh có đủ điều kiện để chọn level không
  const canSelectLevel = record => {
    return !Object.values(record.scores).includes('Ungraded')
  }

  // Lưu level khi người dùng chọn
  const handleLevelChange = async (value, record) => {
    try {
      setLoading(true)
      // TODO: Gọi API để lưu level
      await new Promise(resolve => setTimeout(resolve, 500))

      const newData = data.map(item => {
        if (item.key === record.key) {
          return { ...item, level: value }
        }
        return item
      })
      setData(newData)

      message.success('Level updated successfully')

      // Kiểm tra nút Ready to Publish
      const allHaveLevel = newData.every(item => item.level)
      setReadyToPublish(allHaveLevel)
    } catch {
      message.error('Failed to update level')
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
        const total = scores.reduce((sum, score) => sum + parseFloat(score), 0)
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

  // Fetch data từ server
  const fetchData = async (params = {}) => {
    try {
      setLoading(true)
      // TODO: Thay thế bằng API call thực tế
      await new Promise(resolve => setTimeout(resolve, 1000))

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

      // Kiểm tra nút Ready to Publish
      const allHaveLevel = filtered.every(item => item.level)
      setReadyToPublish(allHaveLevel)
    } catch {
      message.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(pagination)
  }, [searchText])

  const handleTableChange = newPagination => {
    fetchData({
      ...newPagination,
      pageSize: 10
    })
  }

  const handleSearch = value => {
    setSearchText(value)
  }

  const handleReadyToPublish = () => {
    if (!readyToPublish) {
      message.warning('Please ensure all students have been assigned a level')
      return
    }
    // TODO: Implement publish logic
    message.success('Session ready to be published')
  }

  const items = [
    {
      key: '1',
      label: (
        <div className="flex items-center gap-2 font-medium">
          <div className="px-4 py-1">Participants List</div>
          <div className="h-[2px] w-full bg-[#003366]"></div>
        </div>
      ),
      children: (
        <div className="participant-list">
          <div className="mb-4 flex justify-between">
            <div className="relative">
              <Input
                placeholder="Search student name"
                prefix={<SearchOutlined />}
                className="w-[300px]"
                onChange={e => handleSearch(e.target.value)}
                allowClear
              />
            </div>
            <Button type="primary" className="bg-blue-700" onClick={handleReadyToPublish} disabled={!readyToPublish}>
              Ready to publish
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              ...pagination,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: total => `Total ${total} items`
            }}
            onChange={handleTableChange}
            loading={loading}
            scroll={{ x: 1200 }}
            className="participants-table"
          />
        </div>
      )
    },
    {
      key: '2',
      label: <div className="px-4 py-1 font-medium">Pending Request</div>,
      children: 'Pending Request Content'
    }
  ]

  return (
    <div className="rounded-lg bg-white">
      <Tabs
        defaultActiveKey="1"
        items={items}
        className="px-6 pt-4"
        tabBarStyle={{
          margin: 0,
          borderBottom: 'none'
        }}
      />
    </div>
  )
}

export default SessionParticipantList
