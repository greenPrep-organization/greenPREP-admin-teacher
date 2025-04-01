// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { Button, InputNumber, Form, Card, message, Divider } from 'antd'
import { useQuery } from '@tanstack/react-query'
import mockData from '../writingmockdata'

function WritingGrade() {
  const [activePart, setActivePart] = useState('part1')
  const [form] = Form.useForm()
  const [totalScore, setTotalScore] = useState(0)

  const { data: studentData } = useQuery({
    queryKey: ['studentData'],
    queryFn: () => Promise.resolve(mockData),
    initialData: mockData
  })

  const handlePartChange = key => {
    setActivePart(key)
    form.resetFields()
    setTotalScore(0)
  }

  const handleScoreChange = (value, field) => {
    let newValue = value
    if (newValue > 100) {
      newValue = 100
      form.setFieldsValue({ [field]: 100 })
    }

    const values = form.getFieldsValue()
    const currentPart = studentData[activePart]
    const questions = currentPart.questions

    let total = 0
    questions.forEach((_, index) => {
      const fieldValue = values[`question_${index}`] || 0
      total += fieldValue
    })
    setTotalScore(total)
  }

  const handleKeyPress = event => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault()
    }
  }

  const handleSubmit = () => {
    message.success('Grading submitted successfully')
  }

  const currentPart = studentData[activePart]
  const questions = currentPart.questions
  const answers = currentPart.answers
  const instructions = currentPart.instructions

  // Render answers with basic formatting support via CSS
  const renderAnswer = answer => {
    if (!answer || answer.trim() === '') {
      return <p className="italic text-gray-500">No answer submitted</p>
    }
    return <p className="whitespace-pre-wrap">{answer}</p>
  }

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="mb-4 max-w-min rounded-xl border border-solid border-[#C0C0C0] px-4 py-2">
        <div className="flex flex-nowrap gap-1">
          {['part1', 'part2', 'part3', 'part4'].map(part => (
            <button
              key={part}
              onClick={() => handlePartChange(part)}
              className={`whitespace-nowrap rounded-md border border-[#C0C0C0] px-2 py-1 transition-colors ${
                activePart === part ? 'bg-[#003366] text-white' : 'bg-white text-black hover:bg-gray-50'
              }`}
            >
              {`Part ${part.slice(-1)}`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1">
          <Card className="mb-4 border-[#C0C0C0]">
            <div className="text-sm">
              <p className="mb-2 whitespace-pre-wrap">{instructions}</p>
              <ol className="list-decimal space-y-1 pl-6">
                {questions.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ol>
            </div>
          </Card>

          <Card className="max-h-[400px] overflow-y-auto border-[#C0C0C0]">
            {answers.length === 0 ? (
              <p className="italic text-gray-500">No answer submitted</p>
            ) : (
              <ol className="list-decimal space-y-4 pl-6">
                {answers.map((answer, index) => (
                  <li key={index}>{renderAnswer(answer)}</li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        <div className="w-full md:w-80">
          <div className="mx-auto rounded-lg bg-white p-6 shadow-md">
            <Form form={form} layout="horizontal" onFinish={handleSubmit} initialValues={{}}>
              {questions.map((_, index) => (
                <div key={index} className="mb-4 flex items-center">
                  <label className="w-28 text-center font-medium text-gray-700">Question {index + 1}</label>
                  <Form.Item
                    name={`question_${index}`}
                    className="mb-0 flex-1"
                    rules={[
                      { required: true, message: 'Please input a score' },
                      { type: 'integer', message: 'Score must be an integer' },
                      { type: 'number', min: 0, max: 100, message: 'Score must be between 0 and 100' }
                    ]}
                  >
                    <InputNumber
                      className="w-[100px] text-right"
                      min={0}
                      max={999}
                      maxLength={3}
                      step={1}
                      precision={0}
                      onChange={value => handleScoreChange(value, `question_${index}`)}
                      onKeyPress={handleKeyPress}
                    />
                  </Form.Item>
                </div>
              ))}

              <Divider className="my-4 border-black" />

              <div className="flex items-center">
                <label className="w-28 text-center font-medium text-gray-700">Total</label>
                <Form.Item className="mb-0 flex-1">
                  <InputNumber className="w-[100px] bg-gray-50 text-right" value={totalScore} disabled />
                </Form.Item>
              </div>

              <div className="space-y-2 pt-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-[#003366] shadow-md transition-shadow hover:shadow-lg"
                >
                  Submit
                </Button>
                <Button className="w-full shadow-md transition-shadow hover:shadow-lg">Save As Draft</Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default WritingGrade
