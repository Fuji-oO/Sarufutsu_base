'use client'

import FadeTransitionWrapper from '../../components/FadeTransitionWrapper'

const CONTACT_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSflVbIdYr_4Ao68ejFYhnfE-Pvz9pfqA_RfGn9xV4cLumqqWQ/viewform?fbzx=4809417452508585343'

const ContactPage = () => {
  return (
    <FadeTransitionWrapper>
      <div className="w-full" style={{ background: '#F5EEDC' }}>
        <div className="container mx-auto px-4 py-16 md:py-[120px]">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-2 md:mb-4" style={{ letterSpacing: '0.1em' }}>
            Contact
          </h1>
          <p className="text-xs md:text-base text-center mb-8 md:mb-12" style={{ letterSpacing: '0.1em' }}>
            - お問い合わせ -
          </p>

          <div className="max-w-2xl mx-auto bg-white bg-opacity-90 rounded-lg shadow-lg p-4 md:p-8">
            <div className="bg-[#fff] p-4 md:p-6 rounded-lg mb-8 md:mb-12 border-2" style={{ borderColor: '#BFAE8A' }}>
              <h2 className="text-base md:text-2xl font-black mb-3 md:mb-4">お電話でのお問い合わせ</h2>
              <p className="text-xs md:text-base text-gray-700 mb-1 md:mb-2">
                <span className="font-bold">TEL: </span>
                <a
                  href="tel:070-2616-1188"
                  className="transition-colors duration-200 text-gray-700 hover:text-[#BFAE8A] focus:text-[#BFAE8A]"
                  style={{ textDecoration: 'none' }}
                >
                  070-2616-1188
                </a>
              </p>
              <p className="text-xs md:text-base text-gray-700">
                <span className="font-bold">受付時間:</span> 9:00 〜 18:00
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm md:text-lg text-gray-700 font-semibold mb-4 md:mb-6">フォームからのお問い合わせはこちら</p>
              <a
                href={CONTACT_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-48 md:w-64 h-11 md:h-12 items-center justify-center bg-[#BFAE8A] text-white font-bold rounded-md shadow hover:bg-[#A4936A] transition-colors text-sm md:text-base"
              >
                お問い合わせ
              </a>
            </div>
          </div>
        </div>
      </div>
    </FadeTransitionWrapper>
  )
}

export default ContactPage