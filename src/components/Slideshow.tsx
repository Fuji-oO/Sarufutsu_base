"use client"
import React, { useEffect, useRef, useState } from "react"

const texts = [
  "　人と人がつながる場所、",
  "さるふつbase"
]

export default function Slideshow() {
  const [firstLoad, setFirstLoad] = useState(true)
  const [showFirstFade, setShowFirstFade] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const [showMainText, setShowMainText] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // 初回ロード時のフェードイン処理
  useEffect(() => {
    setShowFirstFade(true)
    setTimeout(() => {
      setShowFirstFade(false)
      setFirstLoad(false)
      setTimeout(() => {
        setShowMainText(true)
      }, 200)
    }, 1200)
  }, [])

  // 動画の時間監視とテキスト制御
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const handleTimeUpdate = () => {
      const currentTime = video.currentTime
      if (currentTime >= 58 && showMainText) {
        setShowMainText(false)
      }
      if (currentTime < 2 && !showMainText && !firstLoad) {
        setShowMainText(true)
      }
    }
    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [showMainText, firstLoad])

  // ページの可視性・フォーカス切り替え時はpause()のみ
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause()
        }
      }
    }
    const handleFocusChange = () => {
      if (!document.hasFocus()) {
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause()
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleFocusChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleFocusChange)
    }
  }, [])

  // ユーザーインタラクションでのみ音声ON＋再生
  useEffect(() => {
    const handleVideoClick = (e: Event) => {
      e.preventDefault()
      if (videoRef.current) {
        if (!hasUserInteracted) {
          setHasUserInteracted(true)
          setIsMuted(false)
          videoRef.current.muted = false
          videoRef.current.play().catch(error => {
            if (error.name !== 'AbortError') {
              console.log('音声付き動画の再生に失敗しました:', error)
            }
          })
        } else {
          const newMutedState = !isMuted
          setIsMuted(newMutedState)
          videoRef.current.muted = newMutedState
          if (!newMutedState) {
            videoRef.current.play().catch(error => {
              if (error.name !== 'AbortError') {
                console.log('動画の再生に失敗しました:', error)
              }
            })
          }
        }
      }
    }
    const video = videoRef.current
    if (video) {
      video.addEventListener('click', handleVideoClick)
    }
    return () => {
      if (video) {
        video.removeEventListener('click', handleVideoClick)
      }
    }
  }, [hasUserInteracted, isMuted])

  // 初回ロード時のみ自動再生
  useEffect(() => {
    if (videoRef.current && !firstLoad) {
      videoRef.current.play().catch(error => {
        if (error.name !== 'AbortError') {
          console.log('動画の自動再生に失敗しました:', error)
        }
      })
    }
  }, [firstLoad])

  return (
    <div className="relative w-full h-[100vh] md:h-[898px] flex items-center justify-center overflow-hidden" style={{background: '#F5EEDC'}}>
      {showFirstFade && (
        <div className="absolute inset-0 z-30" style={{background: '#F5EEDC', opacity: showFirstFade ? 1 : 0, animation: 'fadeInBeige 1.2s forwards'}} />
      )}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <video
          ref={videoRef}
          className="h-full w-auto md:w-full md:h-full object-cover cursor-pointer mx-auto"
          muted={isMuted}
          loop
          playsInline
          style={{ pointerEvents: 'auto', maxWidth: 'none' }}
        >
          <source src="/images/sarufutsubase_video_music-1.mp4" type="video/mp4" />
          お使いのブラウザは動画の再生に対応していません。
        </video>
        <div className="absolute inset-0 bg-black/30" style={{ pointerEvents: 'none' }} />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
        <h1 className={`text-2xl md:text-6xl font-bold drop-shadow-lg text-center mb-2 md:mb-4 transition-opacity duration-1000 ${showMainText ? 'opacity-100' : 'opacity-0'}`} style={{color:'#F5EEDC', fontFamily: 'Klee One, cursive'}}>
          <span className="text-2xl md:text-5xl font-bold tracking-widest">{texts[0]}</span><br />
          <span className="text-2xl md:text-5xl font-bold tracking-widest">{texts[1]}</span>
        </h1>
      </div>
      <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-20 pointer-events-none">
        {!hasUserInteracted && (
          <div className="text-xs opacity-70" style={{color:'#E8E0D0', fontFamily: 'Klee One, cursive'}}>
            クリックまたはタップで音声を有効にします
          </div>
        )}
        {hasUserInteracted && (
          <div className="text-xs opacity-70" style={{color:'#E8E0D0', fontFamily: 'Klee One, cursive'}}>
            {isMuted ? '🔇 音声OFF - クリックで音声ON' : '🔊 音声ON - クリックで音声OFF'}
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeInBeige {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  )
} 