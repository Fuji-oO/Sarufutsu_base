'use client'
import Image from 'next/image'
import Link from 'next/link'
import Slideshow from '../components/Slideshow'
import { useEffect, useRef, useState } from 'react'
import InstagramSlider from '../components/InstagramSlider'
import { FaArrowUp } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'
import FadeTransitionWrapper from '../components/FadeTransitionWrapper'

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
  const communityRefMobile = useRef(null);
  const communityRefPC = useRef(null);
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
    let observer;
    const setupObserver = () => {
      const isMobile = window.innerWidth < 768;
      const targetRef = isMobile ? communityRefMobile : communityRefPC;
      if (!targetRef.current) return;
      observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowCommunityText(true);
          setTimeout(() => {
            setShowCommunityImgLeft(true);
              setTimeout(() => setShowCommunityImgRight(true), 400);
            }, 600);
        }
      },
      { threshold: 0.2 }
    );
      observer.observe(targetRef.current);
    };
    if (typeof window !== 'undefined') {
      requestAnimationFrame(setupObserver);
    }
    return () => {
      if (observer && observer.disconnect) observer.disconnect();
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
    // スマホ・PC共通: ヒーローセクションが見えていない時に表示
    if (typeof window !== 'undefined') {
    const observer = new window.IntersectionObserver(
      (entries) => {
          setShowScrollTop(!entries[0].isIntersecting);
      },
        { threshold: 0.01 }
    );
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
    }
  }, []);

  return (
    <FadeTransitionWrapper>
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <div ref={heroRef} />
      <Slideshow />

      {/* コンセプトセクション */}
        <section ref={conceptRef} className="py-16 md:py-[120px] bg-base-section">
          <div className="container relative flex justify-center items-center min-h-[500px] md:min-h-[800px] min-h-[400px]">
          {/* IntersectionObserver用のref */}
          <div ref={conceptRef}></div>
            {/* スマホ時：テキスト→画像2枚を横並び中央配置 */}
            <div className="flex md:hidden flex-col items-center w-full mb-4">
              <div className={`relative z-20 max-w-xl w-full mx-auto bg-transparent px-2 py-4 transition-opacity duration-1000 fade-in${showText ? ' show' : ''}`}> 
                <h2 className="text-base font-black mt-0 mb-1" style={{fontFamily: 'Klee One, cursive'}}>- About -</h2>
                <h3 className="text-xl text-center font-black mt-0 mb-6 whitespace-nowrap flex justify-center items-center" style={{fontFamily: 'Klee One, cursive'}}>北の風がつなぐ、人と人の交差点。</h3>
                <p className="mb-2 text-sm text-center" style={{fontFamily: 'Klee One, cursive'}}>
                  さるふつbaseは、<br />
                  北海道・猿払村の雄大な自然の中にある<br />
                  1日1〜2組限定のゲストハウスです。
                </p>
                <p className="mb-2 text-sm text-center" style={{fontFamily: 'Klee One, cursive'}}>
                  旅人と地域の人々をゆるやかにつなぐ<br />
                  コミュニティスペースとしても開かれており、<br />
                  出会いや発見が生まれる場になっています。
                </p>
                <p className="mb-6 text-sm text-center" style={{fontFamily: 'Klee One, cursive'}}>
                  この土地の風土や人とのふれあいを感じながら、<br />
                  ほっと安らげる時間をお過ごしください。
                </p>
                <Link href="/about" className="text-base font-semibold text-[#333] hover:text-[#111] block text-center mx-auto w-fit view-more-link" style={{fontFamily: 'Klee One, cursive'}}>
                  View More →
                </Link>
              </div>

              <div className="relative flex flex-row items-center justify-start w-[340px] h-[216px] mx-auto mt-8">
                {/* 画像① */}
                <div className={`relative w-36 h-[216px] shadow-lg rounded-lg overflow-hidden bg-white z-10 transition-opacity duration-1000 fade-in${showImg1 ? ' show' : ''}`}> 
                  <Image
                    src="/images/room_tate1.jpg"
                    alt="画像①"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* 画像②・③を右側に絶対配置 */}
                <div className="relative flex-1 h-full">
                  <div className={`absolute right-0 top-0 w-36 h-20 shadow-lg rounded-lg overflow-hidden bg-white z-20 transition-opacity duration-1000 fade-in${showImg3 ? ' show' : ''}`}> 
                    <Image
                      src="/images/yuyake.jpeg"
                      alt="画像③"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className={`absolute right-0 bottom-0 w-44 h-28 shadow-lg rounded-lg overflow-hidden bg-white z-10 transition-opacity duration-1000 fade-in${showImg2 ? ' show' : ''}`}> 
                    <Image
                      src="/images/hamanasu1.png"
                      alt="画像②"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* PC時：従来通り絶対配置で3枚＋テキスト */}
            <div className="hidden md:block">
          <div className={`absolute -left-20 bottom-[-180px] -translate-y-1/2 w-56 h-80 md:w-80 md:h-[550px] shadow-lg rounded-lg overflow-hidden bg-white z-10 transition-opacity duration-1000 fade-in${showImg1 ? ' show' : ''}`}>
            <Image
                  src="/images/room_tate1.jpg"
              alt="画像①"
              fill
              className="object-cover"
            />
          </div>
              <div className={`absolute right-[-110px] bottom-[520px] w-70 h-35 md:w-[400px] md:h-72 shadow-lg rounded-lg overflow-hidden bg-white z-10 transition-opacity duration-1000 fade-in${showImg3 ? ' show' : ''}`}> 
            <Image
                  src="/images/yuyake.jpeg" 
              alt="画像③"
              fill
              className="object-cover"
            />
          </div>
          <div className={`absolute right-[150px] bottom-[-70px] w-80 h-48 md:w-96 md:h-56 shadow-lg rounded-lg overflow-hidden bg-white z-10 transition-opacity duration-1000 fade-in${showImg2 ? ' show' : ''}`}>
            <Image
                  src="/images/hamanasu1.png"
              alt="画像②"
              fill
              className="object-cover"
            />
          </div>
          <div className={`relative z-20 max-w-xl w-full mx-auto bg-transparent px-4 py-8 transition-opacity duration-1000 fade-in${showText ? ' show' : ''}`}>
                <h2 className="text-base md:text-2xl mt-0 mb-1 md:mb-2" style={{fontFamily: 'Klee One, cursive'}}>- About -</h2>
                <h3 className="text-lg md:text-3xl text-center md:text-4xl font-bold mt-0 mb-2 md:mb-10 whitespace-nowrap flex justify-center items-center" style={{fontFamily: 'Klee One, cursive'}}>北の風がつなぐ、人と人の交差点。</h3>
                <p className="mb-2 md:mb-4 text-sm md:text-base" style={{fontFamily: 'Klee One, cursive'}}>
                  さるふつbaseは、北海道・猿払村の雄大な自然の中にある<br />
                  1日1〜2組限定のゲストハウスです。
            </p>
                <p className="mb-2 md:mb-4 text-sm md:text-base" style={{fontFamily: 'Klee One, cursive'}}>
                  旅人と地域の人々をゆるやかにつなぐコミュニティスペースとしても<br />
                  開かれており、出会いや発見が生まれる場になっています。  
            </p>
                <p className="mb-4 md:mb-10 text-sm md:text-base" style={{fontFamily: 'Klee One, cursive'}}>
                  この土地の風土や人とのふれあいを感じながら、<br />
                  ほっと安らげる時間をお過ごしください。
            </p>
                <Link href="/about" className="text-base md:text-lg font-semibold text-[#333] hover:text-[#111] block text-center mx-auto w-fit view-more-link" style={{fontFamily: 'Klee One, cursive'}}>
              View More →
            </Link>
              </div>
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
        <section className="py-16 md:py-[120px]" style={{background:'#BFAE8A'}}>
          <div className="container mx-auto px-2 md:px-4">
          <div ref={roomsRef}></div>
            <div className={`relative z-20 max-w-xl w-full mx-auto bg-transparent px-2 md:px-4 py-4 md:py-8 transition-opacity duration-1000 fade-in${showRoomsText ? ' show' : ''}`}>
              <h2 className="text-base md:text-2xl text-center mt-0 mb-1 md:mb-2" style={{fontFamily: 'Klee One, cursive'}}>- Rooms -</h2>
              <h3 className="text-xl md:text-3xl text-center md:text-4xl font-bold mt-0 mb-6 md:mb-10 whitespace-nowrap flex justify-center items-center" style={{fontFamily: 'Klee One, cursive'}}>静けさにひたる、ちょっと特別な時間。</h3>
              {/* スマホのみ */}
              <p className="mb-2 text-sm block md:hidden text-center" style={{fontFamily: 'Klee One, cursive'}}>
                さるふつbaseの客室は、シンプルな中に北国らしい<br />
                落ち着きとぬくもりを感じられる空間です。
              </p>
              <p className="mb-2 text-sm block md:hidden text-center" style={{fontFamily: 'Klee One, cursive'}}>
                自然に包まれながら、<br />
                日々のあわただしさを少しだけ手放して、<br />
                自分のペースで過ごす時間を楽しんでみてください。
              </p>
              <p className="mb-6 text-sm block md:hidden text-center" style={{fontFamily: 'Klee One, cursive'}}>
                1日1〜2組限定で、一棟まるごとの貸切もOK。<br />
                人々との交流も、プライベートな時間も、<br />
                どちらも大切にできる場所です。
              </p>
              {/* PCのみ */}
              <p className="mb-2 md:mb-4 text-base hidden md:block" style={{fontFamily: 'Klee One, cursive'}}>
              さるふつbaseの客室は、<br />
                シンプルな中に、北国らしい落ち着きとぬくもりを感じられる空間です。
            </p>
              <p className="mb-2 md:mb-4 text-base hidden md:block" style={{fontFamily: 'Klee One, cursive'}}>
                自然に包まれながら、日々のあわただしさを少しだけ手放して、<br />
                自分のペースで過ごす時間を楽しんでみてください。
            </p>
              <p className="mb-4 md:mb-10 text-base hidden md:block" style={{fontFamily: 'Klee One, cursive'}}>
                1日1〜2組限定で、一棟まるごとの貸切もOK。<br />
                人々との交流も、プライベートな時間も、どちらも大切にできる場所です。
            </p>
              <Link href="/rooms" className="text-base md:text-lg font-semibold text-[#333] hover:text-[#111] block text-center mx-auto w-fit view-more-link" style={{fontFamily: 'Klee One, cursive'}}>
              View More →
            </Link>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[120px] max-w-5xl mx-auto">
              <div className={`bg-[#F5EEDC] rounded-lg shadow-lg overflow-hidden transition-opacity duration-1000 fade-in${showRoom1 ? ' show' : ''} max-w-xs mx-auto md:max-w-full`}>
              <div className="relative w-full h-auto cursor-pointer" onClick={() => router.push('/rooms/room1')} tabIndex={0} role="button" aria-label="Room1詳細へ">
                <Image
                    src="/images/room1_1.jpg"
                    alt="Room01"
                  width={400}
                  height={240}
                    className="w-full h-50 md:h-auto object-cover md:object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>
                <div className="p-2 md:p-4 text-center">
                  <h3 className="text-base md:text-xl font-bold mb-1 md:mb-2" style={{fontFamily: 'Klee One, cursive'}}>Room01 (3名様用)</h3>
                  <p className="text-gray-600 text-xs md:text-base" style={{fontFamily: 'Klee One, cursive'}}>やわらかな光が差し込む、ナチュラルで温かな部屋。</p>
                </div>
              </div>
              <div className={`bg-[#F5EEDC] rounded-lg shadow-lg overflow-hidden transition-opacity duration-1000 fade-in${showRoom2 ? ' show' : ''} max-w-xs mx-auto md:max-w-full`}>
              <div className="relative w-full h-auto cursor-pointer" onClick={() => router.push('/rooms/room2')} tabIndex={0} role="button" aria-label="Room2詳細へ">
                <Image
                    src="/images/room2_8.jpg"
                    alt="Room02"
                  width={400}
                  height={240}
                    className="w-full h-50 md:h-auto object-cover md:object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>
                <div className="p-2 md:p-4 text-center">
                  <h3 className="text-base md:text-xl font-bold mb-1 md:mb-2" style={{fontFamily: 'Klee One, cursive'}}>Room02 (2名様用)</h3>
                  <p className="text-gray-600 text-xs md:text-base" style={{fontFamily: 'Klee One, cursive'}}>グレーと木の質感が調和する、落ち着いたモダン空間。</p>
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
        <section className="py-16 md:py-[120px] bg-base-section">
          <div className="container min-h-[500px] md:min-h-[600px] min-h-[300px] flex flex-col md:flex-row justify-center items-center w-full max-w-7xl mx-auto">
            {/* スマホ時：テキスト下に画像2枚を横並び＆高さランダム */}
            <div className="block md:hidden w-full" ref={communityRefMobile}>
              <div className={`transition-opacity duration-1000 fade-in${showCommunityText ? ' show' : ''} px-2 pt-4 pb-2`}>
                <h2 className="text-base mt-0 mb-1" style={{fontFamily: 'Klee One, cursive'}}>- Community Space -</h2>
                <h3 className="text-xl text-center font-bold mt-0 mb-6 whitespace-nowrap flex justify-center items-center" style={{fontFamily: 'Klee One, cursive'}}>つながりが広がる場所。</h3>
                <p className="mb-2 text-sm text-center" style={{fontFamily: 'Klee One, cursive'}}>
                  さるふつbaseのコミュニティスペースは、<br />
                  旅人も地域の人もふらっと立ち寄れる、<br />
                  気軽でオープンな空間です。  
                </p>
                <p className="mb-2 text-sm text-center" style={{fontFamily: 'Klee One, cursive'}}>
                  イベントやワークショップ、<br />
                  地元の人とのおしゃべりなどから、<br />
                  いろんな出会いや発見が生まれます。
                </p>
                <p className="text-sm text-center" style={{fontFamily: 'Klee One, cursive'}}>
                  ここでのひとときが、<br />
                  旅の思い出や新しいご縁につながるかもしれません。
                </p>
              </div>
              <div className="flex flex-row justify-center gap-5 w-full mt-8">
                <div className={`relative w-[138px] h-[178px] shadow-lg rounded-lg overflow-hidden bg-white z-10 transition-opacity duration-1000 fade-in${showCommunityImgLeft ? ' show' : ''}`}> 
                  <Image
                    src="/images/1f_1.jpg"
                    alt="薪ストーブ"
                    fill
                    className="object-cover rounded-lg shadow-lg"
                  />
                </div>
                <div className={`relative w-[178px] h-[130px] shadow-lg rounded-lg overflow-hidden bg-white z-10 transition-opacity duration-1000 fade-in${showCommunityImgRight ? ' show' : ''}`}> 
                  <Image
                    src="/images/store2.jpg"
                    alt="店舗1"
                    fill
                    className="object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
            {/* PC時：従来通りテキスト左右に画像 */}
            <div className="hidden md:flex flex-row items-center w-full max-w-7xl justify-center" ref={communityRefPC}>
              <div className={`flex-none w-[280px] h-[340px] relative mr-[100px] mt-[250px] transition-opacity duration-1000 fade-in${showCommunityImgLeft ? ' show' : ''}`}>
                <div className="relative w-[280px] h-[340px]">
                <Image
                    src="/images/1f_1.jpg"
                  alt="薪ストーブ"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
              <div className={`flex-none max-w-[544px] transition-opacity duration-1000 fade-in${showCommunityText ? ' show' : ''}`}>
              <div className="relative z-20 mx-auto bg-transparent">
                  <h2 className="text-base md:text-2xl mt-0 mb-1 md:mb-2" style={{fontFamily: 'Klee One, cursive'}}>- Community Space -</h2>
                  <h3 className="text-xl md:text-3xl text-center md:text-4xl font-bold mt-0 mb-2 md:mb-10 whitespace-nowrap flex justify-center items-center" style={{fontFamily: 'Klee One, cursive'}}>つながりが広がる場所。</h3>
                  <p className="mb-2 md:mb-4 text-sm md:text-base" style={{fontFamily: 'Klee One, cursive'}}>
                  さるふつbaseのコミュニティスペースは、<br />
                    旅人も地域の人もふらっと立ち寄れる、気軽でオープンな空間です。  
                </p>
                  <p className="mb-2 md:mb-4 text-sm md:text-base" style={{fontFamily: 'Klee One, cursive'}}>
                    イベントやワークショップ、地元の人とのおしゃべりなどから、<br />
                    いろんな出会いや発見が生まれます。
                </p>
                  <p className="mb-4 text-sm md:text-base" style={{fontFamily: 'Klee One, cursive'}}>
                    ここでのひとときが、旅の思い出や新しいご縁につながるかもしれません。
                </p>
                </div>
              </div>
              <div className={`flex-none w-[290px] h-[450px] relative ml-[80px] mb-[150px] transition-opacity duration-1000 fade-in${showCommunityImgRight ? ' show' : ''}`}>
                <div className="relative w-[290px] h-[450px]">
                <Image
                    src="/images/store2.jpg"
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
        <section className="pt-16 pb-24 md:py-[120px]" style={{background:'#BFAE8A'}}>
          <div ref={instagramRef} className={`relative z-20 max-w-xl w-full mx-auto bg-transparent px-2 md:px-4 py-4 md:py-8 transition-opacity duration-1000 fade-in${showInstagramText ? ' show' : ''}`}>
            <h2 className="text-2xl md:text-4xl text-center font-bold mt-0 mb-6 md:mb-10 whitespace-nowrap" style={{fontFamily: 'Klee One, cursive'}}>Instagram</h2>
            <p className="mb-8 md:mb-[50px] text-sm md:text-base block md:hidden text-center" style={{fontFamily: 'Klee One, cursive'}}>
              　Instagramでは、<br />
              さるふつbaseの日常やイベント情報を発信しています。<br />
              地域の風景や、ふらっと立ち寄った方との交流の様子など、<br />
              ありのままの"今"をお届けしています。<br />
              ぜひのぞいてみてください。
            </p>
            <p className="mb-8 md:mb-[50px] text-sm md:text-base hidden md:block" style={{fontFamily: 'Klee One, cursive'}}>
            Instagramでは、さるふつbaseの日常やイベント情報を発信しています。<br />
            地域の風景や、ふらっと立ち寄った方との交流の様子など、<br />
            ありのままの"今"をお届けしています。ぜひのぞいてみてください。
          </p>
        </div>
        <div className={`transition-opacity duration-1000 fade-in${showInstagramText ? ' show' : ''}`}>
          <InstagramSlider profileUrl="https://www.instagram.com/sarufutsu_base?igsh=d3JjMmcwb3VkcjB0&utm_source=qr" />
            <div className="flex justify-center mt-8 md:mt-[50px] md:mb-[120px]">
              <a
                href="https://www.instagram.com/sarufutsu_base?igsh=d3JjMmcwb3VkcjB0&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#333] hover:text-[#111] text-ml md:text-lg flex items-center gap-2 view-more-link"
              >
                View More
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 48 48" fill="currentColor">
                  <path d="M 16.5 5 C 10.16639 5 5 10.16639 5 16.5 L 5 31.5 C 5 37.832757 10.166209 43 16.5 43 L 31.5 43 C 37.832938 43 43 37.832938 43 31.5 L 43 16.5 C 43 10.166209 37.832757 5 31.5 5 L 16.5 5 z M 16.5 8 L 31.5 8 C 36.211243 8 40 11.787791 40 16.5 L 40 31.5 C 40 36.211062 36.211062 40 31.5 40 L 16.5 40 C 11.787791 40 8 36.211243 8 31.5 L 8 16.5 C 8 11.78761 11.78761 8 16.5 8 z M 34 12 C 32.895 12 32 12.895 32 14 C 32 15.105 32.895 16 34 16 C 35.105 16 36 15.105 36 14 C 36 12.895 35.105 12 34 12 z M 24 14 C 18.495178 14 14 18.495178 14 24 C 14 29.504822 18.495178 34 24 34 C 29.504822 34 34 29.504822 34 24 C 34 18.495178 29.504822 14 24 14 z M 24 17 C 27.883178 17 31 20.116822 31 24 C 31 27.883178 27.883178 31 24 31 C 20.116822 31 17 27.883178 17 24 C 17 20.116822 20.116822 17 24 17 z"></path>
                </svg>
              </a>
            </div>
        </div>
      </section>

      {/* トップへ戻るボタン */}
      {showScrollTop && (
        <button
            onClick={() => {
              // ゆっくりスクロール（800ms程度）
              const scrollToTop = () => {
                const c = window.scrollY;
                if (c > 0) {
                  window.scrollTo(0, Math.floor(c - c / 8));
                  window.requestAnimationFrame(scrollToTop);
                }
              };
              scrollToTop();
            }}
            style={{
              position: 'fixed',
              right: '20px',
              bottom: '20px',
              zIndex: 1000,
              background: 'rgba(245,238,220,0.7)',
              borderRadius: '50%',
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
              width: window.innerWidth < 768 ? '40px' : '56px',
              height: window.innerWidth < 768 ? '40px' : '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.3s',
              backdropFilter: 'blur(2px)'
            }}
          aria-label="ページトップへ戻る"
        >
            <FaArrowUp size={window.innerWidth < 768 ? 18 : 28} color="#333" />
        </button>
      )}
    </div>
    </FadeTransitionWrapper>
  )
} 