import SessionDetail from '@/features/session/ui/session-detail'
import SessionParticipantList from '@features/student/ui/student-list'

const SessionDetailPage = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="rounded-lg bg-white">
        <SessionDetail />
      </div>
      <div className="rounded-lg bg-white">
        <SessionParticipantList />
      </div>
    </div>
  )
}

export default SessionDetailPage
