"use client";

import Image from "next/image";
import { useState } from "react";
import '../globals.css';
import FadeTransitionWrapper from '../../components/FadeTransitionWrapper';

// 画像ファイル名リスト（public/images/）
const imageFiles = [
  "s_fuukei23.jpg","s_fuukei17.jpg","s_fuukei28.jpg","s_fuukei1.jpg","s_fuukei5.jpg","s_fuukei6.jpg","s_fuukei20.jpg","s_fuukei3.jpg","s_fuukei14.jpg","s_fuukei2.jpg","s_fuukei22.jpg","s_fuukei11.jpg","s_fuukei13.jpg","s_fuukei10.jpg","s_fuukei9.jpg","s_fuukei21.jpg","s_fuukei18.jpg","s_fuukei19.jpg","s_fuukei24.jpg","s_fuukei25.jpg","s_fuukei26.jpg","s_fuukei15.jpg","s_fuukei29.jpg","s_fuukei30.jpeg",
  "s_doubutu1.jpg","s_doubutu12.jpg","s_doubutu2.jpg","s_doubutu14.jpg","s_doubutu18.jpg","s_doubutu19.jpg","s_doubutu4.jpg","s_doubutu7.jpg","s_doubutu15.jpg","s_doubutu8.jpg","s_doubutu5.jpg","s_doubutu6.jpg","s_doubutu9.jpg","s_doubutu10.jpg","s_doubutu11.jpg","s_doubutu13.jpg","s_doubutu16.jpg","s_doubutu20.jpeg"
];

export default function GalleryPage() {
  const [modalImg, setModalImg] = useState<string|null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // モーダルを開く
  const openModal = (img: string) => {
    setModalImg(img);
    setModalVisible(false);
    setTimeout(() => setModalVisible(true), 10); // 10ms遅延でフェードイン
  };
  // モーダルを閉じる
  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setModalImg(null), 300); // フェードアウト後に非表示
  };

  return (
    <FadeTransitionWrapper>
      <div className="min-h-screen pt-16 pb-24 md:py-[120px] bg-[#F5EEDC]">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-center" style={{letterSpacing:'0.1em'}}>Gallery</h1>
          <div className="text-xs md:text-base text-center mb-6 md:mb-12" style={{letterSpacing:'0.1em'}}>- 猿払村の風景 -</div>
          <p className="text-xs md:text-base text-center mb-2 md:mb-4 text-gray-600">※画像をクリックまたはタップで拡大します</p>
          {/* PC版: グリッドで大きく表示 */}
          <div className="hidden md:grid grid-cols-4 gap-4 mb-12">
            {imageFiles.map((file, i) => (
              <div key={file} className="relative aspect-[3/2] overflow-hidden rounded shadow hover:opacity-80 transition cursor-pointer">
                <Image src={`/images/${file}`} alt={file} fill className="object-cover" onClick={()=>openModal(`/images/${file}`)} />
              </div>
            ))}
          </div>
          {/* スマホ版: サムネイル並べてタップで拡大 */}
          <div className="grid grid-cols-3 gap-2 md:hidden">
            {imageFiles.map((file, i) => (
              <div key={file} className="relative aspect-[3/2] overflow-hidden rounded shadow cursor-pointer" onClick={()=>openModal(`/images/${file}`)}>
                <Image src={`/images/${file}`} alt={file} fill className="object-cover" />
              </div>
            ))}
          </div>
          {/* モーダル拡大表示（スマホ用） */}
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
        <div className="text-center text-xs md:text-base text-gray-500 mt-10" style={{letterSpacing:'0.1em'}}>
          写真提供：SARUFUTSU-LABO　新家拓朗
        </div>
        <div className="text-center mt-2">
          <a
            href="https://saruphoto.base.ec"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 underline hover:text-gray-800 text-xs md:text-base"
          >
            @https://saruphoto.base.ec
          </a>
        </div>
        <div className="text-center text-xs md:text-base text-gray-500 mt-8" style={{letterSpacing:'0.1em'}}>
          写真の無断転載・二次利用を固く禁じます。
        </div>
      </div>
    </FadeTransitionWrapper>
  );
} 