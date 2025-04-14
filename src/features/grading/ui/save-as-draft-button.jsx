import { Button, message } from 'antd'
import { sharedState } from '@features/grading/constants/shared-state'
import PropTypes from 'prop-types'

function SaveAsDraftButton({ sessionParticipantId, onDraftSaved }) {
  const handleSaveDraft = () => {
    try {
      if (!sessionParticipantId) {
        message.error('No student selected')
        return
      }

      const success = sharedState.persistDraft(sessionParticipantId)

      if (success) {
        message.success('Draft saved successfully')
        if (onDraftSaved) {
          onDraftSaved()
        }
      } else {
        message.error('Failed to save draft')
      }
    } catch (error) {
      message.error('Failed to save draft')
      console.error('Error saving draft:', error)
    }
  }

  return (
    <Button
      type="default"
      onClick={handleSaveDraft}
      className="h-10 w-full rounded-lg border border-[#003087] bg-white text-[#003087] hover:bg-[#f0f2ff]"
    >
      Save As Draft
    </Button>
  )
}

SaveAsDraftButton.propTypes = {
  sessionParticipantId: PropTypes.string.isRequired,
  onDraftSaved: PropTypes.func
}

export default SaveAsDraftButton
