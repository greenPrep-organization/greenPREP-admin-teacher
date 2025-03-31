import { Warning } from '@assets/Images/index'
import { formatDate } from '@shared/lib/utils/index'
import { Button, Modal, Table, Tag } from 'antd'
import { useState } from 'react'

export const DeleteModal = ({ isOpen, onClose, onConfirm, loading }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      closable={false}
      centered
      width={400}
      bodyStyle={{ padding: '24px' }}
      okButtonProps={{ danger: true, disabled: loading }}
    >
      <div className="flex flex-col items-center">
        <img src={Warning} alt="" className="mb-4 h-12 w-12 text-yellow-500" />
        <p className="mb-6 text-center text-lg">Are you sure you want to delete this session?</p>
        <div className="flex gap-4">
          <Button onClick={onClose} className="h-10 w-24 border border-gray-300 hover:bg-gray-100">
            Cancel
          </Button>
          <Button onClick={onConfirm} loading={loading} className="h-10 w-24 bg-red-500 text-white hover:bg-red-600">
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  )
}

const SessionTable = ({ sessions, onDelete, isAuthorized }) => {
  const [selectedSession, setSelectedSession] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDeleteClick = session => {
    setSelectedSession(session)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedSession) return

    setLoading(true)
    try {
      await onDelete(selectedSession.id)
    } finally {
      setLoading(false)
      setIsDeleteModalOpen(false)
    }
  }

  if (!isAuthorized) return <p className="text-red-500">Unauthorized</p>

  const columns = [
    { title: 'Session Name', dataIndex: 'name', key: 'name', width: 150 },
    { title: 'Session Key', dataIndex: 'key', key: 'key', width: 120 },
    { title: 'Start Date', key: 'startDate', width: 180, render: (_, record) => formatDate(record.startDate) },
    { title: 'End Date', key: 'endDate', width: 180, render: (_, record) => formatDate(record.endDate) },
    { title: 'Participants', dataIndex: 'participantCount', key: 'participantCount', width: 120 },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: status => <Tag color={status === 'Completed' ? 'green' : 'blue'}>{status}</Tag>
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button type="primary" danger onClick={() => handleDeleteClick(record)} size="small">
          Delete
        </Button>
      )
    }
  ]

  return (
    <div>
      <Table dataSource={sessions} columns={columns} rowKey="id" scroll={{ x: true }} bordered />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        loading={loading}
      />
    </div>
  )
}

export default SessionTable
