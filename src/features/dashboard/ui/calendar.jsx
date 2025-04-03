import { Calendar, Card } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'

const CalendarCard = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs())

  const handleDateSelect = date => {
    setSelectedDate(date)
    console.log('Selected Date:', date.format('YYYY-MM-DD'))
  }

  return (
    <Card title="Calendar" className="mx-auto w-full max-w-3xl rounded-lg shadow-lg">
      <Calendar fullscreen={false} value={selectedDate} onSelect={handleDateSelect} />
      <p className="mt-4 text-center">
        Selected Date: <strong>{selectedDate.format('YYYY-MM-DD')}</strong>
      </p>
    </Card>
  )
}

export default CalendarCard
