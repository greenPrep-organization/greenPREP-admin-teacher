'use client'

// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { Button, InputNumber, Form, Tabs, Card, Input, message } from 'antd'
import { useQuery } from '@tanstack/react-query'
import * as Yup from 'yup'

const mockData = {
  part1: {
    instructions:
      "Part 1. You want to join the Museum club. You have 5 messages from a member of the club. Write short answers (1-5 words) to each message. Recommended time: 3 minutes. (1 point)\n* (You're allowed to write up to 10 words without affecting your grade).",
    questions: [
      'Are you interested in art?',
      'Where did you go last night?',
      'What are you wearing today?',
      'Which sport is the most popular in your country?',
      'What do you like doing with your friend?'
    ],
    answers: [
      'Yes, I love paintings. They are beautiful and inspiring. I often visit art galleries. It makes me feel creative.',
      'I went to a café. I wanted to relax. I enjoyed a cup of coffee. It was a peaceful night.',
      "A white shirt and jeans. It's comfortable and stylish. I feel confident wearing it. I like simple outfits.",
      'Football is the most popular. Many people watch and play it. We have big football tournaments. It brings people together.',
      "Watching movies together. We love exciting stories. We discuss the movies after watching. It's a fun way to bond."
    ]
  },
  part2: {
    instructions: 'Part 2. Write a short essay about your favorite museum. (5 points)',
    questions: ['Describe your favorite museum and why you like it.'],
    answers: [
      'The National Art Museum is my favorite. It has an impressive collection of modern and classical art. The architecture of the building itself is a masterpiece with its grand columns and spacious galleries. I particularly enjoy the interactive exhibits that allow visitors to engage with the art in unique ways. Every time I visit, I discover something new and fascinating.'
    ]
  },
  part3: {
    instructions: 'Part 3. Compare and contrast two different types of museums. (10 points)',
    questions: ['Compare art museums and science museums.', 'Discuss the educational value of each type.'],
    answers: [
      'Art museums showcase human creativity through paintings, sculptures, and other visual media, while science museums focus on natural phenomena and technological innovations through interactive exhibits. Art museums often have a contemplative atmosphere, whereas science museums encourage hands-on exploration.',
      'Both types offer significant educational value. Art museums cultivate aesthetic appreciation and cultural understanding, helping visitors develop critical thinking about visual communication. Science museums, on the other hand, promote scientific literacy and curiosity about how the world works through experimentation and demonstration.'
    ]
  },
  part4: {
    instructions: 'Part 4. Analyze the role of museums in modern society. (15 points)',
    questions: [
      'How have museums evolved in the digital age?',
      'What is the social impact of museums in communities?',
      'How might museums change in the future?'
    ],
    answers: [
      'Museums have embraced digital technology by creating virtual tours, interactive displays, and online collections. Many now offer mobile apps that enhance the visitor experience with additional information and augmented reality features. Social media has also become a vital tool for museums to engage with audiences beyond their physical locations.',
      'Museums serve as cultural anchors in communities, providing educational opportunities and preserving local heritage. They often function as community gathering spaces for events and discussions. Studies show that museums contribute to social cohesion, improved educational outcomes, and economic development through tourism.',
      'Future museums will likely become more interactive and personalized, using AI to tailor experiences to individual interests. We may see more community-curated exhibits and collaborative spaces that blur the line between creator and visitor. Sustainability will become central to museum operations, with eco-friendly practices integrated into both building design and exhibition planning.'
    ]
  }
}

// eslint-disable-next-line no-unused-vars
const createValidationSchema = (part, questions) => {
  const schema = {}
  questions.forEach((question, index) => {
    schema[`question_${index}`] = Yup.number()
      .typeError('Must be a number')
      .min(0, 'Minimum score is 0')
      .max(100, 'Maximum score is 100')
      .required('Score is required')
  })
  return Yup.object().shape(schema)
}

function WritingGrade() {
  const [activeTab, setActiveTab] = useState('writing')
  const [activePart, setActivePart] = useState('part1')
  const [form] = Form.useForm()
  const [totalScore, setTotalScore] = useState(0)
  const [feedback, setFeedback] = useState('Easy grammar, using more complex sentences and vocab to upgrade band level')

  // Simulate fetching data with React Query
  const { data: studentData } = useQuery({
    queryKey: ['studentData'],
    queryFn: () => Promise.resolve(mockData),
    initialData: mockData
  })

  const handleTabChange = key => {
    setActiveTab(key)
  }

  const handlePartChange = key => {
    setActivePart(key)
    form.resetFields()
    setTotalScore(0)
  }

  const handleScoreChange = (value, field) => {
    const values = form.getFieldsValue()
    const currentPart = studentData[activePart]
    const questions = currentPart.questions

    // Calculate total from all fields
    let total = 0
    questions.forEach((_, index) => {
      const fieldValue = values[`question_${index}`] || 0
      total += fieldValue
    })

    setTotalScore(total)

    // Check if total exceeds 100
    if (total > 100) {
      message.error('Total score cannot exceed 100')

      // Reset the field that caused the overflow
      const previousValue = form.getFieldValue(field) || 0
      const newValue = previousValue - (total - 100)
      form.setFieldsValue({ [field]: newValue >= 0 ? newValue : 0 })

      // Recalculate total
      setTimeout(() => {
        const updatedValues = form.getFieldsValue()
        let updatedTotal = 0
        questions.forEach((_, index) => {
          updatedTotal += updatedValues[`question_${index}`] || 0
        })
        setTotalScore(updatedTotal)
      }, 0)
    }
  }

  const handleSubmit = values => {
    console.log('Submitted values:', values)
    console.log('Total score:', totalScore)
    console.log('Feedback:', feedback)
    message.success('Grading submitted successfully')
  }

  const handleSaveAsDraft = () => {
    const values = form.getFieldsValue()
    console.log('Saved as draft:', values)
    console.log('Total score:', totalScore)
    console.log('Feedback:', feedback)
    message.info('Grading saved as draft')
  }

  const currentPart = studentData[activePart]
  const questions = currentPart.questions
  const answers = currentPart.answers
  const instructions = currentPart.instructions

  return (
    <div className="mx-auto max-w-[1200px] p-4">
      <h1 className="mb-4 text-2xl font-bold">Grading</h1>

      <div className="mb-4 flex justify-between">
        <div className="flex gap-2">
          <Button icon={<span>←</span>} className="flex items-center">
            Previous Student
          </Button>

          <Button className="flex items-center">Change Student</Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">of 40 students</span>
          <Button type="primary" className="flex items-center bg-[#003366]">
            Next Student
            <span className="ml-1">→</span>
          </Button>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        className="mb-4"
        items={[
          { key: 'speaking', label: 'Speaking' },
          { key: 'writing', label: 'Writing' }
        ]}
      />

      <div className="mb-4">
        <Tabs
          activeKey={activePart}
          onChange={handlePartChange}
          type="card"
          className="part-tabs"
          items={[
            { key: 'part1', label: 'Part 1' },
            { key: 'part2', label: 'Part 2' },
            { key: 'part3', label: 'Part 3' },
            { key: 'part4', label: 'Part 4' }
          ]}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          {/* Instructions and Questions */}
          <Card className="mb-4">
            <div className="text-sm">
              <p className="mb-2">{instructions}</p>
              <ol className="list-decimal space-y-1 pl-6">
                {questions.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ol>
            </div>
          </Card>

          {/* Student Answers */}
          <Card>
            <ol className="list-decimal space-y-3 pl-6">
              {answers.map((answer, index) => (
                <li key={index}>{answer}</li>
              ))}
            </ol>
          </Card>
        </div>

        {/* Scoring Form */}
        <div className="w-[200px]">
          <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{}}>
            {questions.map((_, index) => (
              <Form.Item
                key={index}
                name={`question_${index}`}
                label={`Question ${index + 1}`}
                rules={[
                  { required: true, message: 'Please input a score' },
                  { type: 'number', min: 0, max: 100, message: 'Score must be between 0 and 100' }
                ]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  max={100}
                  onChange={value => handleScoreChange(value, `question_${index}`)}
                />
              </Form.Item>
            ))}

            <Form.Item label={<span className="font-bold">Total</span>}>
              <InputNumber className="w-full !bg-white" value={totalScore} disabled />
            </Form.Item>

            <div className="space-y-2 pt-4">
              <Button type="primary" htmlType="submit" className="w-full bg-[#003366]">
                Submit
              </Button>

              <Button className="w-full" onClick={handleSaveAsDraft}>
                Save As Draft
              </Button>
            </div>
          </Form>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="mt-6">
        <h2 className="mb-2 text-lg font-medium">Feedback</h2>
        <Input.TextArea value={feedback} onChange={e => setFeedback(e.target.value)} rows={4} className="w-full" />
      </div>
    </div>
  )
}

export default WritingGrade
