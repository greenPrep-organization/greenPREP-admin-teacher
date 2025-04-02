import { Button, message } from 'antd'

const WRITING_STORAGE_KEY = 'writing_grading_draft'
const SPEAKING_STORAGE_KEY = 'speaking_grading_draft'
const FEEDBACK_STORAGE_KEY = 'grading_feedbacks'

// Import the shared scores and feedbacks
import { sharedScores, sharedFeedbacks } from '@features/grading/constants/shared-state'

function SaveAsDraftButton() {
  const handleSaveDraft = () => {
    try {
      // Save writing draft using sharedScores
      const writingScores = sharedScores.writing || {}
      const writingDraftData = []

      // Group writing scores by part
      const writingPartScores = {}
      Object.keys(writingScores).forEach(key => {
        const match = key.match(/^(part\d+)_question_(\d+)$/)
        if (match) {
          const [, part, questionIndex] = match
          if (!writingPartScores[part]) {
            writingPartScores[part] = []
          }
          writingPartScores[part][parseInt(questionIndex)] = writingScores[key]
        }
      })

      // Convert writing scores to the expected format
      Object.keys(writingPartScores).forEach(part => {
        const scoresArray = []
        // Create an array of the right size
        for (let i = 0; i < writingPartScores[part].length; i++) {
          scoresArray.push({
            questionIndex: i,
            score: writingPartScores[part][i] === undefined ? null : writingPartScores[part][i]
          })
        }

        writingDraftData.push({
          part,
          timestamp: new Date().toISOString(),
          isDraft: true,
          scores: scoresArray
        })
      })

      localStorage.setItem(WRITING_STORAGE_KEY, JSON.stringify(writingDraftData))

      // Save speaking draft using sharedScores
      const speakingScores = sharedScores.speaking || {}
      const speakingDraftData = []

      // Group speaking scores by part
      const speakingPartScores = {}
      Object.keys(speakingScores).forEach(key => {
        const match = key.match(/^(PART \d+)-(.+)$/)
        if (match) {
          const [, part, questionId] = match
          if (!speakingPartScores[part]) {
            speakingPartScores[part] = []
          }
          // Store the score with the question ID
          speakingPartScores[part].push({
            questionId,
            score: speakingScores[key]
          })
        }
      })

      // Convert speaking scores to the expected format
      Object.keys(speakingPartScores).forEach(part => {
        const scoresArray = speakingPartScores[part].map((item, index) => ({
          questionIndex: index,
          score: item.score
        }))

        speakingDraftData.push({
          part: part.toLowerCase().replace(' ', ''),
          timestamp: new Date().toISOString(),
          isDraft: true,
          scores: scoresArray
        })
      })

      localStorage.setItem(SPEAKING_STORAGE_KEY, JSON.stringify(speakingDraftData))

      // Save both drafts to a combined storage key for easy retrieval
      const combinedDrafts = {
        writing: writingDraftData,
        speaking: speakingDraftData,
        timestamp: new Date().toISOString()
      }

      localStorage.setItem('combined_grading_drafts', JSON.stringify(combinedDrafts))

      // Save feedbacks to local storage
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(sharedFeedbacks))

      message.success('Draft saved successfully')
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

export default SaveAsDraftButton
