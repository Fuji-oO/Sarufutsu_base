'use client'

import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

interface Reservation {
  id: string
  checkin_date: string
  checkout_date: string
  room_type: string
  status: string
}

interface ReservationCalendarProps {
  initialReservations?: Reservation[]
}

type AvailabilityStatus = 'available' | 'limited' | 'full'

export default function ReservationCalendar({ initialReservations = [] }: ReservationCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [availability, setAvailability] = useState<Record<string, AvailabilityStatus>>({})
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations)
  const [loading, setLoading] = useState(false)

  // 月切り替え時に予約データを取得
  const fetchReservationsForMonth = async (date: Date) => {
    setLoading(true)
    try {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const monthParam = `${year}-${month}`
      
      const response = await fetch(`/api/reservation?month=${monthParam}`)
      if (response.ok) {
        const data = await response.json()
        setReservations(data)
        console.log(`Fetched reservations for ${monthParam}:`, data)
      } else {
        console.error('Failed to fetch reservations')
      }
    } catch (error) {
      console.error('Error fetching reservations:', error)
    } finally {
      setLoading(false)
    }
  }

  // 初期表示時と月切り替え時にデータを取得
  useEffect(() => {
    fetchReservationsForMonth(currentDate)
  }, [currentDate])

  useEffect(() => {
    calculateAvailability()
  }, [reservations, currentDate])

  const calculateAvailability = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    const newAvailability: Record<string, AvailabilityStatus> = {}

    // 表示中の月の各日について予約状況を計算
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const date = new Date(dateStr)
      
      // その日の予約を取得
      const dayReservations = reservations.filter(reservation => {
        const checkin = new Date(reservation.checkin_date)
        const checkout = new Date(reservation.checkout_date)
        return date >= checkin && date < checkout && reservation.status === 'confirmed'
      })

      // 部屋タイプ別の予約数をカウント
      const room1Reservations = dayReservations.filter(r => r.room_type === 'Room1' || r.room_type === '貸切')
      const room2Reservations = dayReservations.filter(r => r.room_type === 'Room2' || r.room_type === '貸切')
      const kashikiriReservations = dayReservations.filter(r => r.room_type === '貸切')
      const kyuugyouReservations = dayReservations.filter(r => r.room_type === '休業日')

      // 予約状況の判定
      if (kashikiriReservations.length > 0 || kyuugyouReservations.length > 0) {
        // 貸切予約または休業日がある場合は満室
        newAvailability[dateStr] = 'full'
      } else if (room1Reservations.length > 0 && room2Reservations.length > 0) {
        // 両方の部屋に予約がある場合は満室
        newAvailability[dateStr] = 'full'
      } else if (room1Reservations.length > 0 || room2Reservations.length > 0) {
        // 片方の部屋に予約がある場合は一部空き
        newAvailability[dateStr] = 'limited'
      } else {
        // 予約がない場合は全室空き
        newAvailability[dateStr] = 'available'
      }
    }

    setAvailability(newAvailability)
  }

  const tileContent = ({ date }: { date: Date }) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const status = availability[dateStr]

    if (!status) return null

    const getStatusSymbol = (status: AvailabilityStatus) => {
      switch (status) {
        case 'available':
          return <span className="text-green-600 font-bold text-lg">〇</span>
        case 'limited':
          return <span className="text-yellow-600 font-bold text-lg">△</span>
        case 'full':
          return <span className="text-red-600 font-bold text-lg">×</span>
        default:
          return null
      }
    }

    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {getStatusSymbol(status)}
      </div>
    )
  }

  const tileClassName = ({ date }: { date: Date }) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const status = availability[dateStr]

    if (!status) return ''

    switch (status) {
      case 'available':
        return 'bg-green-50'
      case 'limited':
        return 'bg-yellow-50'
      case 'full':
        return 'bg-red-50'
      default:
        return ''
    }
  }

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
    // 新しい月のデータを取得
    fetchReservationsForMonth(newDate)
  }

  const formatMonth = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">予約状況カレンダー</h3>
      </div>

      {/* 凡例 */}
      <div className="flex items-center justify-center space-x-6 mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-green-600 font-bold text-lg">〇</span>
          <span className="text-gray-600">全室空室</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-yellow-600 font-bold text-lg">△</span>
          <span className="text-gray-600">1部屋空きあり</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-red-600 font-bold text-lg">×</span>
          <span className="text-gray-600">満室</span>
        </div>
      </div>
      <div className="text-center text-sm text-red-600 mb-4">※月変更後は、いずれかの日にちを選択することで予約状況が表示されます。</div>

      {/* カレンダー */}
      <div className="flex justify-center">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-gray-600">読み込み中...</div>
          </div>
        )}
        <Calendar
          value={currentDate}
          onChange={(value) => {
            if (value instanceof Date) {
              setCurrentDate(value)
            }
          }}
          tileContent={tileContent}
          tileClassName={tileClassName}
          className="border-0 shadow-none"
          formatDay={(locale, date) => date.getDate().toString()}
          showNeighboringMonth={false}
        />
      </div>

      <style jsx global>{`
        .react-calendar {
          width: 100%;
          max-width: 600px;
          background: white;
          border: none;
          font-family: Arial, Helvetica, sans-serif;
          line-height: 1.125em;
        }
        .react-calendar--doubleView {
          width: 700px;
        }
        .react-calendar--doubleView .react-calendar__viewContainer {
          display: flex;
          margin: -0.5em;
        }
        .react-calendar--doubleView .react-calendar__viewContainer > * {
          width: 50%;
          margin: 0.5em;
        }
        .react-calendar,
        .react-calendar *,
        .react-calendar *:before,
        .react-calendar *:after {
          -moz-box-sizing: border-box;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
        }
        .react-calendar button {
          margin: 0;
          border: 0;
          outline: none;
        }
        .react-calendar button:enabled:hover {
          background-color: #e6e6e6;
        }
        .react-calendar__navigation {
          display: flex;
          height: 44px;
          margin-bottom: 1em;
        }
        .react-calendar__navigation button {
          min-width: 44px;
          background: none;
        }
        .react-calendar__navigation button:disabled {
          background-color: #f0f0f0;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #e6e6e6;
        }
        .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.75em;
        }
        .react-calendar__month-view__weekdays__weekday {
          padding: 0.5em;
        }
        .react-calendar__month-view__weekNumbers .react-calendar__tile {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75em;
          font-weight: bold;
        }
        .react-calendar__month-view__days__day--weekend {
          color: #d10000;
        }
        .react-calendar__month-view__days__day--neighboringMonth {
          color: #757575;
        }
        .react-calendar__year-view .react-calendar__tile,
        .react-calendar__decade-view .react-calendar__tile,
        .react-calendar__century-view .react-calendar__tile {
          padding: 2em 0.5em;
        }
        .react-calendar__tile {
          max-width: 100%;
          padding: 10px 6.6667px;
          background: none;
          text-align: center;
          line-height: 16px;
          position: relative;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #e6e6e6;
        }
        .react-calendar__tile--now {
          background: #ffff76;
        }
        .react-calendar__tile--now:enabled:hover,
        .react-calendar__tile--now:enabled:focus {
          background: #ffffa9;
        }
        .react-calendar__tile--hasActive {
          background: #76baff;
        }
        .react-calendar__tile--hasActive:enabled:hover,
        .react-calendar__tile--hasActive:enabled:focus {
          background: #a9d4ff;
        }
        .react-calendar__tile--active {
          background: #006edc;
          color: white;
        }
        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: #1087ff;
        }
        .react-calendar--selectRange .react-calendar__tile--hover {
          background-color: #e6e6e6;
        }
      `}</style>
    </div>
  )
} 