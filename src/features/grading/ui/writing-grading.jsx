import { useState, useEffect } from 'react'
import { Button } from 'antd'
import { useQuery } from '@tanstack/react-query'
import mockData from '@features/grading/constants/writingmockdata'
import GradingScoringPanel from './grading-scoring-panel'
import Feedback from '@features/grading/ui/feedback-grading'

const STORAGE_KEY = 'writing_grading_draft'

// Flag to track if we've already loaded the draft
let hasLoadedWritingDraft = false

function WritingGrade() {
  const [activePart, setActivePart] = useState('part1')
  const [scores, setScores] = useState({})

  const { data: studentData } = useQuery({
    queryKey: ['studentData'],
    queryFn: () => Promise.resolve(mockData),
    initialData: mockData
  })

  // Load draft data from localStorage only once when the website loads
  useEffect(() => {
    if (!hasLoadedWritingDraft && studentData) {
      try {
        const draftData = JSON.parse(localStorage.getItem(STORAGE_KEY))
        if (draftData) {
          const loadedScores = {}
          draftData.forEach(({ part, scores: partScores }) => {
            partScores.forEach(({ questionIndex, score }) => {
              if (score !== null) {
                loadedScores[`${part}_question_${questionIndex}`] = score
              }
            })
          })
          setScores(loadedScores)
          hasLoadedWritingDraft = true
        }
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }
  }, [studentData])

  const handlePartChange = key => {
    setActivePart(key)
  }

  const handleSubmit = () => {
    // Handle submission logic here
  }

  const currentPart = studentData[activePart]
  const questions = currentPart.questions
  const answers = currentPart.answers
  const instructions = currentPart.instructions

  const renderAnswer = answer => {
    if (!answer || answer.trim() === '') {
      return <p className="italic text-gray-500">No answer submitted</p>
    }
    return <p className="whitespace-pre-wrap">{answer}</p>
  }

  return (
    <div>
      <div className="mb-6 flex w-fit gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
        {['part1', 'part2', 'part3', 'part4'].map(part => (
          <Button
            key={part}
            type={activePart === part ? 'primary' : 'default'}
            onClick={() => handlePartChange(part)}
            className={`min-w-[80px] rounded-xl border-none ${
              activePart === part ? 'bg-[#003087] text-white' : 'bg-white text-black'
            }`}
          >
            {`Part ${part.slice(-1)}`}
          </Button>
        ))}
      </div>

      <div className="flex gap-8">
        <div className="flex-1 space-y-5">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-[#003087]">{`Part ${activePart.slice(-1)}:`}</h3>
            <div className="mt-1 text-base">{instructions}</div>
            <ol className="list-decimal space-y-1 pl-6">
              {questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ol>
          </div>

          <div className="rounded-lg bg-white">
            <div className="mb-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="font-medium text-[#003087]">Student Answers:</p>
              {answers.length === 0 ? (
                <p className="italic text-gray-500">No answer submitted</p>
              ) : (
                <ol className="list-decimal space-y-4 pl-6">
                  {answers.map((answer, index) => (
                    <li key={index}>{renderAnswer(answer)}</li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>

        <GradingScoringPanel
          activePart={activePart}
          questions={questions}
          scores={scores}
          setScores={setScores}
          type="writing"
          onSubmit={handleSubmit}
        />
      </div>

      <div className="mt-6">
        <Feedback activePart={activePart} type="writing" />
      </div>
    </div>
  )
}

export default WritingGrade
