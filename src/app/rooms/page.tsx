import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const rooms = [
  {
    id: 1,
    name: 'Room01',
    description: 'やわらかな光が差し込む、ナチュラルで温かな部屋。',
    price: '6,000円〜/名',
    capacity: '定員：3名',
    image: '/images/room1_1.jpg'
  },
  {
    id: 2,
    name: 'Room02',
    description: 'グレーと木の質感が調和する、落ち着いたモダン空間。',
    price: '6,000円〜/名',
    capacity: '定員：2名',
    image: '/images/room2_1.jpg'
  },
]

export default function RoomsPage() {
  return (
    <div className="min-h-screen py-[120px]" style={{background:'#F5EEDC'}}>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4 text-center" style={{letterSpacing:'0.1em'}}>Rooms</h1>
        <p className="text-ml text-center mb-12" style={{letterSpacing:'0.1em'}}>- お部屋 -</p>
        <div className="mb-12 max-w-2xl mx-auto bg-[#FEFDFC] rounded-lg shadow p-6 text-center text-lg font-semibold text-gray-800" style={{border: '2px solid #bfae8a'}}>
          <div className="mb-2">【宿泊料金】</div>
          <div>大人：9,000円（税込9,900円）／ 1泊</div>
          <div>子供：4,500円（税込4,950円）／ 1泊</div>
          <div>貸切(定員5名)：40,000円（税込44,000円）／ 1泊</div>
          <div className="mt-4 text-sm text-gray-700">
            ※上記定員は添い寝のお子様も含む人数です。<br />
            ※貸切(定員5名)は、暖房費としてお一人様1泊につき500円(税込550円)を頂戴しております。<br />
            ※村民割引あり(詳細はお問い合わせください)
          </div>
        </div>
        <div className="flex flex-col gap-24">
          {/* Room1 */}
          <div className="flex flex-col md:flex-row items-stretch gap-8">
            {/* 画像 */}
            <div className="md:w-1/2 w-full h-[320px] md:h-[340px] relative rounded-lg overflow-hidden shadow-lg">
              <Image src="/images/room1_1.jpg" alt="Room1" fill className="object-cover" />
            </div>
            {/* 情報 */}
            <div className="md:w-1/2 w-full flex flex-col justify-center">
              <hr className="my-4" style={{borderColor:'#D9CBB0'}} />
              <div className="text-xl md:text-2xl font-bold mb-2">Room01</div>
              <div className="mb-2 text-sm tracking-widest font-bold text-gray-700 mb-4">やわらかな光が差し込む、ナチュラルで温かな部屋。</div>
              <div className="flex flex-row gap-8 mb-2 text-sm">
                <div><span className="font-bold">定員人数</span><br />最大3名</div>
                <div><span className="font-bold">部屋タイプ</span><br />個室／禁煙</div>
              </div>
              <hr className="my-4" style={{borderColor:'#D9CBB0'}} />
              <Link href="/rooms/room1">
                <button className="more-btn mt-6 w-56 h-12 bg-[#BFAE8A] text-[#222] font-bold rounded-none shadow hover:opacity-80 transition text-lg flex items-center justify-center">
                  <span className="more-btn-text tracking-widest mr-4">MORE</span>
                  <span className="inline-block w-6 h-6"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
              </Link>
            </div>
          </div>
          {/* Room2 */}
          <div className="flex flex-col md:flex-row items-stretch gap-8">
            {/* 画像 */}
            <div className="md:w-1/2 w-full h-[320px] md:h-[340px] relative rounded-lg overflow-hidden shadow-lg">
              <Image src="/images/room2_1.jpg" alt="Room2" fill className="object-cover" />
            </div>
            {/* 情報 */}
            <div className="md:w-1/2 w-full flex flex-col justify-center">
              <hr className="my-4" style={{borderColor:'#D9CBB0'}} />
              <div className="text-xl md:text-2xl font-bold mb-2">Room02</div>
              <div className="mb-2 text-sm tracking-widest font-bold text-gray-700 mb-4">グレーと木の質感が調和する、落ち着いたモダン空間。</div>
              <div className="flex flex-row gap-8 mb-2 text-sm">
                <div><span className="font-bold">定員人数</span><br />最大2名</div>
                <div><span className="font-bold">部屋タイプ</span><br />個室／禁煙</div>
              </div>
              <hr className="my-4" style={{borderColor:'#D9CBB0'}} />
              <Link href="/rooms/room2">
                <button className="more-btn mt-6 w-56 h-12 bg-[#BFAE8A] text-[#222] font-bold rounded-none shadow hover:opacity-80 transition text-lg flex items-center justify-center">
                  <span className="more-btn-text tracking-widest mr-4">MORE</span>
                  <span className="inline-block w-6 h-6"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 