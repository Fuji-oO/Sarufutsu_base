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
      setError('予期せぬエラーが発生しました。時間をおいて再度お試しいただくか、sarufutsu.base@gmail.comまでご連絡ください。')
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
    <div className="w-full" style={{ background: '#F5EEDC' }}>
      <div className="container mx-auto px-2 md:px-4 py-16 md:py-[120px]">
        <div className="w-full">
          {!showThanks && (
            <>
              <h1 className="text-2xl md:text-4xl font-bold text-center mb-2 md:mb-4" style={{letterSpacing:'0.1em'}}>Contact</h1>
              <p className="text-xs md:text-base text-center mb-6 md:mb-12" style={{letterSpacing:'0.1em'}}>- お問い合わせ -</p>
            </>
          )}
          <div
            ref={formWrapperRef}
            className={`transition-opacity duration-700 ${fadeOut && !showThanks ? 'opacity-0 pointer-events-none' : 'opacity-100'} min-h-[70vh] flex items-center justify-center`}
            style={{ transitionDuration: '700ms' }}
          >
            <div className="max-w-2xl w-full bg-white bg-opacity-90 rounded-lg shadow-lg p-3 md:p-8 flex items-center justify-center">
              <div className="max-w-2xl w-full">
                {showThanks ? (
                  <div
                    className={`flex flex-col items-center justify-center min-h-[40vh] transition-opacity duration-800 ${thanksVisible ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transitionDuration: '800ms' }}
                  >
                    <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-8 text-center">お問い合わせありがとうございます</h2>
                    <p className="mb-6 md:mb-10 text-center text-xs md:text-base text-gray-800">
                      送信いただいた内容を確認のうえ、担当者よりご連絡差し上げます。<br />
                      恐れ入りますが、今しばらくお待ちくださいませ。
                    </p>
                    <button
                      className="w-full max-w-xs bg-[#BFAE8A] text-white py-2 md:py-3 rounded-md font-bold hover:bg-[#A4936A] transition-colors text-sm md:text-base"
                      onClick={() => window.location.href = '/'}
                    >
                      トップページに戻る
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-[#fff] p-3 md:p-6 rounded-lg mb-4 md:mb-8 border-2" style={{ borderColor: '#BFAE8A' }}>
                      <h2 className="text-base md:text-2xl font-black mb-2 md:mb-4">お電話でのお問い合わせ</h2>
                      <p className="text-xs md:text-base text-gray-700 ml-20 md:ml-16 mb-1 md:mb-2">
                        <span className="font-bold">TEL:</span> 070-2616-1188
                      </p>
                      <p className="text-xs md:text-base text-gray-700 ml-20 md:ml-16">
                        <span className="font-bold">受付時間:</span> 9:00 〜 18:00（年中無休）
                      </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 pb-4 md:pb-8">
                      <div>
                        <label htmlFor="name" className="block text-xs md:text-base text-gray-700 font-bold mb-1 md:mb-2">
                          お名前 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3 md:px-4 py-1.5 md:py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-xs md:text-base"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-xs md:text-base text-gray-700 font-bold mb-1 md:mb-2">
                          メールアドレス <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 md:px-4 py-1.5 md:py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-xs md:text-base"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-xs md:text-base text-gray-700 font-bold mb-1 md:mb-2">
                          電話番号
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-3 md:px-4 py-1.5 md:py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-xs md:text-base"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-xs md:text-base text-gray-700 font-bold mb-1 md:mb-2">
                          お問い合わせ項目 <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-3 md:px-4 py-1.5 md:py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-xs md:text-base"
                        >
                          <option value="">選択してください</option>
                          <option value="reservation">宿泊予約について</option>
                          <option value="facility">施設について</option>
                          <option value="access">アクセスについて</option>
                          <option value="other">その他</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-xs md:text-base text-gray-700 font-bold mb-1 md:mb-2">
                          お問い合わせ内容 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          rows={5}
                          className="w-full px-3 md:px-4 py-1.5 md:py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-xs md:text-base"
                        ></textarea>
                      </div>

                      <div className="mt-4 md:mt-8 text-gray-700 text-center">
                        <span className="block md:hidden">
                          <p className="text-xs">返信には2~3営業日お時間を要する場合もございます。<br />何卒ご了承ください。</p>
                        </span>
                        <span className="hidden md:block">
                          <p className="text-base">ご返信には2~3営業日お時間を要する場合もございます。何卒ご了承ください。</p>
                        </span>
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
                        <label htmlFor="privacy" className="text-xs md:text-base text-gray-700 select-none">
                          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline">プライバシーポリシー</a>に同意する
                        </label>
                      </div>

                      {error && (
                        <div className="text-xs md:text-base text-red-500 text-center mb-2">{error}</div>
                      )}

                      <div className="text-center mt-2 md:mt-4">
                        <button
                          type="submit"
                          className={`w-40 md:w-full max-w-xs py-2 md:py-3 rounded-md font-bold transition-colors text-sm md:text-base
                            ${(!isAgreed || loading)
                              ? 'bg-gray-300 text-white cursor-not-allowed'
                              : 'bg-[#BFAE8A] text-white hover:bg-[#A4936A]'}
                          `}
                          disabled={loading || !isAgreed}
                        >
                          {loading ? '送信中...' : '送信'}
                        </button>
                      </div>
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