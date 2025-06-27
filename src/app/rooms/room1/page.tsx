'use client';

import Image from 'next/image';
import Link from 'next/link';
import '../../globals.css';
import { useState } from 'react';

export default function Room1TypePage() {
  const images = [
    { src: '/images/room1_1.jpg', alt: 'Room1 Main' },
    { src: '/images/room1_2.jpg', alt: 'Room1 View' },
    { src: '/images/room1_3.jpg', alt: 'Room1 Detail' },
    { src: '/images/room1_4.jpg', alt: 'Room1 Facility' },
    { src: '/images/room1_5.jpg', alt: 'Room1 Other' }
  ];
  const [currentImage, setCurrentImage] = useState(images[0]);

  const handleImageClick = (image) => {
    setCurrentImage(image);
  };

  return (
    <div className="min-h-screen py-[120px]" style={{background:'#F5EEDC'}}>
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12 text-center" style={{letterSpacing:'0.1em'}}>Room Type</h1>
        {/*<div className="text-center mb-2 text-xs tracking-widest font-bold text-gray-700">DORMITORY ROOMS</div>*/}
        <div className="text-center text-xl md:text-2xl font-bold mb-8">Room01</div>
        {/* メイン画像 */}
        <div className="w-full aspect-[3/2] relative mb-2 overflow-hidden">
          <Image 
            src={currentImage.src} 
            alt={currentImage.alt} 
            fill 
            className="object-cover rounded"
          />
        </div>
        {/* サムネイル画像群 */}
        <div className="flex flex-row gap-2 mb-8">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="w-1/5 aspect-[3/2] relative cursor-pointer transition-opacity hover:opacity-80"
              onClick={() => handleImageClick(image)}
            >
              <Image 
                src={image.src} 
                alt={`thumb${index + 1}`} 
                fill 
                className={`object-cover rounded ${currentImage.src === image.src ? 'ring-2 ring-[#BFAE8A]' : ''}`}
              />
            </div>
          ))}
        </div>
        {/* 詳細情報テーブル */}
        <div className="text-sm text-gray-700 mb-6">
            オレンジのアクセントクロスが明るく、温かみのある印象の個室タイプのお部屋です。<br />
            1名様からご利用いただけます。<br />
            ご就寝の際は、寝具一式（敷き布団・掛け布団・シーツ・枕）をご利用いただきます。<br /><br />  
            ※室内にはトイレ・バス・洗面台はございません。1階の共用スペースをご利用ください。<br />
            ※寝具一式の設置はセルフサービスとなっております。
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
          <div className=" font-bold">定員人数</div><div>最大3名</div>
          <div className=" font-bold">部屋タイプ</div><div>個室／禁煙</div>
        </div>
        <div className="border-t border-gray-200 my-4" style={{borderColor:'#D9CBB0'}}/>
        <div className="text-sm text-gray-700 mb-2 font-bold">設備</div>
        <div className="text-sm text-gray-700 mb-4">テーブル／Wi-Fi</div>
        <div className="border-t border-gray-200 my-4" style={{borderColor:'#D9CBB0'}}/>
        <div className="text-sm text-gray-700 mb-2 font-bold">アメニティ</div>
        <div className="text-sm text-gray-700 mb-2">バスタオル／フェイスタオル／歯ブラシ</div>
        <div className="text-sm text-gray-700 mb-[80px]">※連泊の場合、タオル類のみ1泊ごとに1人1枚ずつ追加します。</div>
        <div className="flex justify-center flex-col items-center gap-4">
          <Link href="/reservation">
            <button className="w-56 h-12 bg-[#BFAE8A] text-[#222] font-bold rounded-none shadow hover:opacity-80 transition text-lg flex items-center justify-center mb-2">
              予約する
            </button>
          </Link>
          <Link href="/rooms">
            <button className="w-56 h-12 bg-[#f5eedc] text-[#bfae8a] font-bold rounded-none shadow border-2 border-[#bfae8a] hover:opacity-80 transition text-lg flex items-center justify-center group">
              <span className="inline-block w-6 h-6 transform rotate-180"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#bfae8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              <span className="back-btn-text tracking-widest ml-4 group-hover:translate-x-[-8px] transition-transform">BACK</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 