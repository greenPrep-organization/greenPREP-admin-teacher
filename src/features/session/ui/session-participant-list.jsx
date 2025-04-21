// @ts-nocheck
import { SearchOutlined } from '@ant-design/icons'
import { getSessionParticipants, updateParticipantLevelById } from '@features/session/api'
import { loadFromIndexedDB, saveToIndexedDB } from '@features/session/api/indexdb'
import { Input, Select, Table, Tabs, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePendingSessionRequests } from '../../student/hooks/index'
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
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('1')
  const [seenPendingCount, setSeenPendingCount] = useState(null)

  const { data: pendingDataRaw = [] } = usePendingSessionRequests(sessionId)
  const [pendingCount, setPendingCount] = useState(0)
  async function loadSeen() {
    const seen = await loadFromIndexedDB(sessionId)
    if (seen !== null) {
      setSeenPendingCount(seen)
    }
  }

  useEffect(() => {
    setPendingCount(pendingDataRaw.length)
    loadSeen()
  }, [pendingDataRaw])

  const unseenCount = seenPendingCount === null ? pendingCount : Math.max(0, pendingCount - seenPendingCount)
  const showBadge = unseenCount > 0

  const handleTabChange = key => {
    setActiveTab(key)
    if (key === '2') {
      setSeenPendingCount(pendingCount)
      saveToIndexedDB(sessionId, pendingDataRaw.length)
    }
  }

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

  const renderScore = (score, level) => {
    const color = score <= 8 && level === 'X' ? '#ff4d4f' : score >= 8 ? '#000' : ''
    const displayScore = score !== null && score !== undefined ? score : '-'
    return (
      <div style={{ fontWeight: 500 }}>
        <span style={{ color }}>{displayScore ?? '-'}</span>
        {level && (
          <>
            <span style={{ margin: '0 6px', color: '#000' }}>|</span>
            <span style={{ color, textTransform: 'uppercase' }}>{level}</span>
          </>
        )}
      </div>
    )
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
      render: (score, record) => renderScore(score, record.GrammarVocabLevel),
      align: 'center'
    },
    {
      title: 'Listening',
      dataIndex: 'Listening',
      key: 'listening',
      width: '12%',
      responsive: ['md'],
      render: (score, record) => renderScore(score, record.ListeningLevel),
      align: 'center'
    },
    {
      title: 'Reading',
      dataIndex: 'Reading',
      key: 'reading',
      width: '12%',
      responsive: ['md'],
      render: (score, record) => renderScore(score, record.ReadingLevel),
      align: 'center'
    },
    {
      title: 'Speaking',
      dataIndex: 'Speaking',
      key: 'speaking',
      width: '12%',
      responsive: ['md'],
      render: (score, record) => {
        const level = record.SpeakingLevel
        return (
          <span
            className="cursor-pointer text-blue-600 hover:underline"
            onClick={() => {
              navigate(`/grading/${sessionId}/${record.ID}?section=speaking`)
            }}
          >
            {score === null || score === undefined ? 'Ungraded' : renderScore(score, level)}
          </span>
        )
      },
      align: 'center'
    },
    {
      title: 'Writing',
      dataIndex: 'Writing',
      key: 'writing',
      width: '12%',
      responsive: ['md'],
      render: (score, record) => {
        const level = record.WritingLevel
        return (
          <span
            className="cursor-pointer text-blue-600 hover:underline"
            onClick={() => {
              navigate(`/grading/${sessionId}/${record.ID}?section=writing`)
            }}
          >
            {score === null || score === undefined ? 'Ungraded' : renderScore(score, level)}
          </span>
        )
      },
      align: 'center'
    },
    {
      title: 'Total',
      dataIndex: 'Total',
      key: 'total',
      width: '10%',
      render: score => {
        return <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>{score ?? '-'}</span>
      },
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
        search: ''
      })

      const responseData = response.data || []
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
    if (!searchText.trim()) {
      fetchData(pagination)
    } else {
      const filtered = data.filter(item => {
        const fullName = item.User?.fullName?.toLowerCase() || ''
        return fullName.includes(searchText.toLowerCase())
      })
      setData(filtered)
      setPagination(prev => ({
        ...prev,
        total: filtered.length
      }))
    }
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
                disabled={!readyToPublish}
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
        <div className="relative px-4 py-1 font-medium">
          Pending Request
          {showBadge && (
            <div className="absolute -right-3 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unseenCount}
            </div>
          )}
        </div>
      ),
      children: (
        <PendingList
          sessionId={sessionId}
          onStudentApproved={handleStudentApproved}
          setSeenPendingCount={setSeenPendingCount}
        />
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
        destroyInactiveTabPane
        activeKey={activeTab}
        onChange={handleTabChange}
      />
    </div>
  )
}

export default SessionParticipantList
