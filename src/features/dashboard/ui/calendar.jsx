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
    <Card
      title="Calendar"
      className="mx-auto w-full max-w-2xl rounded-lg border border-red-500 bg-red-100 shadow-lg"
      headStyle={{ backgroundColor: '#ef4444', color: 'white' }}
    >
      <Calendar
        fullscreen={false}
        mode="month"
        value={selectedDate}
        onSelect={handleDateSelect}
        className="rounded-md bg-white"
      />
    </Card>
  )
}

export default CalendarCard
