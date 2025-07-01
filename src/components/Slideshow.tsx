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
  const [isPageVisible, setIsPageVisible] = useState(true)
  const [showMainText, setShowMainText] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const textTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 初回ロード時のフェードイン処理
  useEffect(() => {
    // 0.7秒のフェードイン
    setShowFirstFade(true)
    setTimeout(() => {
      setShowFirstFade(false)
      setFirstLoad(false)
      // 1秒後にメインテキストをフェードイン
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
      const duration = video.duration

      // 動画開始から58秒後にテキストをフェードアウト
      if (currentTime >= 58 && showMainText) {
        setShowMainText(false)
      }
      
      // 動画終了時（ループ開始時）にテキストをフェードイン
      if (currentTime < 2 && !showMainText && !firstLoad) {
        setShowMainText(true)
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [showMainText, firstLoad])

  // ページの可視性を監視
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // ページが非表示になった時
        setIsPageVisible(false)
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause()
        }
      } else {
        // ページが再表示された時
        setIsPageVisible(true)
        if (videoRef.current && hasUserInteracted && !isMuted) {
          videoRef.current.play().catch(error => {
            console.log('動画の再開に失敗しました:', error)
          })
        }
      }
    }

    // ページの可視性変更を監視
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // ウィンドウのフォーカス変更を監視（ブラウザの切り替え）
    const handleFocusChange = () => {
      if (document.hasFocus()) {
        // ウィンドウがフォーカスされた時
        if (videoRef.current && hasUserInteracted && !isMuted && !videoRef.current.paused) {
          videoRef.current.play().catch(error => {
            console.log('動画の再開に失敗しました:', error)
          })
        }
      } else {
        // ウィンドウがフォーカスを失った時
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause()
        }
      }
    }

    window.addEventListener('focus', handleFocusChange)
    window.addEventListener('blur', handleFocusChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocusChange)
      window.removeEventListener('blur', handleFocusChange)
    }
  }, [hasUserInteracted, isMuted])

  // ユーザーインタラクションを検知（音声ON/OFF切り替え）
  useEffect(() => {
    const handleVideoClick = (e: Event) => {
      e.preventDefault()
      console.log('動画がクリックされました')
      
      if (videoRef.current) {
        if (!hasUserInteracted) {
          // 初回クリック時は音声を有効にする
          console.log('初回クリック: 音声を有効にします')
          setHasUserInteracted(true)
          setIsMuted(false)
          videoRef.current.muted = false
          videoRef.current.play().catch(error => {
            console.log('音声付き動画の再生に失敗しました:', error)
          })
        } else {
          // 2回目以降は音声のON/OFFを切り替え
          const newMutedState = !isMuted
          console.log('音声切り替え:', newMutedState ? 'OFF' : 'ON')
          setIsMuted(newMutedState)
          videoRef.current.muted = newMutedState
          
          if (newMutedState) {
            console.log('音声をOFFにしました')
          } else {
            console.log('音声をONにしました')
            videoRef.current.play().catch(error => {
              console.log('動画の再生に失敗しました:', error)
            })
          }
        }
      }
    }

    // 動画要素のみにクリックイベントを追加
    const video = videoRef.current
    if (video) {
      video.addEventListener('click', handleVideoClick)
      console.log('動画クリックイベントを設定しました')
    }

    return () => {
      if (video) {
        video.removeEventListener('click', handleVideoClick)
      }
    }
  }, [hasUserInteracted, isMuted])

  // 動画の再生制御
  useEffect(() => {
    if (videoRef.current && !firstLoad) {
      videoRef.current.play().catch(error => {
        console.log('動画の自動再生に失敗しました:', error)
      })
    }
  }, [firstLoad])

  return (
    <div className="relative w-full h-[80vh] md:h-[898px] flex items-center justify-center overflow-hidden" style={{background: '#F5EEDC'}}>
      {/* 初回ロード時のフェードイン */}
      {showFirstFade && (
        <div className="absolute inset-0 z-30" style={{background: '#F5EEDC', opacity: showFirstFade ? 1 : 0, animation: 'fadeInBeige 1.2s forwards'}} />
      )}
      
      {/* 背景動画 */}
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
        {/* 動画の上にオーバーレイ */}
        <div className="absolute inset-0 bg-black/30" style={{ pointerEvents: 'none' }} />
      </div>

      {/* テキストオーバーレイ */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
        <h1 className={`text-2xl md:text-6xl font-bold drop-shadow-lg text-center mb-2 md:mb-4 transition-opacity duration-1000 ${showMainText ? 'opacity-100' : 'opacity-0'}`} style={{color:'#F5EEDC', fontFamily: 'Klee One, cursive'}}>
          <span className="text-3xl md:text-5xl font-bold tracking-widest">{texts[0]}</span><br />
          <span className="text-3xl md:text-5xl font-bold tracking-widest">{texts[1]}</span>
        </h1>
      </div>

      {/* 音声案内（右下に配置） */}
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

      {/* フェードイン用アニメーション */}
      <style>{`
        @keyframes fadeInBeige {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  )
} 