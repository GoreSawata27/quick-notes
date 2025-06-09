import React, { useState } from 'react'
import { Flex } from '@chakra-ui/react'

type Props = {
  value: Date | null
  onChange: (date: Date) => void
  minDate?: Date
}

const LocalCalendar: React.FC<Props> = ({ value, onChange, minDate }) => {
  const [currentMonth, setCurrentMonth] = useState<number>(value ? value.getMonth() : new Date().getMonth())
  const [currentYear, setCurrentYear] = useState<number>(
    value ? value.getFullYear() : new Date().getFullYear()
  )

  // Generate days in current month
  const getDaysInMonth = (month: number, year: number) => {
    const date = new Date(year, month, 1)
    const days = []
    while (date.getMonth() === month) {
      days.push(new Date(date))
      date.setDate(date.getDate() + 1)
    }
    return days
  }

  const days = getDaysInMonth(currentMonth, currentYear)

  // Change month handlers
  const handlePrev = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1))
    if (currentMonth === 0) setCurrentYear((y) => y - 1)
  }

  const handleNext = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1))
    if (currentMonth === 11) setCurrentYear((y) => y + 1)
  }

  // Disable dates before minDate
  const isDateDisabled = (date: Date) => {
    if (!minDate) return false

    // Allow selecting today, disable dates before today
    const startOfToday = new Date(minDate)
    startOfToday.setHours(0, 0, 0, 0)

    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)

    return checkDate < startOfToday
  }

  // Format month name for header
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  return (
    <div className='local-calendar w-[307px] rounded  p-4 font-sans'>
      <div className='mb-4 flex items-center justify-between'>
        <button onClick={handlePrev} aria-label='Previous Month'>
          <Flex className='items-center justify-center'>
            <svg xmlns='http://www.w3.org/2000/svg' width='29' height='28' viewBox='0 0 29 28' fill='none'>
              <circle
                cx='14.4839'
                cy='13.773'
                r='13.773'
                transform='rotate(-180 14.4839 13.773)'
                fill='#7A58E7'
                fillOpacity='0.2'
              />
              <path
                d='M15.249 18.364L10.658 13.4197L15.249 8.47537'
                stroke='#7A58E7'
                strokeWidth='1.01453'
                strokeLinecap='round'
              />
            </svg>
          </Flex>
        </button>
        <div className='text-lg font-semibold'>
          {monthNames[currentMonth]} {currentYear}
        </div>
        <button onClick={handleNext} aria-label='Next Month'>
          <Flex className='items-center justify-center'>
            <svg xmlns='http://www.w3.org/2000/svg' width='29' height='28' viewBox='0 0 29 28' fill='none'>
              <circle cx='14.5152' cy='13.773' r='13.773' fill='#E4DEFA' />
              <path
                d='M13.75 9.18201L18.341 14.1263L13.75 19.0706'
                stroke='#7A58E7'
                strokeWidth='1.01453'
                strokeLinecap='round'
              />
            </svg>
          </Flex>
        </button>
      </div>

      <div className='mb-2 grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500'>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className='grid grid-cols-7 gap-1 text-center'>
        {/* Fill blanks for first day offset */}
        {Array(days[0].getDay())
          .fill(null)
          .map((_, i) => (
            <div key={`blank-${i}`} />
          ))}

        {days.map((date) => {
          const disabled = isDateDisabled(date)
          const isSelected = value && date.toDateString() === value.toDateString()

          return (
            <button
              key={date.toISOString()}
              disabled={disabled}
              onClick={() => onChange(date)}
              className={`cursor-pointer rounded py-2 ${
                disabled
                  ? 'cursor-not-allowed text-gray-300'
                  : isSelected
                    ? 'bg-[#7A58E7] text-white'
                    : 'hover:bg-[#7A58E7]/30'
              }`}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default LocalCalendar


// <LocalCalendar
// value={value}
// onChange={(date) => {
//  setValue(date)
// }}
// minDate={new Date()}
// />
