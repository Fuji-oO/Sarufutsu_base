'use client'

import React, { useState, useRef } from 'react'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isAgreed, setIsAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showThanks, setShowThanks] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [thanksVisible, setThanksVisible] = useState(false)
  const formWrapperRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setFadeOut(true);
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setShowThanks(true);
          setTimeout(() => {
            setThanksVisible(true);
          }, 200); // スクロール後0.2秒待ってからフェードイン
        }, 600); // フェードアウト時間
      } else {
        throw new Error(data.error || '送信に失敗しました。時間をおいて再度お試しください。')
      }
    } catch (error: any) {
      setError(error.message || '送信に失敗しました。時間をおいて再度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen w-full" style={{ background: '#F5EEDC' }}>
      <div className="container mx-auto px-4 py-[120px] min-h-screen flex items-center">
        <div className="w-full">
          {!showThanks && (
            <>
              <h1 className="text-4xl font-bold text-center mb-4" style={{letterSpacing:'0.1em'}}>Contact</h1>
              <p className="text-ml text-center mb-12" style={{letterSpacing:'0.1em'}}>- お問い合わせ -</p>
            </>
          )}
          <div
            ref={formWrapperRef}
            className={`transition-opacity duration-700 ${fadeOut && !showThanks ? 'opacity-0 pointer-events-none' : 'opacity-100'} min-h-[70vh] flex items-center justify-center`}
            style={{ transitionDuration: '700ms' }}
          >
            <div className="max-w-2xl w-full bg-white bg-opacity-90 rounded-lg shadow-lg p-8 flex items-center justify-center">
              <div className="max-w-2xl w-full">
                {showThanks ? (
                  <div
                    className={`flex flex-col items-center justify-center min-h-[40vh] transition-opacity duration-800 ${thanksVisible ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transitionDuration: '800ms' }}
                  >
                    <h2 className="text-3xl font-bold mb-8 text-center">お問い合わせありがとうございます</h2>
                    <p className="mb-10 text-center text-gray-800">
                      送信いただいた内容を確認のうえ、担当者よりご連絡差し上げます。<br />
                      恐れ入りますが、今しばらくお待ちくださいませ。
                    </p>
                    <button
                      className="w-full max-w-xs bg-[#BFAE8A] text-white py-3 rounded-md font-bold hover:bg-[#A4936A] transition-colors"
                      onClick={() => window.location.href = '/'}
                    >
                      トップページに戻る
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-[#fff] p-6 rounded-lg mb-8 border-2" style={{ borderColor: '#BFAE8A' }}>
                      <h2 className="text-2xl font-bold mb-4">お電話でのお問い合わせ</h2>
                      <p className="text-gray-700 mb-2">
                        <span className="font-bold">TEL:</span> 070-2616-1188
                      </p>
                      <p className="text-gray-700">
                        <span className="font-bold">受付時間:</span> 9:00 〜 18:00（年中無休）
                      </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                          お名前 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                          メールアドレス <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
                          電話番号
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-gray-700 font-bold mb-2">
                          お問い合わせ項目 <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        >
                          <option value="">選択してください</option>
                          <option value="reservation">宿泊予約について</option>
                          <option value="facility">施設について</option>
                          <option value="access">アクセスについて</option>
                          <option value="other">その他</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-gray-700 font-bold mb-2">
                          お問い合わせ内容 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          rows={5}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        ></textarea>
                      </div>

                      <div className="mt-8 text-gray-700 text-center">
                        <p>
                          ご返信には2~3営業日お時間を要する場合もございます。何卒ご了承ください。
                        </p>
                      </div>

                      {/* プライバシーポリシー同意チェックボックス */}
                      <div className="flex items-center justify-center mb-2">
                        <input
                          type="checkbox"
                          id="privacy"
                          checked={isAgreed}
                          onChange={e => setIsAgreed(e.target.checked)}
                          className="mr-2"
                          required
                        />
                        <label htmlFor="privacy" className="text-gray-700 select-none">
                          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline text-blue-700 hover:text-blue-900">プライバシーポリシー</a>に同意する
                        </label>
                      </div>

                      <div className="text-center">
                        <button
                          type="submit"
                          className={`text-white px-8 py-3 rounded-lg transition-colors ${!isAgreed || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#A4936A]'}`}
                          style={{ background: '#BFAE8A' }}
                          disabled={!isAgreed || loading}
                        >
                          {loading ? '送信中...' : '送信する'}
                        </button>
                      </div>
                      {error && (
                        <div className="text-center text-red-600 text-sm mt-2">{error}</div>
                      )}
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage 