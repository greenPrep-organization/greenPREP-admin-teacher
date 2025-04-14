import { Card } from 'antd'
import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const CalendarCard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleDateSelect = date => {
    setSelectedDate(date)
    console.log('Selected Date:', date.toISOString().split('T')[0])
  }

  return (
    <Card
      title="Calendar"
      className="mx-auto w-full max-w-5xl rounded-xl bg-white shadow-md"
      headStyle={{ backgroundColor: '#fecaca', color: '#7f1d1d' }}
    >
      <div className="p-4">
        <Calendar
          locale="en-US"
          onChange={handleDateSelect}
          value={selectedDate}
          formatShortWeekday={(locale, date) => date.toLocaleDateString('en-US', { weekday: 'short' })}
          tileClassName={({ date, view }) => {
            if (view === 'month' && date.toDateString() === selectedDate.toDateString()) {
              return '!bg-red-500 text-white rounded-lg'
            }
            return 'hover:bg-blue-100 rounded-lg transition'
          }}
          navigationLabel={({ date }) =>
            date.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            })
          }
          nextLabel=">"
          prevLabel="<"
          className="w-full scale-[1.2] [&_.react-calendar__month-view__weekdays__weekday]:text-center [&_.react-calendar__month-view__weekdays__weekday]:font-medium [&_.react-calendar__navigation]:mb-2 [&_.react-calendar__navigation__label]:text-lg [&_.react-calendar__tile]:border-0 [&_.react-calendar__tile]:p-2 [&_.react-calendar__tile]:text-sm [&_.react-calendar__tile]:outline-none [&_.react-calendar__tile]:focus:!bg-blue-200"
        />
      </div>
    </Card>
  )
}

export default CalendarCard
