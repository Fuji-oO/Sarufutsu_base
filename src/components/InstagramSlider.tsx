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
    postUrl: 'https://www.instagram.com/sarufutsu_base?igsh=d3JjMmcwb3VkcjB0&utm_source=qr',
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
    postUrl: 'https://www.instagram.com/sarufutsu_base/p/DLRP_enRZmN/',
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
    postUrl: 'https://www.instagram.com/sarufutsu_base?igsh=d3JjMmcwb3VkcjB0&utm_source=qr',
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
  if (isAnimating && direction === 'right') translateX = -220;
  if (isAnimating && direction === 'left') translateX = 220;

  return (
    <div className="w-full max-w-7xl mx-auto">
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

            // 右スライド時は左端のみ、左スライド時は右端のみフェードアウト
            let fade = false;
            if (isAnimating && direction === 'right' && offset === -2) fade = true;
            if (isAnimating && direction === 'left' && offset === 2) fade = true;

            // リッチなアニメーション用スタイル
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
              // style.opacity = fade ? 0 : 0.7;
              style.filter = 'blur(1px)';
            } else if (Math.abs(offset) === 2) {
              style.transform = 'scale(0.85) translateY(20px)';
              // style.opacity = fade ? 0 : 0.4;
              style.filter = 'blur(2px)';
            }

            // 端画像のフェードイン
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
      <div className="flex justify-center mt-[50px] mb-[120px]">
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#333] hover:text-[#111] text-lg flex items-center gap-2 view-more-link"
        >
          View More
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 48 48" fill="currentColor">
            <path d="M 16.5 5 C 10.16639 5 5 10.16639 5 16.5 L 5 31.5 C 5 37.832757 10.166209 43 16.5 43 L 31.5 43 C 37.832938 43 43 37.832938 43 31.5 L 43 16.5 C 43 10.166209 37.832757 5 31.5 5 L 16.5 5 z M 16.5 8 L 31.5 8 C 36.211243 8 40 11.787791 40 16.5 L 40 31.5 C 40 36.211062 36.211062 40 31.5 40 L 16.5 40 C 11.787791 40 8 36.211243 8 31.5 L 8 16.5 C 8 11.78761 11.78761 8 16.5 8 z M 34 12 C 32.895 12 32 12.895 32 14 C 32 15.105 32.895 16 34 16 C 35.105 16 36 15.105 36 14 C 36 12.895 35.105 12 34 12 z M 24 14 C 18.495178 14 14 18.495178 14 24 C 14 29.504822 18.495178 34 24 34 C 29.504822 34 34 29.504822 34 24 C 34 18.495178 29.504822 14 24 14 z M 24 17 C 27.883178 17 31 20.116822 31 24 C 31 27.883178 27.883178 31 24 31 C 20.116822 31 17 27.883178 17 24 C 17 20.116822 20.116822 17 24 17 z"></path>
          </svg>
        </a>
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