'use client'
import Image from 'next/image'
import Link from 'next/link'
import Slideshow from '../components/Slideshow'
import { useEffect, useRef, useState } from 'react'
import InstagramSlider from '../components/InstagramSlider'
import { FaArrowUp } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'

export default function Home() {
  // --- 追加: フェードイン用ロジック ---
  const conceptRef = useRef(null);
  const [showImg1, setShowImg1] = useState(false);
  const [showImg3, setShowImg3] = useState(false);
  const [showImg2, setShowImg2] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showRoomsText, setShowRoomsText] = useState(false);
  const [showRoom1, setShowRoom1] = useState(false);
  const [showRoom2, setShowRoom2] = useState(false);
  const roomsRef = useRef(null);
  const communityRef = useRef(null);
  const [showCommunityText, setShowCommunityText] = useState(false);
  const [showCommunityImgLeft, setShowCommunityImgLeft] = useState(false);
  const [showCommunityImgRight, setShowCommunityImgRight] = useState(false);
  const [showInstagramText, setShowInstagramText] = useState(false);
  const instagramRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const heroRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowText(true);
          setTimeout(() => {
            setShowImg1(true); // 画像①：文字表示直後
            setTimeout(() => setShowImg3(true), 500); // 画像③：0.4秒後
            setTimeout(() => setShowImg2(true), 1000); // 画像②：0.8秒後
          }, 600); // テキスト表示から0.6秒後に画像フェードイン開始
        }
      },
      { threshold: 0.2 }
    );
    if (conceptRef.current) {
      observer.observe(conceptRef.current);
    }
    return () => {
      if (conceptRef.current) observer.unobserve(conceptRef.current);
    };
  }, []);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowRoomsText(true);
          setTimeout(() => {
          setShowRoom1(true);
          setShowRoom2(true);
          }, 800); // テキスト表示から0.8秒後に客室紹介要素をフェードイン
        }
      },
      { threshold: 0.2 }
    );
    if (roomsRef.current) {
      observer.observe(roomsRef.current);
    }
    return () => {
      if (roomsRef.current) observer.unobserve(roomsRef.current);
    };
  }, []);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowCommunityText(true);
          setTimeout(() => {
            setShowCommunityImgLeft(true);
            setTimeout(() => setShowCommunityImgRight(true), 400); // 左画像0.4秒後に右画像
          }, 600); // テキスト表示から0.6秒後に左画像
        }
      },
      { threshold: 0.2 }
    );
    if (communityRef.current) {
      observer.observe(communityRef.current);
    }
    return () => {
      if (communityRef.current) observer.unobserve(communityRef.current);
    };
  }, []);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowInstagramText(true);
        }
      },
      { threshold: 0.2 }
    );
    if (instagramRef.current) {
      observer.observe(instagramRef.current);
    }
    return () => {
      if (instagramRef.current) observer.unobserve(instagramRef.current);
    };
  }, []);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          setShowScrollTop(!entries[0].isIntersecting);
        }
      },
      { threshold: 0.1 }
    );
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <div ref={heroRef} />
      <Slideshow />

      {/* コンセプトセクション */}
      <section ref={conceptRef} className="py-[120px] bg-base-section">
        <div className="container relative flex justify-center items-center min-h-[800px]">
          {/* IntersectionObserver用のref */}
          <div ref={conceptRef}></div>
          {/* 画像①：左端縦長（さらに左＆大きく） */}
          <div className={`absolute -left-20 bottom-[-180px] -translate-y-1/2 w-56 h-80 md:w-80 md:h-[550px] shadow-lg rounded-lg overflow-hidden bg-white z-10 transition-opacity duration-1000 fade-in${showImg1 ? ' show' : ''}`}>
            <Image
              src="/images/room_tate1.jpg"
              alt="画像①"
              fill
              className="object-cover"
            />
          </div>
          {/* 画像③：右下横長（右下＆大きく） */}
          <div className={`absolute right-[-110px] bottom-[520px] w-70 h-35 md:w-[400px] md:h-72 shadow-lg rounded-lg overflow-hidden bg-white z-10 transition-opacity duration-1000 fade-in${showImg3 ? ' show' : ''}`}>
            <Image
              src="/images/river1.png" 
              alt="画像③"
              fill
              className="object-cover"
            />
          </div>
          {/* 画像②：右下中央横長（さらに右下） */}
          <div className={`absolute right-[150px] bottom-[-70px] w-80 h-48 md:w-96 md:h-56 shadow-lg rounded-lg overflow-hidden bg-white z-10 transition-opacity duration-1000 fade-in${showImg2 ? ' show' : ''}`}>
            <Image
              src="/images/hamanasu1.png"
              alt="画像②"
              fill
              className="object-cover"
            />
          </div>
          {/* テキスト中央配置 */}
          <div className={`relative z-20 max-w-xl w-full mx-auto bg-transparent px-4 py-8 transition-opacity duration-1000 fade-in${showText ? ' show' : ''}`}>
            <h2 className="text-2xl" style={{fontFamily: 'Klee One, cursive'}}>- About -</h2>
            <h3 className="text-3xl text-center md:text-4xl font-bold mb-6 whitespace-nowrap flex justify-center items-center" style={{fontFamily: 'Klee One, cursive'}}>北の風がつなぐ、人と人の交差点。</h3>
            <p className="mb-4" style={{fontFamily: 'Klee One, cursive'}}>
              さるふつbaseは、北海道・猿払村の雄大な自然の中にある<br />
              1日1〜2組限定のゲストハウスです。
            </p>
            <p className="mb-4" style={{fontFamily: 'Klee One, cursive'}}>
              旅人と地域の人々をゆるやかにつなぐコミュニティスペースとしても<br />
              開かれており、出会いや発見が生まれる場になっています。  
            </p>
            <p className="mb-6" style={{fontFamily: 'Klee One, cursive'}}>
              この土地の風土や人とのふれあいを感じながら、<br />
              ほっと安らげる時間をお過ごしください。
            </p>
            <Link href="/about" className="text-lg font-semibold text-[#333] hover:text-[#111] block text-center mx-auto w-fit view-more-link" style={{fontFamily: 'Klee One, cursive'}}>
              View More →
            </Link>
          </div>
        </div>
      </section>

      {/* About→Rooms 区切り：中央盛り上がり（山型）波線 */}
      <div style={{lineHeight:0}} aria-hidden="true">
        <svg width="100%" height="80" viewBox="0 0 100 8" preserveAspectRatio="none" style={{display:'block',width:'100%',height:'80px'}}>
          <rect x="0" y="0" width="100" height="8" fill="#BFAE8A" />
          <path d="M0,4 Q25,0 50,4 Q75,8 100,4 L100,0 L0,0 Z" fill="#D9CBB0"/>
        </svg>
      </div>

      {/* Rooms Section */}
      <section className="py-[120px]" style={{background:'#BFAE8A'}}>
        <div className="container mx-auto px-4">
          <div ref={roomsRef}></div>
          <div className={`relative z-20 max-w-xl w-full mx-auto bg-transparent px-4 py-8 transition-opacity duration-1000 fade-in${showRoomsText ? ' show' : ''}`}>
            <h2 className="text-2xl text-center" style={{fontFamily: 'Klee One, cursive'}}>- Rooms -</h2>
            <h3 className="text-3xl text-center md:text-4xl font-bold mb-6 whitespace-nowrap flex justify-center items-center" style={{fontFamily: 'Klee One, cursive'}}>静けさにひたる、ちょっと特別な時間。</h3>
            <p className="mb-4" style={{fontFamily: 'Klee One, cursive'}}>
              さるふつbaseの客室は、<br />
              シンプルな中に、北国らしい落ち着きとぬくもりを感じられる空間です。
            </p>
            <p className="mb-4" style={{fontFamily: 'Klee One, cursive'}}>
              自然に包まれながら、日々のあわただしさを少しだけ手放して、<br />
              自分のペースで過ごす時間を楽しんでみてください。
            </p>
            <p className="mb-6" style={{fontFamily: 'Klee One, cursive'}}>
              1日1〜2組限定で、一棟まるごとの貸切もOK。<br />
              人々との交流も、プライベートな時間も、どちらも大切にできる場所です。
            </p>
            <Link href="/rooms" className="text-lg font-semibold text-[#333] hover:text-[#111] block text-center mx-auto w-fit view-more-link" style={{fontFamily: 'Klee One, cursive'}}>
              View More →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[120px] max-w-5xl mx-auto">
            <div className={`bg-[#F5EEDC] rounded-lg shadow-lg overflow-hidden transition-opacity duration-1000 fade-in${showRoom1 ? ' show' : ''}`}>
              <div className="relative w-full h-auto cursor-pointer" onClick={() => router.push('/rooms/room1')} tabIndex={0} role="button" aria-label="Room1詳細へ">
                <Image
                  src="/images/room1_1.jpg"
                  alt="Room01"
                  width={400}
                  height={240}
                  className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-xl font-bold mb-2" style={{fontFamily: 'Klee One, cursive'}}>Room01 (3名様用)</h3>
                <p className="text-gray-600" style={{fontFamily: 'Klee One, cursive'}}>やわらかな光が差し込む、ナチュラルで温かな部屋。</p>
              </div>
            </div>
            <div className={`bg-[#F5EEDC] rounded-lg shadow-lg overflow-hidden transition-opacity duration-1000 fade-in${showRoom2 ? ' show' : ''}`}>
              <div className="relative w-full h-auto cursor-pointer" onClick={() => router.push('/rooms/room2')} tabIndex={0} role="button" aria-label="Room2詳細へ">
                <Image
                  src="/images/room2_1.jpg"
                  alt="Room02"
                  width={400}
                  height={240}
                  className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-xl font-bold mb-2" style={{fontFamily: 'Klee One, cursive'}}>Room02 (2名様用)</h3>
                <p className="text-gray-600" style={{fontFamily: 'Klee One, cursive'}}>グレーと木の質感が調和する、落ち着いたモダン空間。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms→Community 区切り：中央凹み（谷型）波線 */}
      <div style={{lineHeight:0}} aria-hidden="true">
        <svg width="100%" height="80" viewBox="0 0 100 8" preserveAspectRatio="none" style={{display:'block',width:'100%',height:'80px'}}>
          <rect x="0" y="0" width="100" height="8" fill="#BFAE8A" />
          <path d="M0,4 Q25,8 50,4 Q75,0 100,4 L100,8 L0,8 Z" fill="#D9CBB0"/>
        </svg>
      </div>

      {/* CommunitySpaceセクション追加 */}
      <section className="py-[120px] bg-base-section">
        <div className="container flex justify-center items-center min-h-[600px]">
          <div ref={communityRef} className="flex flex-row items-center w-full max-w-7xl justify-center">
            {/* 左画像（任意サイズ） */}
            <div className={`flex-shrink-0 transition-opacity duration-1000 fade-in${showCommunityImgLeft ? ' show' : ''}`} style={{marginRight: '100px', marginTop: '250px'}}>
              <div style={{width: '280px', height: '340px', position: 'relative'}}>
                <Image
                  src="/images/1f_1.jpg"
                  alt="薪ストーブ"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
            {/* テキスト要素 幅544px固定・paddingなし */}
            <div className={`flex-shrink-0 transition-opacity duration-1000 fade-in${showCommunityText ? ' show' : ''}`} style={{width: '544px'}}>
              <div className="relative z-20 mx-auto bg-transparent">
                <h2 className="text-2xl" style={{fontFamily: 'Klee One, cursive'}}>- Community Space -</h2>
                <h3 className="text-3xl text-center md:text-4xl font-bold mb-6 whitespace-nowrap flex justify-center items-center" style={{fontFamily: 'Klee One, cursive'}}>つながりが広がる場所。</h3>
                <p className="mb-4" style={{fontFamily: 'Klee One, cursive'}}>
                  さるふつbaseのコミュニティスペースは、<br />
                  旅人も地域の人もふらっと立ち寄れる、気軽でオープンな空間です。  
                </p>
                <p className="mb-4" style={{fontFamily: 'Klee One, cursive'}}>
                  イベントやワークショップ、地元の人とのおしゃべりなどから、<br />
                  いろんな出会いや発見が生まれます。
                </p>
                <p className="mb-6" style={{fontFamily: 'Klee One, cursive'}}>
                  ここでのひとときが、旅の思い出や新しいご縁につながるかもしれません。
                </p>
                {/* <Link href="/about" className="text-lg font-semibold text-[#333] hover:text-[#111] block text-center mx-auto w-fit view-more-link" style={{fontFamily: 'Klee One, cursive'}}>
                  View More →
                </Link> */}
              </div>
            </div>
            {/* 右画像（任意サイズ） */}
            <div className={`flex-shrink-0 transition-opacity duration-1000 fade-in${showCommunityImgRight ? ' show' : ''}`} style={{marginLeft: '80px', marginBottom: '150px'}}>
              <div style={{width: '290px', height: '450px', position: 'relative'}}>
                <Image
                  src="/images/store1.jpg"
                  alt="店舗1"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community→Instagram 区切り：中央盛り上がり波線 */}
      <div style={{lineHeight:0}} aria-hidden="true">
        <svg width="100%" height="80" viewBox="0 0 100 8" preserveAspectRatio="none" style={{display:'block',width:'100%',height:'80px'}}>
          <rect x="0" y="0" width="100" height="8" fill="#BFAE8A" />
          <path d="M0,4 Q25,0 50,4 Q75,8 100,4 L100,0 L0,0 Z" fill="#D9CBB0"/>
        </svg>
      </div>

      {/* Instagramセクション */}
      <section className="py-[120px]" style={{background:'#BFAE8A'}}>
        <div ref={instagramRef} className={`relative z-20 max-w-xl w-full mx-auto bg-transparent px-4 py-8 transition-opacity duration-1000 fade-in${showInstagramText ? ' show' : ''}`}>
          <h2 className="text-4xl text-center font-bold mb-6 whitespace-nowrap" style={{fontFamily: 'Klee One, cursive'}}>Instagram</h2>
          <p className="mb-[50px]" style={{fontFamily: 'Klee One, cursive'}}>
            Instagramでは、さるふつbaseの日常やイベント情報を発信しています。<br />
            地域の風景や、ふらっと立ち寄った方との交流の様子など、<br />
            ありのままの"今"をお届けしています。ぜひのぞいてみてください。
          </p>
        </div>
        <div className={`transition-opacity duration-1000 fade-in${showInstagramText ? ' show' : ''}`}>
          <InstagramSlider profileUrl="https://www.instagram.com/sarufutsu_base?igsh=d3JjMmcwb3VkcjB0&utm_source=qr" />
        </div>
      </section>

      {/* トップへ戻るボタン */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          style={{position:'fixed', right:'32px', bottom:'32px', zIndex:1000, background:'rgba(245,238,220,0.7)', borderRadius:'50%', boxShadow:'0 4px 16px rgba(0,0,0,0.18)', width:'56px', height:'56px', display:'flex', alignItems:'center', justifyContent:'center', transition:'opacity 0.3s', backdropFilter:'blur(2px)'}}
          aria-label="ページトップへ戻る"
        >
          <FaArrowUp size={28} color="#333" />
        </button>
      )}
    </div>
  )
} 