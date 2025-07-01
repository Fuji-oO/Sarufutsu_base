'use client'
import Image from 'next/image'
import FadeLink from './FadeLink'
import { usePathname } from 'next/navigation'
import { useState, useCallback } from 'react'

export default function Header() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)
  
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
          {/* ハンバーガーメニュー（モバイルのみ表示） */}
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
          {/* メニュー本体 */}
          <div className="hidden md:flex flex-1 justify-end space-x-6 items-center">
            <FadeLink href="/about" className="hover:text-gray-600" style={{fontFamily: 'Klee One, cursive'}}>About</FadeLink>
            <FadeLink href="/rooms" className="hover:text-gray-600" style={{fontFamily: 'Klee One, cursive'}}>Rooms</FadeLink>
            {/* <a href="/style" className="hover:text-gray-600">Spend</a> */}
            <FadeLink href="/reservation" className="hover:text-gray-600" style={{fontFamily: 'Klee One, cursive'}}>Reservation</FadeLink>
            <FadeLink href="/faq" className="hover:text-gray-600" style={{fontFamily: 'Klee One, cursive'}}>FAQ</FadeLink>
            <FadeLink href="/access" className="hover:text-gray-600" style={{fontFamily: 'Klee One, cursive'}}>Access</FadeLink>
            <FadeLink href="/contact" className="hover:text-gray-600" style={{fontFamily: 'Klee One, cursive'}}>Contact</FadeLink>
          </div>
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
          <div className="flex flex-col space-y-4 py-10 px-6">
            <FadeLink href="/about" className="text-lg py-2" style={{fontFamily: 'Klee One, cursive'}} onClick={closeMenu}>About</FadeLink>
            <FadeLink href="/rooms" className="text-lg py-2" style={{fontFamily: 'Klee One, cursive'}} onClick={closeMenu}>Rooms</FadeLink>
            <FadeLink href="/reservation" className="text-lg py-2" style={{fontFamily: 'Klee One, cursive'}} onClick={closeMenu}>Reservation</FadeLink>
            <FadeLink href="/faq" className="text-lg py-2" style={{fontFamily: 'Klee One, cursive'}} onClick={closeMenu}>FAQ</FadeLink>
            <FadeLink href="/access" className="text-lg py-2" style={{fontFamily: 'Klee One, cursive'}} onClick={closeMenu}>Access</FadeLink>
            <FadeLink href="/contact" className="text-lg py-2" style={{fontFamily: 'Klee One, cursive'}} onClick={closeMenu}>Contact</FadeLink>
          </div>
        </div>
      </nav>
    </header>
  )
} 