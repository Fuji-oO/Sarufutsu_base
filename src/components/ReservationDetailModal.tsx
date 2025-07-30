'use client'

import { useEffect, useState } from 'react'

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

interface ReservationDetailModalProps {
  reservation: Reservation | null
  isOpen: boolean
  onClose: () => void
  onDelete?: () => void
  onEdit?: () => void
}

export default function ReservationDetailModal({ reservation, isOpen, onClose, onDelete, onEdit }: ReservationDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleDelete = async () => {
    if (!reservation) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/reservations/${reservation.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('削除に失敗しました')
      }

      // 削除成功時の処理
      onDelete?.()
      onClose()
    } catch (error) {
      console.error('削除エラー:', error)
      alert('削除に失敗しました。もう一度お試しください。')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (!isOpen || !reservation) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP')
  }

  const getStayNights = () => {
    const checkin = new Date(reservation.checkin_date)
    const checkout = new Date(reservation.checkout_date)
    const diffTime = checkout.getTime() - checkin.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">予約詳細</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* コンテンツ */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本情報 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">基本情報</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">予約者名</dt>
                  <dd className="text-sm text-gray-900">{reservation.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">メールアドレス</dt>
                  <dd className="text-sm text-gray-900">{reservation.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">電話番号</dt>
                  <dd className="text-sm text-gray-900">{reservation.phone}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">部屋タイプ</dt>
                  <dd className="text-sm text-gray-900">{reservation.room_type}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">ステータス</dt>
                  <dd>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      reservation.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reservation.status === 'confirmed' ? '確認済み' : '未確認'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* 宿泊情報 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">宿泊情報</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">チェックイン</dt>
                  <dd className="text-sm text-gray-900">
                    {formatDate(reservation.checkin_date)} {reservation.checkin_time}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">チェックアウト</dt>
                  <dd className="text-sm text-gray-900">{formatDate(reservation.checkout_date)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">宿泊日数</dt>
                  <dd className="text-sm text-gray-900">{getStayNights()}泊</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">宿泊人数</dt>
                  <dd className="text-sm text-gray-900">
                    大人男性: {reservation.adult_male}名<br />
                    大人女性: {reservation.adult_female}名<br />
                    子供: {reservation.child}名<br />
                    合計: {reservation.num_guests}名
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">料金</dt>
                  <dd className="text-sm text-gray-900">¥{reservation.total_price?.toLocaleString()}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* 備考 */}
          {reservation.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">備考</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{reservation.notes}</p>
              </div>
            </div>
          )}

          {/* 料金詳細 */}
          {reservation.price_detail && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">料金詳細</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{reservation.price_detail}</p>
              </div>
            </div>
          )}

          {/* システム情報 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">システム情報</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">予約ID</dt>
                <dd className="text-sm text-gray-900 font-mono">{reservation.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">作成日時</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(reservation.created_at)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">更新日時</dt>
                <dd className="text-sm text-gray-900">{formatDateTime(reservation.updated_at)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* フッター */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <div className="flex space-x-3">
            <button
              onClick={() => onEdit && onEdit()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              編集
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDeleting}
            >
              削除
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            閉じる
          </button>
        </div>

        {/* 削除確認ダイアログ */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">予約の削除</h3>
              <p className="text-sm text-gray-600 mb-6">
                この予約を削除しますか？<br />
                この操作は取り消すことができません。
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  disabled={isDeleting}
                >
                  キャンセル
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isDeleting}
                >
                  {isDeleting ? '削除中...' : '削除'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 