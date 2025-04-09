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
    <Card title="Calendar" className="mx-auto w-full max-w-2xl rounded-lg shadow-sm">
      <Calendar fullscreen={false} value={selectedDate} onSelect={handleDateSelect} />
    </Card>
  )
}

export default CalendarCard
