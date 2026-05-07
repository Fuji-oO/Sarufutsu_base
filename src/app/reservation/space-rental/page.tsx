'use client'

import { useState } from 'react'
import FadeTransitionWrapper from '../../../components/FadeTransitionWrapper'

export default function ReservationPage() {
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  return (
    <FadeTransitionWrapper>
      <div className="min-h-screen pt-16 pb-24 md:py-[120px]" style={{ background: '#F5EEDC' }}>
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-center" style={{ letterSpacing: '0.1em' }}>Space Rental</h1>
          <p className="text-xs md:text-base text-center mb-8 md:mb-12" style={{ letterSpacing: '0.1em' }}>- スペースレンタル予約 -</p>
          <div className="mb-8 md:mb-12 max-w-2xl mx-auto bg-[#FEFDFC] rounded-lg shadow p-4 md:p-6 text-center text-sm md:text-lg font-semibold text-gray-800" style={{ border: '2px solid #bfae8a' }}>
            <div className="font-mono mb-3 md:mb-5">【利用料金】</div>
            <div className="mb-1">
              <span className="text-gray-800 font-bold text-sm md:text-base">
                ご利用内容によって時間・料金などが異なります。<br />
                以下の各ボタンから詳細をご確認ください。
              </span>
            </div>
            <div className="mt-3 md:mt-5 flex flex-col md:flex-row gap-2 md:gap-8 justify-center items-center">
              <button
                type="button"
                className="w-36 md:w-40 min-h-[2.25rem] px-3 py-1.5 text-xs md:text-sm font-medium text-gray-700 bg-white/80 border border-[#c9bba0] rounded-md shadow-none hover:bg-[#f5eedc]/90 hover:border-[#bfae8a] transition-colors"
                onClick={() => setPreviewImage('/images/spacerentalday.jpg')}
              >
                イベント利用
              </button>
              <button
                type="button"
                className="w-36 md:w-40 min-h-[2.25rem] px-3 py-1.5 text-xs md:text-sm font-medium text-gray-700 bg-white/80 border border-[#c9bba0] rounded-md shadow-none hover:bg-[#f5eedc]/90 hover:border-[#bfae8a] transition-colors"
                onClick={() => setPreviewImage('/images/spacerentalnight.jpg')}
              >
                飲み会・食事会利用
              </button>
            </div>
          </div>

          <div className="flex justify-center text-sm md:text-lg mb-4 md:mb-6">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfISQmWX9kA18GTzvc-MntXvnYu4cIloViaOvSSZ_RIRcIQrQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="w-40 md:w-56 h-10 md:h-12 bg-[#BFAE8A] text-[#222] font-bold rounded-none shadow hover:opacity-80 transition text-sm md:text-lg flex items-center justify-center"
            >
              ご予約はこちらから
            </a>
          </div>

          <div className="max-w-4xl mx-auto text-center mb-4 md:mb-6">
            <p className="text-xs md:text-sm text-gray-700 mb-10 md:mb-20">
              下部の空き状況カレンダーをご確認の上、ご予約にお進みください。<br />
            </p>
            <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ letterSpacing: '0.08em' }}>空き状況カレンダー</h2>
            <p className="text-xs md:text-sm text-gray-700">
              ×：予約不可　　　△：一部予約可能
            </p>
            <p className="text-xs md:text-sm text-gray-700 mt-3">
            クリックすると詳細をご確認いただけます。<br />
              「 × 」や「 △ 」の記載のない日は終日ご予約可能です。
            </p>
          </div>
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-2 md:p-4">
            <iframe 
              src="https://calendar.google.com/calendar/embed?src=5c91ff2da4d1cd5fb03f911fc1966b93b3e5ba9011b25d3509baa24b8540b5f7%40group.calendar.google.com&ctz=Asia%2FTokyo" 
              style={{ borderWidth: 0 }} 
              className="mx-auto w-[95%] md:w-full h-[360px] md:h-[600px]"
              frameBorder="0" 
              scrolling="no" 
              title="空き状況カレンダー">
            </iframe>
          </div>

          <div className="flex justify-center mt-10 md:mt-12">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfISQmWX9kA18GTzvc-MntXvnYu4cIloViaOvSSZ_RIRcIQrQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="w-40 md:w-56 h-10 md:h-12 bg-[#BFAE8A] text-[#222] font-bold rounded-none shadow hover:opacity-80 transition text-sm md:text-lg flex items-center justify-center"
            >
              ご予約はこちらから
            </a>
          </div>
        </div>
      </div>
      {previewImage && (
        <div
          className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-4 cursor-pointer animate-[fadeIn_0.28s_ease-out]"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="スペースレンタル料金表"
            className="max-w-[95vw] max-h-[90vh] object-contain shadow-2xl animate-[imageFadeIn_0.35s_ease-out]"
          />
        </div>
      )}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes imageFadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </FadeTransitionWrapper>
  )
}
  