import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/Header'
import FadeLink from '../components/FadeLink'
import FadeTransitionWrapper from '../components/FadeTransitionWrapper'
import { TransitionProvider } from '../components/TransitionContext'
import TransitionOverlay from '../components/TransitionOverlay'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'さるふつbase | 北海道・猿払村のゲストハウス',
  description: '北海道・猿払村のゲストハウス「さるふつbase」の公式ホームページです。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=Merriweather:wght@400;700&family=Klee+One:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <TransitionProvider>
          <TransitionOverlay />
          <Header />
        <main>
          {children}
        </main>
        <footer>
          <div className="w-full flex justify-center">
            <div style={{ background: '#BFAE8A', height: '2px', width: 'calc(100vw - 30px)', borderRadius: '2px', marginTop: '12px', marginBottom: '32px' }}></div>
          </div>
            <div className="container mx-auto px-2 py-4 block md:hidden">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h3 className="text-sm font-bold mb-2 text-left" style={{fontFamily: 'Klee One, cursive'}}>Address</h3>
                  <div className="mt-1 pt-2 border-t text-center text-gray-600" style={{ borderTopColor: '#BFAE8A', borderTopWidth: '1px', borderTopStyle: 'solid' }}></div>
                  <p className="text-xs text-gray-600 mb-2" style={{fontFamily: 'Klee One, cursive'}}>〒098-6233<br />北海道宗谷郡猿払村鬼志別南町176</p>
                  <p className="text-xs text-gray-600" style={{fontFamily: 'Klee One, cursive'}}>
                    <a href="https://maps.google.com/?q=45.329215,142.112069" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-gray-600 hover:text-gray-900" style={{fontFamily: 'Klee One, cursive'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3 mr-1"><path fillRule="evenodd" d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .189.153l.012.01ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" clipRule="evenodd"></path></svg>
                      Google Map
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-2 text-left" style={{fontFamily: 'Klee One, cursive'}}>Site Map</h3>
                  <div className="mt-1 pt-2 border-t text-center text-gray-600" style={{ borderTopColor: '#BFAE8A', borderTopWidth: '1px', borderTopStyle: 'solid' }}></div>
                  <ul className="flex flex-col gap-1">
                    <li><FadeLink href="/about" className="text-xs text-gray-600 hover:text-gray-900" style={{fontFamily: 'Klee One, cursive'}}>About - さるふつbaseについて -</FadeLink></li>
                    <li><FadeLink href="/rooms" className="text-xs text-gray-600 hover:text-gray-900" style={{fontFamily: 'Klee One, cursive'}}>Rooms & Facilities - お部屋・設備 -</FadeLink></li>
                    <li><FadeLink href="/reservation" className="text-xs text-gray-600 hover:text-gray-900" style={{fontFamily: 'Klee One, cursive'}}>Reservation - ご予約 -</FadeLink></li>
                    <li><FadeLink href="/gallery" className="text-xs text-gray-600 hover:text-gray-900" style={{fontFamily: 'Klee One, cursive'}}>Gallery - 猿払村の風景 -</FadeLink></li>
                    <li><FadeLink href="/faq" className="text-xs text-gray-600 hover:text-gray-900" style={{fontFamily: 'Klee One, cursive'}}>FAQ - よくあるご質問 -</FadeLink></li>
                    <li><FadeLink href="/access" className="text-xs text-gray-600 hover:text-gray-900" style={{fontFamily: 'Klee One, cursive'}}>Access - アクセス -</FadeLink></li>
                    <li><FadeLink href="/contact" className="text-xs text-gray-600 hover:text-gray-900" style={{fontFamily: 'Klee One, cursive'}}>Contact - お問い合わせ -</FadeLink></li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t text-center text-gray-600" style={{ borderTopColor: '#BFAE8A', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
                <FadeLink href="/policy" className="text-xs underline transition-colors hover:text-gray-900 custom-footer-link" style={{fontFamily: 'Klee One, cursive'}}>利用規約</FadeLink>
                <FadeLink href="/terms" className="text-xs ml-2 underline transition-colors hover:text-gray-900 custom-footer-link" style={{fontFamily: 'Klee One, cursive'}}>宿泊約款</FadeLink>
                <FadeLink href="/privacy" className="text-xs ml-2 underline transition-colors hover:text-gray-900 custom-footer-link" style={{fontFamily: 'Klee One, cursive'}}>プライバシーポリシー</FadeLink>
                <p className="mt-1 text-[10px]" style={{fontFamily: 'Klee One, cursive'}}>&copy; 2025 さるふつbase. All rights reserved.</p>
              </div>
            </div>
            <div className="container mx-auto px-4 py-8 hidden md:block">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                  <h3 className="text-lg font-bold mb-4 text-left" style={{fontFamily: 'Klee One, cursive'}}>Address</h3>
                <div className="mt-2 pt-6 border-t text-center text-gray-600" style={{ borderTopColor: '#BFAE8A', borderTopWidth: '1px', borderTopStyle: 'solid' }}></div>
                  <p className="text-gray-600 mb-4" style={{fontFamily: 'Klee One, cursive'}}>〒098-6233<br />北海道宗谷郡猿払村鬼志別南町176</p>
                  <p className="text-gray-600" style={{fontFamily: 'Klee One, cursive'}}>
                    <a href="https://maps.google.com/?q=45.329215,142.112069" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-gray-600 hover:text-gray-900" style={{fontFamily: 'Klee One, cursive'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4 mr-1"><path fillRule="evenodd" d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .189.153l.012.01ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" clipRule="evenodd"></path></svg>
                    Google Map
                  </a>
                </p>
              </div>
              <div>
                  <h3 className="text-lg font-bold mb-4 text-left" style={{fontFamily: 'Klee One, cursive'}}>Site Map</h3>
                <div className="mt-2 pt-6 border-t text-center text-gray-600" style={{ borderTopColor: '#BFAE8A', borderTopWidth: '1px', borderTopStyle: 'solid' }}></div>
                <ul className="flex flex-col gap-2">
                    <li><FadeLink href="/about" className="text-gray-600 hover:text-gray-900" style={{fontFamily: 'Klee One, cursive'}}>About - さるふつbaseについて -</FadeLink></li>
                    <li><FadeLink href="/rooms" className="text-gray-600 hover:text-gray-900" style={{fontFamily: 'Klee One, cursive'}}>Rooms & Facilities - お部屋・設備 -</FadeLink></li>
                    <li><FadeLink href="/reservation" className="text-gray-600 hover:text-gray-900" style={{fontFamily: 'Klee One, cursive'}}>Reservation - ご予約 -</FadeLink></li>
                    <li><FadeLink href="/gallery" className="text-gray-600 hover:text-gray-900" style={{fontFamily: 'Klee One, cursive'}}>Gallery - 猿払村の風景 -</FadeLink></li>
                    <li><FadeLink href="/faq" className="text-gray-600 hover:text-gray-900" style={{fontFamily: 'Klee One, cursive'}}>FAQ - よくあるご質問 -</FadeLink></li>
                    <li><FadeLink href="/access" className="text-gray-600 hover:text-gray-900" style={{fontFamily: 'Klee One, cursive'}}>Access - アクセス -</FadeLink></li>
                    <li><FadeLink href="/contact" className="text-gray-600 hover:text-gray-900" style={{fontFamily: 'Klee One, cursive'}}>Contact - お問い合わせ -</FadeLink></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-gray-600" style={{ borderTopColor: '#BFAE8A', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
                <FadeLink href="/policy" className="text-sm underline transition-colors hover:text-gray-900 custom-footer-link" style={{fontFamily: 'Klee One, cursive'}}>利用規約</FadeLink>
                <FadeLink href="/terms" className="text-sm ml-4 underline transition-colors hover:text-gray-900 custom-footer-link" style={{fontFamily: 'Klee One, cursive'}}>宿泊約款</FadeLink>
                <FadeLink href="/privacy" className="text-sm ml-4 underline transition-colors hover:text-gray-900 custom-footer-link" style={{fontFamily: 'Klee One, cursive'}}>プライバシーポリシー</FadeLink>
                <p className="mt-2" style={{fontFamily: 'Klee One, cursive'}}>&copy; 2025 さるふつbase. All rights reserved.</p>
            </div>
          </div>
        </footer>
        </TransitionProvider>
      </body>
    </html>
  )
} 