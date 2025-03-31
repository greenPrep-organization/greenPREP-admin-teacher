import { Warning } from '@assets/images/index'
import { Button, message, Modal, Table, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'

const { Text } = Typography

const DeleteModal = ({ isOpen, onClose, onConfirm, loading }) => {
  return (
    <>
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

          {/* Confirmation text */}
          <p className="mb-6 text-center text-lg">Are you sure you want to delete session?</p>

          {/* Action buttons */}
          <div className="flex gap-4">
            <Button onClick={onClose} className="h-10 w-24 rounded border border-gray-300 hover:bg-gray-100">
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              loading={loading}
              className="h-10 w-24 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

const SessionPopUp = ({ sessions, onDelete, isAuthorized }) => {
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
      message.success('Session deleted successfully.')
    } catch {
      message.error('Failed to delete session. Please try again later.')
    } finally {
      setLoading(false)
      setIsDeleteModalOpen(false)
    }
  }

  if (!isAuthorized) return <Text type="danger">Unauthorized</Text>

  const columns = [
    {
      title: 'Session Name',
      dataIndex: 'name',
      key: 'name',
      width: 150
    },
    {
      title: 'Session Key',
      dataIndex: 'key',
      key: 'key',
      width: 120
    },
    {
      title: 'Start Date',
      key: 'startDate',
      width: 180,
      render: (_, record) => dayjs(record.startDate).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'End Date',
      key: 'endDate',
      width: 180,
      render: (_, record) => dayjs(record.endDate).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Participants',
      dataIndex: 'participantCount',
      key: 'participantCount',
      width: 120
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: status => {
        const color = status === 'Completed' ? 'green' : 'blue'
        return <Tag color={color}>{status}</Tag>
      }
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

export default SessionPopUp
