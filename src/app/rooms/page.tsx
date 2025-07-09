'use client';

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import FadeTransitionWrapper from '../../components/FadeTransitionWrapper'
import { useState } from 'react';

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
  const [modalImg, setModalImg] = useState<string|null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // モーダルを開く
  const openModal = (img: string) => {
    setModalImg(img);
    setModalVisible(false);
    setTimeout(() => setModalVisible(true), 10);
  };
  // モーダルを閉じる
  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setModalImg(null), 300);
  };

  return (
    <FadeTransitionWrapper>
      <div className="min-h-screen pt-16 pb-24 md:py-[120px]" style={{background:'#F5EEDC'}}>
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-center" style={{letterSpacing:'0.1em'}}>Rooms</h1>
          <p className="text-xs md:text-base text-center mb-8 md:mb-12" style={{letterSpacing:'0.1em'}}>- お部屋 -</p>
          <div className="mb-8 md:mb-12 max-w-2xl mx-auto bg-[#FEFDFC] rounded-lg shadow p-4 md:p-6 text-center text-sm md:text-lg font-semibold text-gray-800" style={{border: '2px solid #bfae8a'}}>
            <div className="mb-4">
              <span className="text-red-600 font-bold text-base md:text-2xl tracking-widest font-mono" style={{letterSpacing:'0.1em'}}>【7月限定オープニングセール開催中！】</span><br />
              <span className="text-red-600 text-xs md:text-ml tracking-widest font-mono" style={{letterSpacing:'0.1em'}}>さるふつbaseのオープンを記念して、<br />7月のご宿泊を特別セール価格でご案内いたします。</span>
            </div>
            <div className="mb-2">【宿泊料金】</div>
            <div className="mb-1">
              <span className="line-through text-gray-400 mr-2">大人：9,000円（税込9,900円）/ 1泊</span><br />
              <span className="text-red-600 font-extrabold text-base md:text-lg font-mono">大人：7,000円（税込7,700円）／ 1泊</span>
            </div>
            <div className="mb-1">
              <span className="line-through text-gray-400 mr-2">子供：4,500円（税込4,950円）／ 1泊</span><br />
              <span className="text-red-600 font-extrabold text-base md:text-lg font-mono">子供：3,500円（税込3,850円）／ 1泊</span>
            </div>
            <div className="mb-1">
              <span className="line-through text-gray-400 mr-2">貸切(定員5名)：40,000円（税込44,000円）／ 1泊</span><br />
              <span className="text-red-600 font-extrabold text-base md:text-lg font-mono">貸切(定員5名)：35,000円（税込38,500円）／ 1泊</span>
            </div>
            {/* スマホ用注意書き */}
            <div className="block md:hidden mt-4 text-xs text-gray-700">
              ※10月～5月の間は、暖房費としてお一人様1泊につき<br />
              500円(税込550円)を頂戴しております。<br />
              ※村民割引あり(詳細はお問い合わせください)
            </div>
            {/* PC用注意書き */}
            <div className="hidden md:block mt-4 text-sm text-gray-700">
              ※10月～5月の間は、暖房費としてお一人様1泊につき500円(税込550円)を頂戴しております。<br />
              ※村民割引あり(詳細はお問い合わせください)
            </div>
          </div>
          <div className="flex flex-col gap-12 md:gap-24">
            {/* Room1 */}
            <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-8">
              {/* 画像 */}
              <div className="md:w-1/2 w-full h-[300px] md:h-[340px] relative rounded-lg overflow-hidden shadow-lg">
                <Image src="/images/room1_1.jpg" alt="Room1" fill className="object-cover" />
              </div>
              {/* 情報 */}
              <div className="md:w-1/2 w-full flex flex-col justify-center">
                <hr className="mb-2 md:my-4" style={{borderColor:'#D9CBB0'}} />
                <div className="text-base md:text-2xl font-bold mb-1 md:mb-2">Room01</div>
                <div className="mb-1 md:mb-2 text-xs md:text-sm tracking-widest font-bold text-gray-700 md:mb-4">やわらかな光が差し込む、ナチュラルで温かな部屋。</div>
                <div className="flex flex-row gap-4 md:gap-8 mb-1 md:mb-2 text-xs md:text-sm">
                  <div><span className="font-bold">定員人数</span><br />最大3名</div>
                  <div><span className="font-bold">部屋タイプ</span><br />個室／禁煙</div>
                </div>
                <hr className="mt-2 md:my-4" style={{borderColor:'#D9CBB0'}} />
                <Link href="/rooms/room1">
                  <button className="more-btn mt-4 md:mt-6 w-40 md:w-56 h-10 md:h-12 bg-[#BFAE8A] text-[#222] font-bold rounded-none shadow hover:opacity-80 transition text-sm md:text-lg flex items-center justify-center mx-auto md:mx-0">
                    <span className="more-btn-text tracking-widest mr-2 md:mr-4">MORE</span>
                    <span className="inline-block w-5 h-5 md:w-6 md:h-6"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  </button>
                </Link>
              </div>
            </div>
            {/* Room2 */}
            <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-8">
              {/* 画像 */}
              <div className="md:w-1/2 w-full h-[300px] md:h-[340px] relative rounded-lg overflow-hidden shadow-lg">
                <Image src="/images/room2_8.jpg" alt="Room2" fill className="object-cover" />
              </div>
              {/* 情報 */}
              <div className="md:w-1/2 w-full flex flex-col justify-center">
                <hr className="mb-2 md:my-4" style={{borderColor:'#D9CBB0'}} />
                <div className="text-base md:text-2xl font-bold mb-1 md:mb-2">Room02</div>
                <div className="mb-1 md:mb-2 text-xs md:text-sm tracking-widest font-bold text-gray-700 md:mb-4">グレーと木の質感が調和する、落ち着いたモダン空間。</div>
                <div className="flex flex-row gap-4 md:gap-8 mb-1 md:mb-2 text-xs md:text-sm">
                  <div><span className="font-bold">定員人数</span><br />最大2名</div>
                  <div><span className="font-bold">部屋タイプ</span><br />個室／禁煙</div>
                </div>
                <hr className="mt-2 md:my-4" style={{borderColor:'#D9CBB0'}} />
                <Link href="/rooms/room2">
                  <button className="more-btn mt-4 md:mt-6 w-40 md:w-56 h-10 md:h-12 bg-[#BFAE8A] text-[#222] font-bold rounded-none shadow hover:opacity-80 transition text-sm md:text-lg flex items-center justify-center mx-auto md:mx-0">
                    <span className="more-btn-text tracking-widest mr-2 md:mr-4">MORE</span>
                    <span className="inline-block w-5 h-5 md:w-6 md:h-6"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  </button>
                </Link>
              </div>
            </div>
            {/* Facilities セクション追加 */}
            <section className="mt-16">
              <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-center" style={{letterSpacing:'0.1em'}}>Facilities</h2>
              <p className="text-xs md:text-base text-center mb-8 md:mb-12" style={{letterSpacing:'0.1em'}}>- 設備 -</p>
              <p className="text-xs md:text-sm text-center mb-2 md:mb-4 text-gray-600">※画像をクリックまたはタップで拡大します</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* リビングスペース */}
                <div className="bg-[#FEFDFC] rounded-lg shadow p-4 flex flex-col items-center h-full min-h-[320px] justify-between cursor-pointer" onClick={()=>openModal('/images/2Fspace1.jpg')}>
                  <div className="w-full h-48 mb-4 relative rounded overflow-hidden">
                    <Image src="/images/2Fspace1.jpg" alt="リビングスペース" fill className="object-cover" />
                  </div>
                  <div className="font-bold text-lg md:text-xl mb-2">リビングスペース</div>
                  <div className="text-xs md:text-sm text-gray-700 text-center min-h-[40px] flex items-center justify-center">
                    宿泊者だけが使えるリビングスペース。<br />
                    ひとりでのんびり過ごすもよし、<br />
                    他のゲストとの交流を楽しむもよし。<br />
                    思い思いの時間を過ごせる空間です。
                  </div>
                </div>
                {/* キッチン */}
                <div className="bg-[#FEFDFC] rounded-lg shadow p-4 flex flex-col items-center h-full min-h-[320px] cursor-pointer" onClick={()=>openModal('/images/kitchen2.jpg')}>
                  <div className="w-full h-48 mb-4 relative rounded overflow-hidden">
                    <Image src="/images/kitchen2.jpg" alt="キッチン" fill className="object-cover" />
                  </div>
                  <div className="font-bold text-lg md:text-xl mb-2">キッチン</div>
                  <div className="text-xs md:text-sm text-gray-700 text-center min-h-[40px] flex items-center justify-center">
                    IHコンロとシンク付きのキッチン。<br />
                    電子レンジ・冷蔵庫・ケトルのほか、<br />
                    基本的な調理器具や食器、カトラリーなども<br />
                    ひと通り揃っています。
                  </div>
                </div>
                {/* トイレ */}
                <div className="bg-[#FEFDFC] rounded-lg shadow p-4 flex flex-col items-center h-full min-h-[320px] cursor-pointer" onClick={()=>openModal('/images/toilet.jpg')}>
                  <div className="w-full h-48 mb-4 relative rounded overflow-hidden">
                    <Image src="/images/toilet.jpg" alt="トイレ" fill className="object-cover" />
                  </div>
                  <div className="font-bold text-lg md:text-xl mb-2">トイレ</div>
                  <div className="text-xs md:text-sm text-gray-700 text-center min-h-[40px] flex items-center justify-center">
                    トイレは1階・2階の両方にございます。<br />
                    どちらもウォシュレット付きです。<br />
                    ※2階のトイレは宿泊者専用です。
                  </div>
                </div>
                {/* 洗面所 */}
                <div className="bg-[#FEFDFC] rounded-lg shadow p-4 flex flex-col items-center h-full min-h-[320px] cursor-pointer" onClick={()=>openModal('/images/dress_1.jpg')}>
                  <div className="w-full h-48 mb-4 relative rounded overflow-hidden">
                    <Image src="/images/dress_1.jpg" alt="洗面所" fill className="object-cover" />
                  </div>
                  <div className="font-bold text-lg md:text-xl mb-2">洗面所</div>
                  <div className="text-xs md:text-sm text-gray-700 text-center min-h-[40px] flex items-center justify-center">
                    明るく使いやすい洗面スペース。<br />
                    パウダースペースも併設されています。<br />
                    朝夕などの混雑時は譲り合ってのご利用に<br />
                    ご協力をお願いいたします。
                  </div>
                </div>
                {/* バスルーム */}
                <div className="bg-[#FEFDFC] rounded-lg shadow p-4 flex flex-col items-center h-full min-h-[320px] cursor-pointer" onClick={()=>openModal('/images/bath2.jpg')}>
                  <div className="w-full h-48 mb-4 relative rounded overflow-hidden">
                    <Image src="/images/bath2.jpg" alt="バスルーム" fill className="object-cover" />
                  </div>
                  <div className="font-bold text-lg md:text-xl mb-2">バスルーム</div>
                  <div className="text-xs md:text-sm text-gray-700 text-center min-h-[40px] flex items-center justify-center">
                    シャンプー・リンス・ボディソープ完備の<br />
                    ゆったりとしたバスルーム。<br />
                    ゆっくり湯船に浸かって、<br />
                    くつろぎの時間をお楽しみください。
                  </div>
                </div>
                {/* サービス枠 */}
                <div className="bg-[#FEFDFC] rounded-lg shadow p-4 flex flex-col items-center h-full min-h-[320px] justify-center">
                  <div className="text-lg md:text-xl font-bold mb-8 text-center">サービス(一例)</div>
                  <div className="w-full flex flex-col items-center">
                    <div className="grid grid-cols-3 gap-4 w-full justify-items-center">
                      {/* 1. シャンプー/リンス */}
                      <div className="flex flex-col items-center">
                        <Image src="/images/shampoo.png" alt="シャンプー/リンス" width={32} height={32} className="mb-1" />
                        <span className="text-xs text-gray-700">シャンプー<br />・リンス</span>
                      </div>
                      {/* 2. ボディソープ */}
                      <div className="flex flex-col items-center">
                        <Image src="/images/bodysoap.png" alt="ボディソープ" width={32} height={32} className="mb-1" />
                        <span className="text-xs text-gray-700">ボディソープ</span>
                      </div>
                      {/* 3. ハンドソープ */}
                      <div className="flex flex-col items-center">
                        <Image src="/images/handsoap.png" alt="ハンドソープ" width={32} height={32} className="mb-1" />
                        <span className="text-xs text-gray-700">ハンドソープ</span>
                      </div>
                      {/* 4. タオル */}
                      <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256" className="mb-1"><path d="M200,24H72A24,24,0,0,0,48,48V216a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V48a8,8,0,0,1,16,0V152a8,8,0,0,0,16,0V48A24,24,0,0,0,200,24ZM72,40H177.37A23.84,23.84,0,0,0,176,48V184H64V48A8,8,0,0,1,72,40ZM64,216V200H176v16Z"></path></svg>
                        <span className="text-xs text-gray-700">タオル</span>
                      </div>
                      {/* 5. 歯ブラシ */}
                      <div className="flex flex-col items-center">
                        <Image src="/images/toothbrush.png" alt="歯ブラシ" width={32} height={32} className="mb-1" />
                        <span className="text-xs text-gray-700">歯ブラシ</span>
                      </div>
                      {/* 6. ドライヤー */}
                      <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256" className="mb-1"><path d="M200,88a32,32,0,1,1-32,32A32,32,0,0,1,200,88Zm-32,16a16,16,0,1,0,16-16A16,16,0,0,0,168,104Zm9.42,102.62L209,137.07A64,64,0,0,0,168,24a8.4,8.4,0,0,0-1.32.11L29.37,47A16,16,0,0,0,16,62.78v50.44A16,16,0,0,0,29.37,129L128,145.44V200a16,16,0,0,0,16,16,40,40,0,0,0,40,40h16a8,8,0,0,0,0-16H184a24,24,0,0,1-24-24h2.85A16,16,0,0,0,177.42,206.62ZM32,62.78,168.64,40a48,48,0,0,1,0,96L32,113.23Zm134.68,89.11A8.4,8.4,0,0,0,168,152a63.9,63.9,0,0,0,17.82-2.54l-23,50.54H144V148.11Z"></path></svg>
                        <span className="text-xs text-gray-700">ドライヤー</span>
                      </div>
                      {/* 7. 荷物預かり */}
                      <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256" className="mb-1"><path d="M104,88v96a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Zm24-8a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V88A8,8,0,0,0,128,80Zm32,0a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V88A8,8,0,0,0,160,80Zm48-16V208a16,16,0,0,1-16,16H176v16a8,8,0,0,1-16,0V224H96v16a8,8,0,0,1-16,0V224H64a16,16,0,0,1-16-16V64A16,16,0,0,1,64,48H88V24A24,24,0,0,1,112,0h32a24,24,0,0,1,24,24V48h24A16,16,0,0,1,208,64ZM104,48h48V24a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8Zm88,160V64H64V208H192Z"></path></svg>
                        <span className="text-xs text-gray-700">荷物預かり</span>
                      </div>
                      {/* 8. 駐車場 */}
                      <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256" className="mb-1"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm8-136H104a8,8,0,0,0-8,8v80a8,8,0,0,0,16,0V152h24a36,36,0,0,0,0-72Zm0,56H112V96h24a20,20,0,0,1,0,40Z"></path></svg>
                        <span className="text-xs text-gray-700">駐車場</span>
                      </div>
                      {/* 9. Wi-Fi */}
                      <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256" className="mb-1"><path d="M140,204a12,12,0,1,1-12-12A12,12,0,0,1,140,204ZM237.08,87A172,172,0,0,0,18.92,87,8,8,0,0,0,29.08,99.37a156,156,0,0,1,197.84,0A8,8,0,0,0,237.08,87ZM205,122.77a124,124,0,0,0-153.94,0A8,8,0,0,0,61,135.31a108,108,0,0,1,134.06,0,8,8,0,0,0,11.24-1.3A8,8,0,0,0,205,122.77Zm-32.26,35.76a76.05,76.05,0,0,0-89.42,0,8,8,0,0,0,9.42,12.94,60,60,0,0,1,70.58,0,8,8,0,1,0,9.42-12.94Z"></path></svg>
                        <span className="text-xs text-gray-700">Wi-Fi</span>
                      </div>
                    </div>
                    <div className="text-xs font-bold mt-8 text-gray-600 text-center">その他サービスについてはお問い合わせください。</div>
                  </div>
                </div>
              </div>
            </section>
            {/* モーダル拡大表示（Galleryと同仕様） */}
            {modalImg && (
              <div
                className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300 ${modalVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={closeModal}
              >
                <button
                  className="absolute top-4 right-4 z-50 text-3xl md:text-4xl text-white"
                  onClick={closeModal}
                  aria-label="閉じる"
                >×</button>
                <div className="relative w-11/12 max-w-md aspect-[1/1] md:w-4/5 md:max-w-4xl md:h-4/5" onClick={e => e.stopPropagation()}>
                  <Image src={modalImg} alt="拡大画像" fill className="object-contain rounded" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FadeTransitionWrapper>
  )
} 