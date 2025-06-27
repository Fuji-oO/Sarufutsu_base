'use client'
import Image from 'next/image'
import FadeLink from './FadeLink'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  
  return (
    <header className={`w-full z-50 ${isHomePage ? 'fixed bg-transparent' : 'relative'}`} style={!isHomePage ? {backgroundColor: '#BFAE8A'} : {}}>
      <nav className="mx-auto pr-10 py-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-start">
            <a href="/" className="relative w-60 h-20">
              <Image
                src="/images/logo_transparent.png"
                alt="さるふつbase"
                fill
                className="object-contain"
                priority
              />
            </a>
          </div>
          <div className="flex-1 flex justify-end space-x-6 items-center">
            <FadeLink href="/about" className="hover:text-gray-600" style={{fontFamily: 'Klee One, cursive'}}>About</FadeLink>
            <FadeLink href="/rooms" className="hover:text-gray-600" style={{fontFamily: 'Klee One, cursive'}}>Rooms</FadeLink>
            {/* <a href="/style" className="hover:text-gray-600">Spend</a> */}
            <FadeLink href="/reservation" className="hover:text-gray-600" style={{fontFamily: 'Klee One, cursive'}}>Reservation</FadeLink>
            <FadeLink href="/faq" className="hover:text-gray-600" style={{fontFamily: 'Klee One, cursive'}}>FAQ</FadeLink>
            <FadeLink href="/access" className="hover:text-gray-600" style={{fontFamily: 'Klee One, cursive'}}>Access</FadeLink>
            <FadeLink href="/contact" className="hover:text-gray-600" style={{fontFamily: 'Klee One, cursive'}}>Contact</FadeLink>
          </div>
        </div>
      </nav>
    </header>
  )
} 