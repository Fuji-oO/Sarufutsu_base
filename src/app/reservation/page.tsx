'use client'

import Image from 'next/image'
import { FaChild, FaUser } from 'react-icons/fa'
import FadeTransitionWrapper from '../../components/FadeTransitionWrapper'

type PriceIconType = 'single' | 'group' | 'none'

type PriceSection = {
  label: string
  image: string
  iconType: PriceIconType
  content: React.ReactNode
}

const priceSections: PriceSection[] = [
  {
    label: '1室1名',
    image: '/images/room1_1.jpg',
    iconType: 'single',
    content: (
      <p className="text-[#332211] font-bold text-xs md:text-lg leading-tight">
        ¥13,200<span className="text-[10px] md:text-sm font-semibold">(税込)</span>
      </p>
    ),
  },
  {
    label: '1室2~3名',
    image: '/images/room2_8.jpg',
    iconType: 'group',
    content: (
      <div className="text-[#332211] text-left w-full max-w-[142px] md:max-w-[170px] mx-auto">
        <div className="mb-2 md:mb-3">
          <p className="text-[11px] md:text-sm font-bold leading-snug">・大人 1名</p>
          <p className="font-bold text-[11px] md:text-sm leading-snug pl-3 md:pl-10">
          ¥9,900<span className="font-semibold">(税込)</span>
          </p>
        </div>
        <div>
          <p className="text-[11px] md:text-sm font-bold leading-snug">・子供 1名</p>
          <p className="font-bold text-[11px] md:text-sm leading-snug pl-3 md:pl-10">
          ¥4,950<span className="font-semibold">(税込)</span>
          </p>
        </div>
      </div>
    ),
  },
  {
    label: '一棟貸切(定員5名)',
    image: '/images/S__36700181_0.jpg',
    iconType: 'none',
    content: (
      <p className="text-[#332211] font-bold text-xs md:text-lg leading-tight">
        ¥44,000<span className="text-[10px] md:text-sm font-semibold">(税込)</span>
      </p>
    ),
  },
]

function PriceIconOverlay({ type }: { type: PriceIconType }) {
  //if (type === 'none') return null

  if (type === 'none') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/25">
      </div>
    )
  }

  if (type === 'single') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/25">
        <FaUser className="text-white text-2xl md:text-5xl drop-shadow" aria-hidden />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-1 md:gap-1.5 bg-black/25">
      <FaUser className="text-white text-lg md:text-4xl drop-shadow" aria-hidden />
      <FaUser className="text-white text-lg md:text-4xl drop-shadow" aria-hidden />
      <FaChild className="text-white text-base md:text-3xl drop-shadow" aria-hidden />
    </div>
  )
}

export default function ReservationPage() {
  return (
    <FadeTransitionWrapper>
      <div className="min-h-screen pt-16 pb-24 md:py-[120px]" style={{ background: '#F5EEDC' }}>
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-center" style={{ letterSpacing: '0.1em' }}>Stay Reservation</h1>
          <p className="text-xs md:text-base text-center mb-8 md:mb-12" style={{ letterSpacing: '0.1em' }}>- 宿泊予約 -</p>
          <div className="mb-8 md:mb-12 max-w-4xl mx-auto bg-white rounded-lg shadow p-5 md:p-8 text-[#332211]" style={{ border: '2px solid #bfae8a' }}>
            <div className="flex items-center gap-3 mb-1 md:mb-5">
              <span className="flex-1 border-t border-dotted border-[#bfae8a]" />
              <h2 className="text-sm md:text-base font-bold whitespace-nowrap tracking-wide">宿泊料金(1泊)</h2>
              <span className="flex-1 border-t border-dotted border-[#bfae8a]" />
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-0">
              {priceSections.map((section, index) => (
                <section
                  key={section.label}
                  className={`flex flex-col items-center px-1 md:px-4 ${
                    index < priceSections.length - 1 ? 'border-r border-[#e5dcc8]' : ''
                  }`}
                >
                  <span className="bg-[#F5F0E1] text-[9px] md:text-xs font-bold px-2 md:px-4 py-1 md:py-1.5 rounded-full text-center mb-3 md:mb-4 leading-tight">
                    {section.label}
                  </span>
                  <div className="relative w-full max-w-[142px] md:max-w-[170px] aspect-square overflow-hidden rounded-sm mb-3 md:mb-4 mx-auto">
                    <Image
                      src={section.image}
                      alt={section.label}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 88px, 112px"
                    />
                    <PriceIconOverlay type={section.iconType} />
                  </div>
                  <div
                    className={`w-full ${
                      section.iconType === 'group' ? '' : 'text-center px-1'
                    }`}
                  >
                    {section.content}
                  </div>
                </section>
              ))}
            </div>

            {/* スマホ用注意書き */}
            <div className="block md:hidden mt-8 text-xs text-gray-700 text-center">
              ※現在は、素泊まりのみのご案内となります。<br />
              ※別途、宿泊税を頂戴しております。（詳細は<a href="https://hokkaido-shukuhakuzei.pref.hokkaido.lg.jp/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">こちら</a>）<br />
              ※10月～4月の間は、暖房費としてお一人様1泊につき<br />
              500円(税込550円)を頂戴しております。<br />
              ※村民割引あり(詳細はお問い合わせください)
            </div>
            {/* PC用注意書き */}
            <div className="hidden md:block mt-8 text-sm text-gray-700 text-center">
              ※現在は、素泊まりのみのご案内となります。<br />
              ※別途、宿泊税を頂戴しております。（詳細は<a href="https://hokkaido-shukuhakuzei.pref.hokkaido.lg.jp/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">こちら</a>）<br />
              ※10月～4月の間は、暖房費としてお一人様1泊につき500円(税込550円)を頂戴しております。<br />
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
  