'use client'

import { FaInstagram } from 'react-icons/fa'
import FadeTransitionWrapper from '../../components/FadeTransitionWrapper'

export default function ReservationPage() {
  return (
    <FadeTransitionWrapper>
      <div className="min-h-screen pt-16 pb-24 md:py-[120px]" style={{ background: '#F5EEDC' }}>
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-center" style={{ letterSpacing: '0.1em' }}>Stay Reservation</h1>
          <p className="text-xs md:text-base text-center mb-8 md:mb-12" style={{ letterSpacing: '0.1em' }}>- 宿泊予約 -</p>
          <div className="mb-8 md:mb-12 max-w-2xl mx-auto bg-[#FEFDFC] rounded-lg shadow p-4 md:p-6 text-center text-sm md:text-lg font-semibold text-gray-800" style={{ border: '2px solid #bfae8a' }}>
            <div className="font-mono mb-2">【宿泊料金(素泊まり)】</div>
            <div className="mb-1">
              <span className="text-gray-800 font-bold text-sm md:text-base">大人：9,000円（税込9,900円）／ 1泊</span>
            </div>
            <div className="mb-1">
              <span className="text-gray-800 font-bold text-sm md:text-base">子供：4,500円（税込4,950円）／ 1泊</span>
            </div>
            <div className="mb-1">
              <span className="text-gray-800 font-bold text-sm md:text-base">貸切(定員5名)：40,000円（税込44,000円）／ 1泊</span>
            </div>
            {/* スマホ用注意書き */}
            <div className="block md:hidden mt-4 text-xs text-gray-700">
              ※現在は、素泊まりのみのご案内となります。<br />
              ※別途、宿泊税を頂戴しております。（詳細は<a href="https://hokkaido-shukuhakuzei.pref.hokkaido.lg.jp/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">こちら</a>）<br />
              ※10月～4月の間は、暖房費としてお一人様1泊につき<br />
              500円(税込550円)を頂戴しております。<br />
              ※村民割引あり(詳細はお問い合わせください)
            </div>
            {/* PC用注意書き */}
            <div className="hidden md:block mt-4 text-sm text-gray-700">
              ※現在は、素泊まりのみのご案内となります。<br />
              ※別途、宿泊税を頂戴しております。（詳細は<a href="https://hokkaido-shukuhakuzei.pref.hokkaido.lg.jp/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">こちら</a>）<br />
              ※10月～4月の間は、暖房費としてお一人様1泊につき500円(税込550円)を頂戴しております。<br />
              ※村民割引あり(詳細はお問い合わせください)
            </div>
          </div>

          <div className="mb-8 md:mb-12 max-w-2xl mx-auto bg-[#FEFDFC] rounded-lg shadow p-4 md:p-6 text-center text-sm md:text-lg font-semibold text-gray-800" style={{ border: '2px solid #bfae8a' }}>
            <div className="font-mono mb-2">【夏季宿泊料金(6月1日～9月30日)】</div>
            <div className="mb-1">
              <span className="text-gray-800 font-bold text-sm md:text-base">1室1名様ご利用時</span>
            </div>
            <div className="mb-1">
              <span className="text-gray-800 font-bold text-sm md:text-base">12,000円（税込13,200円）／ 1泊</span>
            </div>
            {/* スマホ用注意書き */}
            <div className="block md:hidden mt-4 text-xs text-gray-700">
              ※1室2～3名様ご利用時、または貸切ご利用時の料金に変更はございません。<br />
              ※村民割引あり(詳細はお問い合わせください)
            </div>
            {/* PC用注意書き */}
            <div className="hidden md:block mt-4 text-sm text-gray-700">
              ※1室2～3名様ご利用時、または貸切ご利用時の料金に変更はございません。<br />
              ※村民割引あり(詳細はお問い合わせください)
            </div>
          </div>

          <div className="flex justify-center text-sm md:text-lg mb-4 md:mb-6">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeEW9wCoj_N2BAcs8kjP5FKX0ocBwN8FO1XNB08Y3cgiweCpQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="w-40 md:w-56 h-10 md:h-12 bg-[#BFAE8A] text-[#222] font-bold rounded-none shadow hover:opacity-80 transition text-sm md:text-lg flex items-center justify-center"
            >
              ご予約はこちらから
            </a>
          </div>

          <div className="max-w-4xl mx-auto text-center mb-4 md:mb-6">
            <p className="text-xs md:text-sm text-gray-700 mb-1">
              下部の空室状況カレンダーをご確認の上、ご予約にお進みください。<br />
            </p>
            <p className="text-xs md:text-sm font-bold text-red-500 mb-10 md:mb-20">
              ※当日のご予約につきましては、お電話またはメールにてお問い合わせください。<br />
            </p>
            <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ letterSpacing: '0.08em' }}>空室状況カレンダー</h2>
            <p className="text-xs md:text-sm text-gray-700">
              ×：満室　　　△：一部空室あり
            </p>
            <p className="text-xs md:text-sm text-gray-700 mt-3">
            クリックすると空室詳細をご確認いただけます。<br />
              「 × 」や「 △ 」の記載のない日は全室ご予約可能です。
            </p>
          </div>
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-2 md:p-4">
            <iframe
              src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FTokyo&showPrint=0&showTitle=0&showTz=0&showCalendars=0&showTabs=0&src=YTkwZTA4MTAzOTVlNTNmMGU2YjkxMmM5YzJjYjczYzU5ZTJkNGZhM2ZkM2I4Nzg2NDA2ZTk5ODU3YWVjYTU1YkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%237cb342"
              style={{ borderWidth: 0 }}
              className="mx-auto w-[95%] md:w-full h-[360px] md:h-[600px]"
              frameBorder="0"
              scrolling="no"
              title="空室確認カレンダー"
            />
          </div>

          <div className="flex justify-center mt-10 md:mt-12">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeEW9wCoj_N2BAcs8kjP5FKX0ocBwN8FO1XNB08Y3cgiweCpQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="w-40 md:w-56 h-10 md:h-12 bg-[#BFAE8A] text-[#222] font-bold rounded-none shadow hover:opacity-80 transition text-sm md:text-lg flex items-center justify-center"
            >
              ご予約はこちらから
            </a>
          </div>
        </div>
      </div>
    </FadeTransitionWrapper>
  )
}
  