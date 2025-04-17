import { Card } from 'antd'
import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './calender.css'

const CalendarCard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleDateSelect = date => {
    setSelectedDate(date)
    console.log('Selected Date:', date.toISOString().split('T')[0])
  }

  return (
    <Card className="mx-auto w-full max-w-2xl rounded-md border-2 bg-white shadow-md">
      <div className="p-0 sm:p-4">
        <div className="w-full max-w-full">
          <Calendar
            locale="en-US"
            onChange={handleDateSelect}
            value={selectedDate}
            formatShortWeekday={(locale, date) => date.toLocaleDateString('en-US', { weekday: 'short' })}
            tileClassName={({ date, view }) => {
              if (view === 'month' && date.toDateString() === selectedDate.toDateString()) {
                return '!bg-red-500 text-white rounded-lg'
              }
              return 'hover:!bg-blue-100 rounded-lg transition'
            }}
            navigationLabel={({ date }) =>
              date.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })
            }
            nextLabel=">"
            prevLabel="<"
            className="w-full scale-[1.2] text-lg sm:text-lg md:text-base [&_.react-calendar__month-view__weekdays__weekday]:text-center [&_.react-calendar__month-view__weekdays__weekday]:font-medium [&_.react-calendar__navigation]:mb-0 [&_.react-calendar__navigation__label]:text-base [&_.react-calendar__tile]:border-0 [&_.react-calendar__tile]:p-0 [&_.react-calendar__tile]:text-xs [&_.react-calendar__tile]:outline-none [&_.react-calendar__tile]:focus:!bg-blue-200"
          />
        </div>
      </div>
    </Card>
  )
}

export default CalendarCard
