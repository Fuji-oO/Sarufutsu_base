import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const posts = [
  {
    id: '1',
    imageUrl: '/images/insta1.jpg',
    postUrl: 'https://www.instagram.com/sarufutsu_base/p/DKwmizCxfO1/',
    likes: 120,
  },
  {
    id: '2',
    imageUrl: '/images/insta2.jpg',
    postUrl: 'https://www.instagram.com/sarufutsu_base/p/DK8FTzJz3N1/',
    likes: 300,
  },
  {
    id: '3',
    imageUrl: '/images/insta3.jpg',
    postUrl: 'https://www.instagram.com/sarufutsu_base/p/DLE9UTCxH87/',
    likes: 210,
  },
  {
    id: '4',
    imageUrl: '/images/insta4.jpg',
    postUrl: 'https://www.instagram.com/sarufutsu_base/p/DLRP_enRZmN/',
    likes: 180,
  },
  {
    id: '5',
    imageUrl: '/images/insta5.jpg',
    postUrl: 'https://www.instagram.com/sarufutsu_base?igsh=d3JjMmcwb3VkcjB0&utm_source=qr',
    likes: 90,
  },
  {
    id: '6',
    imageUrl: '/images/insta6.jpg',
    postUrl: 'https://www.instagram.com/sarufutsu_base/p/DLjB0_QTal6/',
    likes: 75,
  },
  {
    id: '7',
    imageUrl: '/images/insta7.jpg',
    postUrl: 'https://www.instagram.com/sarufutsu_base/p/DLYU86bzPsp/',
    likes: 160,
  },
  {
    id: '8',
    imageUrl: '/images/insta8.jpg',
    postUrl: 'https://www.instagram.com/sarufutsu_base/p/DLoF0u5TR11/',
    likes: 250,
  },
];

interface InstagramSliderProps {
  profileUrl: string;
}

const InstagramSlider: React.FC<InstagramSliderProps> = ({ profileUrl }) => {
  const sortedPosts = [...posts].sort((a, b) => b.likes - a.likes);
  // insta1の画像が中央に来るように初期インデックスを設定
  const initialIndex = sortedPosts.findIndex(post => post.imageUrl === '/images/insta1.jpg');
  const [current, setCurrent] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const total = sortedPosts.length;
  const [isAnimating, setIsAnimating] = useState(false);

  const [prevVisibleIds, setPrevVisibleIds] = useState<string[]>([]);
  const [fadeInIds, setFadeInIds] = useState<string[]>([]);

  const getIndex = (offset: number) => (current + offset + total) % total;

  useEffect(() => {
    if (!isAnimating) {
      const newVisible = [-2, -1, 0, 1, 2].map((offset) => sortedPosts[getIndex(offset)].id);
      const newLeftId = sortedPosts[getIndex(-2)].id;
      const newRightId = sortedPosts[getIndex(2)].id;

      const newlyVisible = [newLeftId, newRightId].filter((id) => !prevVisibleIds.includes(id));
      setFadeInIds(newlyVisible);

      // 次フレームでフェード対象をクリア
      const clearTimer = setTimeout(() => {
        setFadeInIds([]);
      }, 700); // 遷移時間と一致

      setPrevVisibleIds(newVisible);

      return () => clearTimeout(clearTimer);
    }
  }, [isAnimating, current]);

  const nextSlide = () => {
    if (isAnimating) return;
    setDirection('right');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % total);
      setIsAnimating(false);
    }, 700);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setDirection('left');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + total) % total);
      setIsAnimating(false);
    }, 700);
  };

  let translateX = 0;
  // PC用（md以上）は±220px、スマホ用（md未満）は±60px
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    if (isAnimating && direction === 'right') translateX = -60;
    if (isAnimating && direction === 'left') translateX = 60;
  } else {
  if (isAnimating && direction === 'right') translateX = -220;
  if (isAnimating && direction === 'left') translateX = 220;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* PC版スライダー */}
      <div className="hidden md:block">
      <div className="relative flex items-center justify-center">
        <button onClick={prevSlide} className="absolute left-0 z-10 p-2 hover:opacity-70 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#333" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
          </svg>
        </button>
        <div
          className="flex gap-6 justify-center items-center w-full"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: isAnimating ? 'transform 0.7s cubic-bezier(0.4,0,0.2,1)' : 'none',
          }}
        >
          {[-2, -1, 0, 1, 2].map((offset) => {
            const idx = getIndex(offset);
            const post = sortedPosts[idx];
            const isFadingIn = fadeInIds.includes(post.id);
            let fade = false;
            if (isAnimating && direction === 'right' && offset === -2) fade = true;
            if (isAnimating && direction === 'left' && offset === 2) fade = true;
            let style: React.CSSProperties = {
              width: 200,
                height: 250,
              opacity: fade ? 0 : isFadingIn ? 0 : 1,
              transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)',
              zIndex: 5 - Math.abs(offset),
              transform: 'scale(1) translateY(0px)',
              filter: 'none',
            };
            if (offset === 0) {
              style.transform = 'scale(1.15) translateY(-10px)';
              style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)';
            } else if (Math.abs(offset) === 1) {
              style.transform = 'scale(0.95) translateY(10px)';
              style.filter = 'blur(1px)';
            } else if (Math.abs(offset) === 2) {
              style.transform = 'scale(0.85) translateY(20px)';
              style.filter = 'blur(2px)';
            }
            let fadeInStyle: React.CSSProperties = {};
            if (isFadingIn) {
              fadeInStyle.opacity = 0;
              fadeInStyle.animation = 'fadeInSliderEdge 0.7s forwards';
            }
            return (
              <a
                key={post.id}
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative rounded-lg overflow-hidden shadow"
                style={{ ...style, ...fadeInStyle }}
              >
                <Image
                  src={post.imageUrl}
                  alt="Instagram投稿画像"
                  fill
                  className="object-cover"
                />
              </a>
            );
          })}
        </div>
        <button onClick={nextSlide} className="absolute right-0 z-10 p-2 hover:opacity-70 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#333" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
      </div>
      {/* スマホ専用スライダー */}
      <div className="md:hidden">
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center h-[120px] w-full">
            <div
              className="flex gap-1 justify-center items-center w-full px-2 h-[120px]"
              style={{
                transform: `translateX(${translateX}px)`,
                transition: isAnimating ? 'transform 0.7s cubic-bezier(0.4,0,0.2,1)' : 'none',
              }}
            >
              {[-2, -1, 0, 1, 2].map((offset) => {
                const idx = getIndex(offset);
                const post = sortedPosts[idx];
                const isFadingIn = fadeInIds.includes(post.id);
                let fade = false;
                if (isAnimating && direction === 'right' && offset === -2) fade = true;
                if (isAnimating && direction === 'left' && offset === 2) fade = true;
                // 4:5比率で統一
                let width = 64, height = 80;
                if (Math.abs(offset) === 1) { width = 80; height = 100; }
                if (offset === 0) { width = 96; height = 120; }
                let style: React.CSSProperties = {
                  width,
                  height,
                  opacity: fade ? 0 : isFadingIn ? 0 : 1,
                  transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)',
                  zIndex: 5 - Math.abs(offset),
                  transform:
                    offset === 0
                      ? 'scale(1.1) translateY(-6px)'
                      : Math.abs(offset) === 1
                      ? 'scale(0.85) translateY(8px)'
                      : 'scale(0.7) translateY(16px)',
                  filter: offset === 0 ? 'none' : Math.abs(offset) === 1 ? 'blur(1px)' : 'blur(2px)',
                  boxShadow: offset === 0 ? '0 4px 16px rgba(0,0,0,0.15)' : 'none',
                };
                let fadeInStyle: React.CSSProperties = {};
                if (isFadingIn) {
                  fadeInStyle.opacity = 0;
                  fadeInStyle.animation = 'fadeInSliderEdge 0.7s forwards';
                }
                return (
                  <a
                    key={post.id}
                    href={post.postUrl}
          target="_blank"
          rel="noopener noreferrer"
                    className="relative rounded-lg overflow-hidden shadow"
                    style={{ ...style, ...fadeInStyle }}
                  >
                    <Image
                      src={post.imageUrl}
                      alt="Instagram投稿画像"
                      fill
                      className="object-cover"
                    />
                  </a>
                );
              })}
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <button onClick={prevSlide} className="z-20 p-1 hover:opacity-70 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#333" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
              </svg>
            </button>
            <button onClick={nextSlide} className="z-20 p-1 hover:opacity-70 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#333" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
          </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// スライダー端画像のフェードイン用アニメーション
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `@keyframes fadeInSliderEdge { from { opacity: 0; } to { opacity: 1; } }`;
  document.head.appendChild(style);
}

export default InstagramSlider;