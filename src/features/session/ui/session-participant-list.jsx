import { useState, useEffect } from 'react'
import { Table, Input, Button, Tabs, Select, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { getSessionParticipants, updateParticipantLevel, publishSessionResults } from '../api'
import { useParams } from 'react-router-dom'

const SessionParticipantList = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [searchText, setSearchText] = useState('')
  const [readyToPublish, setReadyToPublish] = useState(false)
  const { sessionId } = useParams()

  const levelOptions = [
    { value: 'A1', label: 'A1' },
    { value: 'A2', label: 'A2' },
    { value: 'B1', label: 'B1' },
    { value: 'B2', label: 'B2' },
    { value: 'C1', label: 'C1' },
    { value: 'C2', label: 'C2' }
  ]

  const canSelectLevel = record => {
    return record.Total > 0
  }

  const handleLevelChange = async (value, record) => {
    try {
      setLoading(true)
      await updateParticipantLevel(sessionId, record.ID, value)

      const newData = data.map(item => {
        if (item.ID === record.ID) {
          return { ...item, Level: value }
        }
        return item
      })
      setData(newData)

      message.success('Level updated successfully')

      const allHaveLevel = newData.every(item => item.Level)
      setReadyToPublish(allHaveLevel)
    } catch (error) {
      message.error(error.message || 'Failed to update level')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'Student Name',
      dataIndex: ['User', 'fullName'],
      key: 'studentName',
      width: '20%',
      render: text => text || 'N/A'
    },
    {
      title: 'Grammar & Vocab',
      dataIndex: 'GrammarVocab',
      key: 'grammar',
      width: '12%',
      render: text => text || 'N/A'
    },
    {
      title: 'Listening',
      dataIndex: 'Listening',
      key: 'listening',
      width: '12%',
      render: text => text || 'N/A'
    },
    {
      title: 'Reading',
      dataIndex: 'Reading',
      key: 'reading',
      width: '12%',
      render: text => text || 'N/A'
    },
    {
      title: 'Speaking',
      dataIndex: 'Speaking',
      key: 'speaking',
      width: '12%',
      render: text => text || 'N/A'
    },
    {
      title: 'Writing',
      dataIndex: 'Writing',
      key: 'writing',
      width: '12%',
      render: text => text || 'N/A'
    },
    {
      title: 'Total',
      dataIndex: 'Total',
      key: 'total',
      width: '10%',
      render: text => text || 'N/A'
    },
    {
      title: 'Level',
      dataIndex: 'Level',
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

  const fetchData = async (params = {}) => {
    try {
      setLoading(true)
      console.log('Fetching participants for session:', sessionId)
      const response = await getSessionParticipants(sessionId, {
        page: params.current,
        limit: params.pageSize,
        search: searchText
      })
      console.log('Participants data received:', response.data)

      setData(response.data || [])
      setPagination({
        current: params.current || 1,
        pageSize: params.pageSize || 10,
        total: response.data?.length || 0
      })

      const allHaveLevel = (response.data || []).every(item => item.Level)
      setReadyToPublish(allHaveLevel)
    } catch (error) {
      console.error('Error fetching participants:', error)
      message.error(error.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (sessionId) {
      fetchData(pagination)
    }
  }, [searchText, sessionId])

  const handleTableChange = newPagination => {
    fetchData({
      ...newPagination,
      pageSize: 10
    })
  }

  const handleSearch = value => {
    setSearchText(value)
  }

  const handleReadyToPublish = async () => {
    if (!readyToPublish) {
      message.warning('Please ensure all students have been assigned a level')
      return
    }
    try {
      await publishSessionResults(sessionId)
      message.success('Session results published successfully')
    } catch (error) {
      message.error(error.message || 'Failed to publish session results')
    }
  }

  const items = [
    {
      key: '1',
      label: (
        <div key="participants-tab" className="flex items-center gap-2 font-medium">
          <div key="participants-label" className="px-4 py-1">
            Participants List
          </div>
          <div key="participants-line" className="h-[2px] w-full bg-primary"></div>
        </div>
      ),
      children: (
        <div className="participant-list">
          <div className="mb-4 flex justify-between">
            <div className="relative">
              <Input
                key="search-input"
                placeholder="Search by student name"
                prefix={<SearchOutlined key="search-icon" className="text-text-secondary" />}
                value={searchText}
                onChange={e => handleSearch(e.target.value)}
                className="w-64"
              />
            </div>
            <Button
              key="publish-button"
              type="primary"
              disabled={!readyToPublish}
              onClick={handleReadyToPublish}
              className={`${readyToPublish ? 'bg-primary text-white' : 'bg-bg-gray text-text-disabled'}`}
            >
              Ready to Publish
            </Button>
          </div>

          <Table
            key="participants-table"
            columns={columns}
            dataSource={data}
            pagination={pagination}
            onChange={handleTableChange}
            loading={loading}
            scroll={{ x: 1200 }}
            rowKey="ID"
          />
        </div>
      )
    },
    {
      key: '2',
      label: (
        <div key="pending-label" className="px-4 py-1 font-medium">
          Pending Request
        </div>
      ),
      children: <div key="pending-content">Pending Request Content</div>
    }
  ]

  return (
    <div key="session-participant-list" className="rounded-lg bg-white">
      <Tabs
        key="session-tabs"
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
