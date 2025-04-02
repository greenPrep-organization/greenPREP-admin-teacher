import { Button, message } from 'antd'

const STORAGE_KEY = 'writing_grading_draft'

function SaveAsDraftButton({ form, studentData }) {
  const handleSaveDraft = () => {
    try {
      const values = form.getFieldsValue(true)
      const draftData = []

      Object.keys(studentData).forEach(part => {
        const questions = studentData[part].questions
        const scores = questions.map((_, index) => {
          const fieldName = `${part}_question_${index}`
          const score = values[fieldName]
          return {
            questionIndex: index,
            score: score === undefined ? null : score
          }
        })

        draftData.push({
          part,
          timestamp: new Date().toISOString(),
          isDraft: true,
          scores
        })
      })

      localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData))
      message.success('Draft saved successfully')
    } catch (error) {
      message.error('Failed to save draft')
      console.error('Error saving draft:', error)
    }
  }

  return (
    <Button onClick={handleSaveDraft} className="w-full shadow-md transition-shadow hover:shadow-lg">
      Save As Draft
    </Button>
  )
}

export default SaveAsDraftButton
