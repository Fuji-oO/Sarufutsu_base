'use client'
import Image from 'next/image'
import FadeLink from './FadeLink'
import { usePathname } from 'next/navigation'
import { useState, useCallback } from 'react'

export default function Header() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)
  const [pcMenuOpen, setPcMenuOpen] = useState(false)
  
  // メニューを閉じる関数をuseCallbackで定義
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  
  return (
    <header className={`w-full z-50 ${isHomePage ? 'fixed bg-transparent' : 'relative'}`} style={!isHomePage ? {backgroundColor: '#BFAE8A'} : {}}>
      <nav className="mx-auto md:pl-8 pr-4 md:pr-10 py-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-start">
            <a href="/" className="relative w-28 h-10 md:w-40 md:h-14">
              <Image
                src="/images/logo_transparent.png"
                alt="さるふつbase"
                fill
                className="object-contain"
                priority
              />
            </a>
          </div>
          {/* PC用ハンバーガーメニュー（About,Gallery,FAQ,Contact） */}
          <div className="flex items-center justify-between w-full">
            {/* 左側：ロゴ */}
            <div className="flex-shrink-0">
              <a href="/" className="relative w-28 h-10 md:w-40 md:h-14">
                <Image
                  src="/images/logo_transparent.png"
                  alt="さるふつbase"
                  fill
                  className="object-contain"
                  priority
                />
              </a>
            </div>
            {/* 右側：メニュー + ハンバーガー */}
            <div className="hidden md:flex items-center space-x-10">
              <FadeLink
                href="/rooms"
                className="hover:text-gray-600 text-center"
                style={{ fontFamily: 'Klee One, cursive' }}
              >
                Rooms<br />
                <span className="text-[12px]">- お部屋 -</span>
              </FadeLink>
              <FadeLink
                href="/reservation"
                className="hover:text-gray-600 text-center"
                style={{ fontFamily: 'Klee One, cursive' }}
              >
                Reservation<br />
                <span className="text-[12px]">- ご予約 -</span>
              </FadeLink>
              <FadeLink
                href="/access"
                className="hover:text-gray-600 text-center"
                style={{ fontFamily: 'Klee One, cursive' }}
              >
                Access<br />
                <span className="text-[12px]">- アクセス -</span>
              </FadeLink>

              {/* ハンバーガーアイコン */}
              <button
                className="ml-2 flex flex-col justify-center items-center w-10 h-10 focus:outline-none z-50 relative"
                aria-label="メニューを開く"
                aria-expanded={pcMenuOpen}
                onClick={() => setPcMenuOpen(!pcMenuOpen)}
                type="button"
              >
                <span
                  className={`block w-7 h-0.5 bg-gray-800 transition-all duration-500 ${
                    pcMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                ></span>
                <span
                  className={`block w-7 h-0.5 bg-gray-800 my-1 transition-all duration-500 ${
                    pcMenuOpen ? 'opacity-0' : ''
                  }`}
                ></span>
                <span
                  className={`block w-7 h-0.5 bg-gray-800 transition-all duration-500 ${
                    pcMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                ></span>
              </button>

              {/* ハンバーガーメニュー本体（PC表示） */}
              <div
                className={`fixed top-0 right-0 w-64 max-w-[90vw] h-full bg-white/95 shadow-lg z-40 transform transition-all duration-500 ease-in-out ${
                  pcMenuOpen
                    ? 'opacity-100 translate-x-0 pointer-events-auto'
                    : 'opacity-0 translate-x-10 pointer-events-none'
                }`}
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <div className="flex flex-col space-y-4 py-10 px-6">
                  <FadeLink
                    href="/about"
                    className="text-lg py-2 hover:text-gray-600"
                    style={{ fontFamily: 'Klee One, cursive' }}
                    onClick={() => setPcMenuOpen(false)}
                  >
                    About<br />
                    <span className="text-[12px]">- さるふつbaseについて -</span>
                  </FadeLink>
                  <FadeLink
                    href="/rooms"
                    className="text-lg py-2 hover:text-gray-600"
                    style={{ fontFamily: 'Klee One, cursive' }}
                    onClick={() => setPcMenuOpen(false)}
                  >
                    Rooms<br />
                    <span className="text-[12px]">- お部屋 -</span>
                  </FadeLink>
                  <FadeLink
                    href="/reservation"
                    className="text-lg py-2 hover:text-gray-600"
                    style={{ fontFamily: 'Klee One, cursive' }}
                    onClick={() => setPcMenuOpen(false)}
                  >
                    Reservation<br />
                    <span className="text-[12px]">- ご予約 -</span>
                  </FadeLink>
                  <FadeLink
                    href="/gallery"
                    className="text-lg py-2 hover:text-gray-600"
                    style={{ fontFamily: 'Klee One, cursive' }}
                    onClick={() => setPcMenuOpen(false)}
                  >
                    Gallery<br />
                    <span className="text-[12px]">- 猿払村の風景 -</span>
                  </FadeLink>
                  <FadeLink
                    href="/faq"
                    className="text-lg py-2 hover:text-gray-600"
                    style={{ fontFamily: 'Klee One, cursive' }}
                    onClick={() => setPcMenuOpen(false)}
                  >
                    FAQ<br />
                    <span className="text-[12px]">- よくあるご質問 -</span>
                  </FadeLink>
                  <FadeLink
                    href="/access"
                    className="text-lg py-2 hover:text-gray-600"
                    style={{ fontFamily: 'Klee One, cursive' }}
                    onClick={() => setPcMenuOpen(false)}
                  >
                    Access<br />
                    <span className="text-[12px]">- アクセス -</span>
                  </FadeLink>
                  <FadeLink
                    href="/contact"
                    className="text-lg py-2 hover:text-gray-600"
                    style={{ fontFamily: 'Klee One, cursive' }}
                    onClick={() => setPcMenuOpen(false)}
                  >
                    Contact<br />
                    <span className="text-[12px]">- お問い合わせ -</span>
                  </FadeLink>
                </div>
              </div>
            </div>
          </div>
          {/* スマホ用ハンバーガーメニュー（従来通り） */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none z-50"
            aria-label="メニューを開く"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
          >
            <span className={`block w-7 h-0.5 bg-gray-800 transition-all duration-500 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-7 h-0.5 bg-gray-800 my-1 transition-all duration-500 ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-7 h-0.5 bg-gray-800 transition-all duration-500 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
          {/* メニュー本体（スマホのみ） */}
          <div className="hidden md:flex flex-1 justify-end space-x-6 items-center"></div>
        </div>
        {/* モバイルメニューオーバーレイ */}
        <div
          className={`md:hidden fixed right-0 top-0 h-full w-full bg-black/30 z-40 transition-opacity duration-700 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={closeMenu}
        />
        {/* モバイルメニュー本体 */}
        <div
          className={`md:hidden fixed right-0 top-0 w-64 max-w-[90vw] h-full bg-white/95 shadow-lg z-50 transform transition-transform duration-700 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{boxShadow: '0 8px 32px rgba(0,0,0,0.18)'}}
        >
          <button
            className="absolute top-4 right-4 w-8 h-8 flex flex-col justify-center items-center z-50"
            aria-label="メニューを閉じる"
            onClick={closeMenu}
            type="button"
          >
            <span className="block w-6 h-0.5 bg-gray-800 rotate-45 translate-y-1"></span>
            <span className="block w-6 h-0.5 bg-gray-800 -rotate-45 -translate-y-1 -mt-0.5"></span>
          </button>
          <div className="flex flex-col space-y-2 py-10 px-6">
            <FadeLink href="/about" className="text-lg py-2" style={{fontFamily: 'Klee One, cursive'}} onClick={closeMenu}>About<br />
            <span className="text-[10px]">- さるふつbaseについて -</span></FadeLink>
            <FadeLink href="/rooms" className="text-lg py-2" style={{fontFamily: 'Klee One, cursive'}} onClick={closeMenu}>Rooms<br />
            <span className="text-[10px]">- お部屋 -</span></FadeLink>
            <FadeLink href="/reservation" className="text-lg py-2" style={{fontFamily: 'Klee One, cursive'}} onClick={closeMenu}>Reservation<br />
            <span className="text-[10px]">- ご予約 -</span></FadeLink>
            <FadeLink href="/gallery" className="text-lg py-2" style={{fontFamily: 'Klee One, cursive'}} onClick={closeMenu}>Gallery<br />
            <span className="text-[10px]">- 猿払村の風景 -</span></FadeLink>
            <FadeLink href="/faq" className="text-lg py-2" style={{fontFamily: 'Klee One, cursive'}} onClick={closeMenu}>FAQ<br />
            <span className="text-[10px]">- よくあるご質問 -</span></FadeLink>
            <FadeLink href="/access" className="text-lg py-2" style={{fontFamily: 'Klee One, cursive'}} onClick={closeMenu}>Access<br />
            <span className="text-[10px]">- アクセス -</span></FadeLink>
            <FadeLink href="/contact" className="text-lg py-2" style={{fontFamily: 'Klee One, cursive'}} onClick={closeMenu}>Contact<br />
            <span className="text-[10px]">- お問い合わせ -</span></FadeLink>
          </div>
        </div>
      </nav>
    </header>
  )
} 