'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FadeLink from '../../../components/FadeLink'
import ReservationDetailModal from '../../../components/ReservationDetailModal'
import ReservationCalendar from '../../../components/ReservationCalendar'
import CreateReservationModal from '../../../components/admin/CreateReservationModal'
import EditReservationModal from '../../../components/admin/EditReservationModal'

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

export default function AdminDashboardPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [filterMonth, setFilterMonth] = useState<Date | null>(null)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'monthly' | 'all'>('monthly')
  const router = useRouter()

  useEffect(() => {
    // ログイン状態チェック
    const isLoggedIn = localStorage.getItem('adminLoggedIn')
    if (!isLoggedIn) {
      router.push('/admin/login')
      return
    }

    // 予約データ取得
    fetchReservations()
  }, [router])

  useEffect(() => {
    // 予約データのフィルタリングとソート
    let filtered = [...reservations]
    
    // 選択された月の予約のみをフィルタリング
    filtered = filtered.filter(reservation => {
      const checkinDate = new Date(reservation.checkin_date)
      return checkinDate.getMonth() === selectedMonth.getMonth() && 
             checkinDate.getFullYear() === selectedMonth.getFullYear()
    })
    
    // チェックイン日昇順でソート
    filtered.sort((a, b) => new Date(a.checkin_date).getTime() - new Date(b.checkin_date).getTime())
    
    setFilteredReservations(filtered)
  }, [reservations, selectedMonth])

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservations')
      if (!response.ok) {
        throw new Error('予約データの取得に失敗しました')
      }
      const data = await response.json()
      setReservations(data.reservations || [])
    } catch (error) {
      setError('予約データの取得中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP')
  }

  const formatMonth = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`
  }

  // 人数内訳を表示する関数
  const formatGuestBreakdown = (reservation: Reservation) => {
    const parts = []
    if (reservation.adult_male > 0) {
      parts.push(`大人男性: ${reservation.adult_male}名`)
    }
    if (reservation.adult_female > 0) {
      parts.push(`大人女性: ${reservation.adult_female}名`)
    }
    if (reservation.child > 0) {
      parts.push(`子供: ${reservation.child}名`)
    }
    return parts.join('\n')
  }

  const getMonthStats = (date: Date) => {
    const monthReservations = reservations.filter(reservation => {
      const checkinDate = new Date(reservation.checkin_date)
      return checkinDate.getMonth() === date.getMonth() && 
             checkinDate.getFullYear() === date.getFullYear() &&
             reservation.room_type !== '休業日'
    })
    
    return {
      count: monthReservations.length,
      revenue: monthReservations.reduce((sum, r) => sum + (r.total_price || 0), 0)
    }
  }

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedMonth)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setSelectedMonth(newDate)
  }

  const handleReservationClick = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedReservation(null)
  }

  const currentMonthStats = getMonthStats(selectedMonth)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily: 'Klee One, cursive'}}>
                予約管理システム
              </h1>
              <p className="text-sm text-gray-600">さるふつbase 管理者ダッシュボード</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-xs md:text-base bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* 統計タブ */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          {/* タブナビゲーション */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('monthly')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'monthly'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                月別統計
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                全期間統計
              </button>
            </nav>
          </div>

          {/* 月別統計タブ */}
          {activeTab === 'monthly' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">月別統計</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => changeMonth('prev')}
                    className="p-2 text-gray-600 hover:text-gray-900"
                  >
                    ←
                  </button>
                  <span className="text-lg font-medium">{formatMonth(selectedMonth)}</span>
                  <button
                    onClick={() => changeMonth('next')}
                    className="p-2 text-gray-600 hover:text-gray-900"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* 予約/売上統計 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700">予約数</h4>
                  <p className="text-2xl font-bold text-blue-600">{currentMonthStats.count}件</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700">宿泊人数</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredReservations.filter(r => r.room_type !== '休業日').reduce((sum, r) => sum + (r.num_guests || 0), 0)}名
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700">売上</h4>
                  <p className="text-2xl font-bold text-purple-600">¥{currentMonthStats.revenue.toLocaleString()}</p>
                </div>
              </div>

              {/* 月別予約一覧 */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-900">{formatMonth(selectedMonth)}の予約一覧</h4>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    新規予約作成
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          予約者
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          チェックイン
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          チェックアウト
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          部屋タイプ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          人数
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          人数内訳
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          料金
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredReservations.map((reservation) => (
                        <tr 
                          key={reservation.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleReservationClick(reservation)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{reservation.name}</div>
                              <div className="text-sm text-gray-500">{reservation.email}</div>
                              <div className="text-sm text-gray-500">{reservation.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(reservation.checkin_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(reservation.checkout_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {reservation.room_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {reservation.num_guests}名
                          </td>
                          <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-900">
                            {formatGuestBreakdown(reservation)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ¥{reservation.total_price?.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredReservations.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">{formatMonth(selectedMonth)}の予約データがありません</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 全期間統計タブ */}
          {activeTab === 'all' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">全期間統計</h3>
              </div>

              {/* 全期間予約/売上統計 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700">総予約数</h4>
                  <p className="text-2xl font-bold text-indigo-600">{reservations.filter(r => r.room_type !== '休業日').length}件</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700">宿泊人数</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {reservations.filter(r => r.room_type !== '休業日').reduce((sum, r) => sum + (r.num_guests || 0), 0)}名
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700">総売上</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    ¥{reservations.filter(r => r.room_type !== '休業日').reduce((sum, r) => sum + (r.total_price || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* 全期間予約一覧 */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-900">全期間予約一覧</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <label htmlFor="monthFilter" className="text-sm text-gray-700">対象年月:</label>
                      <select
                        id="monthFilter"
                        value={filterMonth ? `${filterMonth.getFullYear()}-${String(filterMonth.getMonth() + 1).padStart(2, '0')}` : ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            const [year, month] = e.target.value.split('-').map(Number)
                            setFilterMonth(new Date(year, month - 1))
                          } else {
                            setFilterMonth(null)
                          }
                        }}
                        className="text-sm border border-gray-300 rounded-md px-3 py-1"
                      >
                        <option value="">全期間</option>
                        {(() => {
                          const months = []
                          const now = new Date()
                          // 過去18ヶ月～未来6ヶ月の範囲で選択肢を生成
                          for (let i = -18; i <= 6; i++) {
                            const date = new Date(now.getFullYear(), now.getMonth() + i, 1)
                            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                            const label = `${date.getFullYear()}年${date.getMonth() + 1}月`
                            months.push({ value, label })
                          }
                          return months.map(month => (
                            <option key={month.value} value={month.value}>
                              {month.label}
                            </option>
                          ))
                        })()}
                      </select>
                    </div>
                    {filterMonth && (
                      <button
                        onClick={() => setFilterMonth(null)}
                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
                      >
                        フィルター解除
                      </button>
                    )}
                    <span className="text-sm text-gray-600">
                      {(() => {
                        let filtered = [...reservations]
                        if (filterMonth) {
                          filtered = filtered.filter(reservation => {
                            const checkinDate = new Date(reservation.checkin_date)
                            return checkinDate.getMonth() === filterMonth.getMonth() && 
                                   checkinDate.getFullYear() === filterMonth.getFullYear()
                          })
                        }
                        return `${filtered.length}件表示中`
                      })()}
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          予約者
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          チェックイン
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          チェックアウト
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          部屋タイプ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          人数
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          人数内訳
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          料金
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(() => {
                        let filtered = [...reservations]
                        if (filterMonth) {
                          filtered = filtered.filter(reservation => {
                            const checkinDate = new Date(reservation.checkin_date)
                            return checkinDate.getMonth() === filterMonth.getMonth() && 
                                   checkinDate.getFullYear() === filterMonth.getFullYear()
                          })
                        }
                        return filtered.sort((a, b) => new Date(a.checkin_date).getTime() - new Date(b.checkin_date).getTime())
                      })().map((reservation) => (
                        <tr 
                          key={reservation.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleReservationClick(reservation)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{reservation.name}</div>
                              <div className="text-sm text-gray-500">{reservation.email}</div>
                              <div className="text-sm text-gray-500">{reservation.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(reservation.checkin_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(reservation.checkout_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {reservation.room_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {reservation.num_guests}名
                          </td>
                          <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-900">
                            {formatGuestBreakdown(reservation)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ¥{reservation.total_price?.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 予約状況カレンダー */}
        <div className="mt-8">
          <ReservationCalendar />
        </div>
      </div>

      {/* 予約詳細モーダル */}
      <ReservationDetailModal
        reservation={selectedReservation}
        isOpen={isModalOpen}
        onClose={closeModal}
        onDelete={() => {
          fetchReservations()
          closeModal()
        }}
        onEdit={() => {
          setIsEditModalOpen(true)
          // モーダルを閉じずに編集モーダルを開く
        }}
      />

      {/* 予約編集モーダル */}
      <EditReservationModal
        reservation={selectedReservation}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          // 詳細モーダルは開いたままにする
        }}
        onSuccess={() => {
          fetchReservations()
          setIsEditModalOpen(false)
          closeModal() // 編集成功時のみ詳細モーダルを閉じる
        }}
      />

      {/* 新規予約作成モーダル */}
      <CreateReservationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchReservations()
          setIsCreateModalOpen(false)
        }}
      />
    </div>
  )
} 