// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
import { SearchOutlined } from '@ant-design/icons'
import { getSessionParticipants, updateParticipantLevelById } from '@features/session/api'
import { Input, Select, Table, Tabs, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PendingList from '../../student/ui/student-pending-list'
import PublishPopup from './publish-popup'

const SessionParticipantList = () => {
  const [loading, setLoading] = useState(false)
  const { id } = useParams()
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [searchText, setSearchText] = useState('')
  const [readyToPublish, setReadyToPublish] = useState(false)
  const { sessionId } = useParams()
  const [originalData, setOriginalData] = useState([])
  const navigate = useNavigate()

  const levelOptions = [
    { value: 'A1', label: 'A1' },
    { value: 'A2', label: 'A2' },
    { value: 'B1', label: 'B1' },
    { value: 'B2', label: 'B2' },
    { value: 'C', label: 'C' },
    { value: 'X', label: 'X' }
  ]

  const canSelectLevel = record => {
    return record.Total > 0
  }

  const handleLevelChange = async (record, value) => {
    try {
      setLoading(true)
      await updateParticipantLevelById(record.ID, value)

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
      render: (text, record) => (
        <span
          className="cursor-pointer text-blue-600 hover:underline"
          onClick={() => {
            navigate(`/classes-management/${id}/${sessionId}/students/${record.User?.ID}`)
          }}
        >
          {text || 'N/A'}
        </span>
      ),
      align: 'center'
    },
    {
      title: 'Grammar & Vocab',
      dataIndex: 'GrammarVocab',
      key: 'grammar',
      width: '12%',
      responsive: ['md'],
      render: text => text || '-',
      align: 'center'
    },
    {
      title: 'Listening',
      dataIndex: 'Listening',
      key: 'listening',
      width: '12%',
      responsive: ['md'],
      render: text => text || '-',
      align: 'center'
    },
    {
      title: 'Reading',
      dataIndex: 'Reading',
      key: 'reading',
      width: '12%',
      responsive: ['md'],
      render: text => text || '-',
      align: 'center'
    },
    {
      title: 'Speaking',
      dataIndex: 'Speaking',
      key: 'speaking',
      width: '12%',
      responsive: ['md'],
      render: text => text || 'Ungrade',
      align: 'center'
    },
    {
      title: 'Writing',
      dataIndex: 'Writing',
      key: 'writing',
      width: '12%',
      responsive: ['md'],
      render: text => text || 'Ungrade',
      align: 'center'
    },
    {
      title: 'Total',
      dataIndex: 'Total',
      key: 'total',
      width: '10%',
      render: text => text || '-',
      align: 'center'
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
          onChange={value => handleLevelChange(record, value)}
          style={{ width: '100%', minWidth: 80 }}
          placeholder="Select level"
        />
      ),
      align: 'center'
    }
  ]

  const fetchData = async (params = {}) => {
    try {
      setLoading(true)
      const response = await getSessionParticipants(sessionId, {
        page: params.current,
        limit: params.pageSize,
        search: searchText
      })

      const responseData = response.data || []
      setOriginalData(responseData)
      setData(responseData)
      setPagination({
        current: params.current || 1,
        pageSize: params.pageSize || 10,
        total: responseData.length
      })

      const allHaveLevel = responseData.every(item => item.Level)
      setReadyToPublish(allHaveLevel)
    } catch (error) {
      message.error(error.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (sessionId) {
      fetchData(pagination)
    }
  }, [sessionId])

  useEffect(() => {
    if (originalData.length > 0) {
      if (!searchText.trim()) {
        setData(originalData)
        setPagination(prev => ({
          ...prev,
          total: originalData.length
        }))
      } else {
        const filtered = originalData.filter(item => {
          const fullName = item.User?.fullName?.toLowerCase() || ''
          return fullName.includes(searchText.toLowerCase())
        })
        setData(filtered)
        setPagination(prev => ({
          ...prev,
          total: filtered.length
        }))
      }
    }
  }, [searchText, originalData])

  const handleTableChange = newPagination => {
    fetchData({
      ...newPagination,
      pageSize: 10
    })
  }

  const handleSearch = value => {
    setSearchText(value)
  }

  const handleStudentApproved = () => {
    fetchData(pagination)
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
        <div className="participant-list px-2 sm:px-0">
          <div className="mb-4 mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
            <div className="relative w-full sm:w-auto">
              <Input
                key="search-input"
                placeholder="Search by student name"
                prefix={<SearchOutlined key="search-icon" className="text-text-secondary" />}
                value={searchText}
                onChange={e => handleSearch(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
            <div className="flex justify-end sm:justify-start">
              <PublishPopup
                sessionId={sessionId}
                disabled={readyToPublish}
                onPublishSuccess={() => setReadyToPublish(false)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
              key="participants-table"
              columns={columns}
              dataSource={data}
              pagination={pagination}
              onChange={handleTableChange}
              loading={loading}
              scroll={{ x: 120 }}
              rowKey="ID"
            />
          </div>
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
      children: (
        <div key="pending-content">
          <PendingList sessionId={sessionId} onStudentApproved={handleStudentApproved} />
        </div>
      )
    }
  ]

  return (
    <div key="session-participant-list" className="rounded-lg bg-white">
      <Tabs
        key="session-tabs"
        defaultActiveKey="1"
        items={items}
        className="px-4 pt-4 sm:px-6"
        tabBarStyle={{
          margin: 0,
          borderBottom: 'none'
        }}
      />
    </div>
  )
}

export default SessionParticipantList
