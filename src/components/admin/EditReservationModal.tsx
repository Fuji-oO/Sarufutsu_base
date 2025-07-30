'use client'

import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  checkin_date: string
  checkout_date: string
  checkin_time: string
  num_guests: number
  adult_male: number
  adult_female: number
  child: number
  room_type: string
  notes: string
  status: string
  total_price: number
  price_detail: string
  created_at: string
  updated_at: string
}

interface EditReservationModalProps {
  reservation: Reservation | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface ReservationData {
  name: string
  email: string
  phone: string
  checkin_date: string
  checkout_date: string
  checkin_time: string
  num_guests: number
  adult_male: number
  adult_female: number
  child: number
  room_type: string
  notes: string
  status: string
}

export default function EditReservationModal({ reservation, isOpen, onClose, onSuccess }: EditReservationModalProps) {
  const [formData, setFormData] = useState<ReservationData>({
    name: '',
    email: '',
    phone: '',
    checkin_date: '',
    checkout_date: '',
    checkin_time: '15:00',
    num_guests: 1,
    adult_male: 1,
    adult_female: 0,
    child: 0,
    room_type: '',
    notes: '',
    status: 'confirmed'
  })
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [currentView, setCurrentView] = useState(new Date())
  const [selectedRoomAvailability, setSelectedRoomAvailability] = useState<Record<string, boolean>>({})
  const [checkInAvailability, setCheckInAvailability] = useState<Record<string, boolean>>({})
  const [isManualPrice, setIsManualPrice] = useState(false)
  const [manualTotalPrice, setManualTotalPrice] = useState(0)
  const [manualPriceDetail, setManualPriceDetail] = useState('')

  // 予約データを初期値として設定
  useEffect(() => {
    if (reservation && isOpen) {
      setFormData({
        name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
        checkin_date: reservation.checkin_date,
        checkout_date: reservation.checkout_date,
        checkin_time: reservation.checkin_time,
        num_guests: reservation.num_guests,
        adult_male: reservation.adult_male,
        adult_female: reservation.adult_female,
        child: reservation.child,
        room_type: reservation.room_type,
        notes: reservation.notes,
        status: reservation.status
      })
      setCheckIn(new Date(reservation.checkin_date))
      setCheckOut(new Date(reservation.checkout_date))
      setCurrentView(new Date(reservation.checkin_date))
      setManualTotalPrice(reservation.total_price || 0)
      setManualPriceDetail(reservation.price_detail || '')
    }
  }, [reservation, isOpen])

  // 部屋タイプ選択時に空室状況を取得（チェックアウト日用）
  useEffect(() => {
    if (!formData.room_type) {
      setSelectedRoomAvailability({});
      setCheckInAvailability({});
      return;
    }

    const fetchRoomAvailability = async () => {
      try {
        console.log('選択された部屋タイプの空室状況を取得中...', formData.room_type);
        
        // チェックイン日がある場合は、チェックイン日の月と翌月の予約状況を取得
        let startDate, endDate;
        
        if (checkIn) {
          // チェックイン日の月の開始日
          const checkInYear = checkIn.getFullYear();
          const checkInMonth = checkIn.getMonth();
          startDate = `${checkInYear}-${String(checkInMonth + 1).padStart(2, '0')}-01`;
          
          // 翌月の最終日
          const nextMonth = new Date(checkInYear, checkInMonth + 2, 0);
          endDate = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-${nextMonth.getDate()}`;
        } else {
          // チェックイン日がない場合は、カレンダーの表示月に基づいてAPIリクエスト
          const viewYear = currentView.getFullYear();
          const viewMonth = currentView.getMonth() + 1;
          const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
          
          startDate = `${viewYear}-${viewMonth.toString().padStart(2, '0')}-01`;
          endDate = `${viewYear}-${viewMonth.toString().padStart(2, '0')}-${daysInMonth}`;
        }
        
        const response = await fetch(`/api/availability?start_date=${startDate}&end_date=${endDate}&room_type=${encodeURIComponent(formData.room_type)}&exclude_reservation_id=${reservation?.id || ''}`);
        
        if (!response.ok) {
          throw new Error(`APIエラー: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('APIから取得した空室状況:', data);
        console.log('取得期間:', startDate, '～', endDate);
        console.log('チェックイン日:', checkIn ? formatYMD(checkIn) : 'なし');
        
        setSelectedRoomAvailability(data.availability);
      } catch (error) {
        console.error('部屋空室状況取得エラー:', error);
        // エラー時は空のデータを設定
        setSelectedRoomAvailability({});
      }
    };

    // チェックイン日用の空室状況を取得
    const fetchCheckInAvailability = async () => {
      try {
        // 現在表示中の月の予約状況を取得
        const viewYear = currentView.getFullYear();
        const viewMonth = currentView.getMonth() + 1;
        const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
        
        const startDate = `${viewYear}-${viewMonth.toString().padStart(2, '0')}-01`;
        const endDate = `${viewYear}-${viewMonth.toString().padStart(2, '0')}-${daysInMonth}`;
        
        const response = await fetch(`/api/availability?start_date=${startDate}&end_date=${endDate}&room_type=${encodeURIComponent(formData.room_type)}&exclude_reservation_id=${reservation?.id || ''}`);
        
        if (!response.ok) {
          throw new Error(`APIエラー: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('チェックイン日用空室状況:', data);
        
        setCheckInAvailability(data.availability);
      } catch (error) {
        console.error('チェックイン用空室状況取得エラー:', error);
        setCheckInAvailability({});
      }
    };
    
    fetchRoomAvailability();
    fetchCheckInAvailability();
  }, [formData.room_type, currentView, checkIn, reservation?.id]);

  // 料金計算用関数
  const getStayDates = () => {
    if (!checkIn || !checkOut) return []
    const dates = []
    let d = new Date(checkIn.getTime())
    while (d < checkOut) {
      dates.push(new Date(d))
      d.setDate(d.getDate() + 1)
    }
    return dates
  }

  const isJuly2025 = (date: Date) => {
    return date.getFullYear() === 2025 && date.getMonth() === 6
  }

  const countHeatingNights = () => {
    if (!checkIn || !checkOut) return 0
    let d = new Date(checkIn.getTime())
    let count = 0
    while (d < checkOut) {
      const m = d.getMonth() + 1
      const day = d.getDate()
      if ((m === 10 && day >= 1) || (m === 11) || (m === 12) || (m >= 1 && m <= 4)) {
        count++
      }
      d.setDate(d.getDate() + 1)
    }
    return count
  }

  const calculatePrice = () => {
    if (!checkIn || !checkOut || !formData.room_type) {
      return { totalPrice: 0, priceDetail: null, priceDetailText: '', heatingFee: 0 }
    }

    const stayDates = getStayDates()
    let basePrice = 0
    let priceDetail = null
    let priceDetailText = ''
    let julyAdultNights = 0, julyChildNights = 0, julyKashikiriNights = 0
    let normalAdultNights = 0, normalChildNights = 0, normalKashikiriNights = 0

    if (formData.room_type === '休業日') {
      return { totalPrice: 0, priceDetail: '休業日', priceDetailText: '', heatingFee: 0 }
    }

    if (formData.room_type === '貸切') {
      stayDates.forEach(date => {
        if (isJuly2025(date)) {
          julyKashikiriNights++
        } else {
          normalKashikiriNights++
        }
      })
      basePrice = 38500 * julyKashikiriNights + 44000 * normalKashikiriNights
      
      // 文字列版の料金明細を生成
      if (julyKashikiriNights > 0) {
        priceDetailText += `貸切 × ${julyKashikiriNights}泊 × 38,500円 = ${(38500 * julyKashikiriNights).toLocaleString()}円 【7月限定セール価格適用】\n`
      }
      if (normalKashikiriNights > 0) {
        priceDetailText += `貸切 × ${normalKashikiriNights}泊 × 44,000円 = ${(44000 * normalKashikiriNights).toLocaleString()}円\n`
      }
      
      priceDetail = (
        <>
          {julyKashikiriNights > 0 && (
            <li>
              貸切 × {julyKashikiriNights}泊 × <span className="text-red-600 font-bold">38,500円</span> = <span className="text-red-600 font-bold">{(38500 * julyKashikiriNights).toLocaleString()}円</span> <span className="text-red-600 font-bold">【7月限定セール価格適用】</span>
            </li>
          )}
          {normalKashikiriNights > 0 && (
            <li>
              貸切 × {normalKashikiriNights}泊 × 44,000円 = {(44000 * normalKashikiriNights).toLocaleString()}円
            </li>
          )}
        </>
      )
    } else {
      stayDates.forEach(date => {
        if (isJuly2025(date)) {
          julyAdultNights += formData.adult_male + formData.adult_female
          julyChildNights += formData.child
        } else {
          normalAdultNights += formData.adult_male + formData.adult_female
          normalChildNights += formData.child
        }
      })
      const baseAdultJuly = julyAdultNights * 7700
      const baseChildJuly = julyChildNights * 3850
      const baseAdultNormal = normalAdultNights * 9900
      const baseChildNormal = normalChildNights * 4950
      basePrice = baseAdultJuly + baseChildJuly + baseAdultNormal + baseChildNormal
      
      // 文字列版の料金明細を生成
      if (julyAdultNights > 0) {
        priceDetailText += `大人 ${formData.adult_male + formData.adult_female}名 × ${julyAdultNights / (formData.adult_male + formData.adult_female) || 0}泊 × 7,700円 = ${baseAdultJuly.toLocaleString()}円 【7月限定セール価格適用】\n`
      }
      if (normalAdultNights > 0) {
        priceDetailText += `大人 ${formData.adult_male + formData.adult_female}名 × ${normalAdultNights / (formData.adult_male + formData.adult_female) || 0}泊 × 9,900円 = ${(baseAdultNormal).toLocaleString()}円\n`
      }
      if (julyChildNights > 0) {
        priceDetailText += `子供 ${formData.child}名 × ${julyChildNights / (formData.child || 1)}泊 × 3,850円 = ${baseChildJuly.toLocaleString()}円 【7月限定セール価格適用】\n`
      }
      if (normalChildNights > 0) {
        priceDetailText += `子供 ${formData.child}名 × ${normalChildNights / (formData.child || 1)}泊 × 4,950円 = ${(baseChildNormal).toLocaleString()}円\n`
      }
      
      priceDetail = (
        <>
          {julyAdultNights > 0 && (
            <li>
              大人 {formData.adult_male + formData.adult_female}名 × {julyAdultNights / (formData.adult_male + formData.adult_female) || 0}泊 × <span className="text-red-600 font-bold">7,700円</span> = <span className="text-red-600 font-bold">{baseAdultJuly.toLocaleString()}円</span> <span className="text-red-600 font-bold">【7月限定セール価格適用】</span>
            </li>
          )}
          {normalAdultNights > 0 && (
            <li>
              大人 {formData.adult_male + formData.adult_female}名 × {normalAdultNights / (formData.adult_male + formData.adult_female) || 0}泊 × 9,900円 = {(baseAdultNormal).toLocaleString()}円
            </li>
          )}
          {julyChildNights > 0 && (
            <li>
              子供 {formData.child}名 × {julyChildNights / (formData.child || 1)}泊 × <span className="text-red-600 font-bold">3,850円</span> = <span className="text-red-600 font-bold">{baseChildJuly.toLocaleString()}円</span> <span className="text-red-600 font-bold">【7月限定セール価格適用】</span>
            </li>
          )}
          {normalChildNights > 0 && (
            <li>
              子供 {formData.child}名 × {normalChildNights / (formData.child || 1)}泊 × 4,950円 = {(baseChildNormal).toLocaleString()}円
            </li>
          )}
        </>
      )
    }

    const heatingNights = countHeatingNights()
    const heatingFee = (formData.adult_male + formData.adult_female + formData.child) * 550 * heatingNights
    const totalPrice = basePrice + heatingFee
    
    // 暖房費を料金明細に追加
    if (heatingFee > 0) {
      priceDetailText += `暖房費 ${formData.adult_male + formData.adult_female + formData.child}名 × ${heatingNights}泊 × 550円 = ${heatingFee.toLocaleString()}円\n`
    }

    return { totalPrice, priceDetail, priceDetailText, heatingFee, heatingNights }
  }

  const { totalPrice, priceDetail, priceDetailText, heatingFee, heatingNights } = calculatePrice()

  const formatYMD = (date: Date | null) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 曜日を判定してCSSクラスを返す関数
  const getDayClassName = (date: Date) => {
    const dayOfWeek = date.getDay() // 0: 日曜日, 1: 月曜日, ..., 6: 土曜日
    if (dayOfWeek === 0) return 'react-calendar__tile--sunday' // 日曜日
    if (dayOfWeek === 6) return 'react-calendar__tile--saturday' // 土曜日
    return ''
  }

  // チェックイン日選択不可の日付（過去の日付 + 選択された部屋タイプの満室日）
  const tileDisabled = ({date}: {date: Date}) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // 過去の日付は選択不可
    if (date < today) return true
    
    // 部屋タイプが選択されていない場合は、過去の日付のみ無効化
    if (!formData.room_type || Object.keys(checkInAvailability).length === 0) {
      return false
    }
    
    // 選択された部屋タイプの空室状況をチェック
    const dateStr = formatYMD(date)
    const isAvailable = checkInAvailability[dateStr]
    
    // 空室でない場合は選択不可
    return !isAvailable
  }

  // チェックアウト日選択不可の日付（チェックイン日以前 + 連続予約不可日）
  const checkOutTileDisabled = ({date}: {date: Date}) => {
    if (!checkIn) return true
    
    // チェックイン日以前は選択不可
    if (date <= checkIn) return true
    
    // 部屋タイプが選択されていない場合は、チェックイン日以前のみ無効化
    if (!formData.room_type || Object.keys(selectedRoomAvailability).length === 0) {
      return false
    }
    
    // チェックイン日の翌日は必ず選択可能
    const nextDay = new Date(checkIn)
    nextDay.setDate(nextDay.getDate() + 1)
    if (date.getTime() === nextDay.getTime()) {
      return false // 翌日は選択可能
    }
    
    // チェックイン日+2日以降は、連続して予約可能な日まで選択可能
    const checkInDate = new Date(checkIn)
    checkInDate.setHours(0, 0, 0, 0)
    
    // チェックイン日からチェックアウト候補日までの各日をチェック
    for (let d = new Date(checkInDate); d < date; d.setDate(d.getDate() + 1)) {
      const dateStr = formatYMD(d)
      const isAvailable = selectedRoomAvailability[dateStr]
      
      // 途中で満室日があれば、その日は選択不可
      if (!isAvailable) {
        return true
      }
    }
    
    // 全ての日が空室であれば選択可能
    return false
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'お名前を入力してください'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = '電話番号を入力してください'
    }
    if (!formData.room_type) {
      newErrors.room_type = '部屋タイプを選択してください'
    }
    if (!checkIn) {
      newErrors.checkin_date = 'チェックイン日を選択してください'
    }
    if (!checkOut) {
      newErrors.checkout_date = 'チェックアウト日を選択してください'
    }
    if (checkIn && checkOut && checkIn >= checkOut) {
      newErrors.checkout_date = 'チェックアウト日はチェックイン日より後の日付を選択してください'
    }
    if (formData.room_type === '休業日' && !formData.notes.trim()) {
      newErrors.notes = '休業日の場合は備考欄の記載が必須です'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 人数変更時の処理
  const handleGuestChange = (type: 'adult_male' | 'adult_female' | 'child', value: number) => {
    const newData = { ...formData }
    newData[type] = value
    newData.num_guests = newData.adult_male + newData.adult_female + newData.child
    setFormData(newData)
  }

  // 部屋タイプ変更時の処理
  const handleRoomTypeChange = (roomType: string) => {
    setFormData(prev => ({
      ...prev,
      room_type: roomType
    }))

    // 部屋タイプ変更時にチェックイン/チェックアウト日をクリア
    setCheckIn(null)
    setCheckOut(null)
    setFormData(prev => ({
      ...prev,
      checkin_date: '',
      checkout_date: ''
    }))

    // 部屋タイプ「休業日」選択時の自動入力
    if (roomType === '休業日') {
      setFormData(prev => ({
        ...prev,
        name: '管理者',
        email: 'admin@co.jp',
        phone: '09000000000'
      }))
    }
    // 他の部屋タイプに変更した場合は自動入力値のみクリア（既に入力されている値は保持）
    else if (formData.name === '管理者' && formData.email === 'admin@co.jp' && formData.phone === '09000000000') {
      setFormData(prev => ({
        ...prev,
        name: '',
        email: '',
        phone: ''
      }))
    }
  }

  // チェックイン日変更時の処理
  const handleCheckInChange = (date: Date) => {
    setCheckIn(date)
    setFormData({ ...formData, checkin_date: formatYMD(date) })
    setCheckOut(null)
  }

  // チェックアウト日変更時の処理
  const handleCheckOutChange = (date: Date) => {
    setCheckOut(date)
    setFormData({ ...formData, checkout_date: formatYMD(date) })
  }

  // 送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      // 純粋なデータオブジェクトのみを送信
      const reservationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        checkin_date: formData.checkin_date,
        checkout_date: formData.checkout_date,
        checkin_time: formData.checkin_time,
        num_guests: formData.num_guests,
        adult_male: formData.adult_male,
        adult_female: formData.adult_female,
        child: formData.child,
        room_type: formData.room_type,
        notes: formData.notes,
        status: formData.status,
        total_price: isManualPrice ? manualTotalPrice : totalPrice,
        price_detail: isManualPrice ? manualPriceDetail : priceDetailText
      }

      const response = await fetch(`/api/reservations/${reservation?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      })

      if (!response.ok) {
        throw new Error('予約の更新に失敗しました')
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('予約更新エラー:', error)
      setErrors({ submit: '予約の更新中にエラーが発生しました' })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !reservation) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">予約編集</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 基本情報 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                お名前 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                電話番号 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* 宿泊人数 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">宿泊人数</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">大人(男性)</label>
                <select
                  value={formData.adult_male}
                  onChange={(e) => handleGuestChange('adult_male', Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}名</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">大人(女性)</label>
                <select
                  value={formData.adult_female}
                  onChange={(e) => handleGuestChange('adult_female', Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}名</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">子供</label>
                <select
                  value={formData.child}
                  onChange={(e) => handleGuestChange('child', Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}名</option>)}
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-700 mt-2">合計: {formData.num_guests}名</div>
          </div>

          {/* 部屋タイプ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">部屋タイプ <span className="text-red-500">*</span></label>
            <div className="flex gap-4">
              {['Room1', 'Room2', '貸切', '休業日'].map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="roomType"
                    value={type}
                    checked={formData.room_type === type}
                    onChange={() => handleRoomTypeChange(type)}
                    className="mr-2"
                  />
                  {type}
                </label>
              ))}
            </div>
            {errors.room_type && <p className="text-red-600 text-sm mt-1">{errors.room_type}</p>}
          </div>

          {/* カレンダー */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-medium mb-2">チェックイン</h3>
              <Calendar
                onChange={(date) => handleCheckInChange(date as Date)}
                value={checkIn}
                onActiveStartDateChange={({ activeStartDate }) => {
                  if (activeStartDate) {
                    setCurrentView(activeStartDate)
                  }
                }}
                showNeighboringMonth={false}
                className="w-full"
                tileDisabled={tileDisabled}
                tileClassName={({ date }) => getDayClassName(date)}
              />
              <input
                type="date"
                value={formatYMD(checkIn)}
                onChange={e => setCheckIn(e.target.value ? new Date(e.target.value) : null)}
                className="mt-2 w-full p-2 border rounded-md"
              />
              {errors.checkin_date && <p className="text-red-600 text-sm mt-1">{errors.checkin_date}</p>}
            </div>

            <div>
              <h3 className="text-base font-medium mb-2">チェックアウト</h3>
              <Calendar
                onChange={(date) => handleCheckOutChange(date as Date)}
                value={checkOut}
                onActiveStartDateChange={({ activeStartDate }) => {
                  if (activeStartDate) {
                    setCurrentView(activeStartDate)
                  }
                }}
                showNeighboringMonth={false}
                className="w-full"
                tileDisabled={checkOutTileDisabled}
                tileClassName={({ date }) => getDayClassName(date)}
              />
              <input
                type="date"
                value={formatYMD(checkOut)}
                onChange={e => setCheckOut(e.target.value ? new Date(e.target.value) : null)}
                className="mt-2 w-full p-2 border rounded-md"
                min={checkIn ? formatYMD(new Date(checkIn.getTime() + 24*60*60*1000)) : undefined}
              />
              {errors.checkout_date && <p className="text-red-600 text-sm mt-1">{errors.checkout_date}</p>}
            </div>
          </div>

          {/* チェックイン時間 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">チェックイン予定時間</label>
            <select
              value={formData.checkin_time}
              onChange={(e) => setFormData({ ...formData, checkin_time: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              {Array.from({length: 11}, (_, i) => {
                const hour = 15 + Math.floor(i/2)
                const min = i%2 === 0 ? '00' : '30'
                return `${hour}:${min}`
              }).map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          {/* 料金表示 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-2">
                <div className="text-lg font-bold">料金合計: ¥{isManualPrice ? manualTotalPrice.toLocaleString() : totalPrice.toLocaleString()}</div>
                <button
                  type="button"
                  onClick={() => setIsManualPrice(!isManualPrice)}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isManualPrice ? '自動計算に戻す' : '手動編集'}
                </button>
              </div>
              
              {isManualPrice && (
                <div className="mb-4 space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">料金合計（手動入力）</label>
                    <input
                      type="number"
                      value={manualTotalPrice}
                      onChange={(e) => setManualTotalPrice(Number(e.target.value))}
                      className="w-full p-2 border rounded-md"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">料金明細（手動入力）</label>
                    <textarea
                      value={manualPriceDetail}
                      onChange={(e) => setManualPriceDetail(e.target.value)}
                      rows={4}
                      className="w-full p-2 border rounded-md"
                      placeholder="料金明細を入力してください"
                    />
                  </div>
                </div>
              )}
              
              <button
                type="button"
                className="text-sm text-blue-600 underline mt-2"
                onClick={() => setShowDetails(!showDetails)}
              >
                料金明細 {showDetails ? '▲' : '▼'}
              </button>
              {showDetails && (
                <div className="mt-2 text-sm">
                  {isManualPrice ? (
                    <div className="bg-white p-3 rounded border">
                      <p className="whitespace-pre-wrap">{manualPriceDetail || '料金明細が入力されていません'}</p>
                    </div>
                  ) : (
                    <ul className="list-disc list-inside space-y-1">
                      {priceDetail}
                      {heatingFee > 0 && (
                        <li>暖房費 {formData.adult_male + formData.adult_female + formData.child}名 × {heatingNights}泊 × 550円 = {heatingFee.toLocaleString()}円</li>
                      )}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 備考 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full p-2 border rounded-md"
            />
            {errors.notes && <p className="text-red-600 text-sm mt-1">{errors.notes}</p>}
          </div>

          {/* ステータス */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="confirmed">確認済み</option>
              <option value="pending">未確認</option>
            </select>
          </div>

          {/* エラーメッセージ */}
          {errors.submit && (
            <div className="text-red-600 text-sm">{errors.submit}</div>
          )}

          {/* ボタン */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '更新中...' : '更新'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 