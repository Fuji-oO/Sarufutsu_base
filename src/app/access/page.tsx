import React from 'react'

export default function AccessPage() {
  return (
    <div className="min-h-screen py-16 md:py-[120px] px-2 md:px-4" style={{ background: '#F5EEDC' }}>
      <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-center" style={{letterSpacing:'0.1em'}}>Access</h1>
      <p className="text-xs md:text-base text-center mb-6 md:mb-20" style={{letterSpacing:'0.1em'}}>- アクセス -</p>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start">
        {/* Google Map埋め込み（PCのみ表示） */}
        <div className="hidden md:block">
          <iframe
            src="https://www.google.com/maps?q=45.329215,142.112069&z=17&output=embed"
            width="100%"
            className="h-[250px] md:h-[400px] rounded-lg"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="さるふつbase Google Map"
          ></iframe>
        </div>
        {/* 施設情報 */}
        <div>
          <table className="w-full text-sm md:text-base">
            <tbody>
              <tr>
                <td className="align-top pl-3 md:pl-0 pr-2 md:pr-4 py-3 md:py-8 font-bold whitespace-nowrap">住所</td>
                <td className="py-3 md:py-8">〒098-6233<br />北海道宗谷郡猿払村鬼志別南町176</td>
              </tr>
              <tr>
                <td className="align-top pl-3 md:pl-0 pr-2 md:pr-4 pb-3 md:pb-8 font-bold whitespace-nowrap">駐車場</td>
                <td className="pb-3 md:pb-8">
                  <span className="block md:hidden">
                    さるふつbaseの入口前に1台と、<br />隣接する空き地に3台ほど車を駐車できる<br />スペースがございます。ぜひご利用ください。
                  </span>
                  <span className="hidden md:block">
                    さるふつbaseの入口前に1台と、<br />隣接する空き地に3台ほど車を駐車できるスペースがございます。<br />ぜひご利用ください。
                  </span>
                </td>
              </tr>
              <tr>
                <td className="align-top pl-3 md:pl-0 pr-2 md:pr-4 pb-3 md:pb-8 font-bold min-w-[90px] md:min-w-[130px] whitespace-nowrap">チェックイン</td>
                <td className="pb-3 md:pb-8">
                  15:00 – 20:00<br />
                  <span className="block md:hidden text-xs text-gray-600">※20:00以降や時間変更の際は、<br />　事前にご連絡ください。</span>
                  <span className="hidden md:block text-base text-gray-600">※20:00以降や時間変更の際は、事前にご連絡ください。</span>
                </td>
              </tr>
              <tr>
                <td className="align-top pl-3 md:pl-0 pr-2 md:pr-4 pb-3 md:pb-8 font-bold min-w-[90px] md:min-w-[130px] whitespace-nowrap">チェックアウト</td>
                <td className="pb-3 md:pb-8">10:00</td>
              </tr>
              <tr>
                <td className="align-top pl-3 md:pl-0 pr-2 md:pr-4 font-bold whitespace-nowrap">マップ</td>
                <td>
                  <a
                    href="https://maps.google.com/?q=45.329215,142.112069"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline inline-flex items-center text-xs md:text-base"
                  >
                    Google Mapで見る ↗
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          {/* Google Map埋め込み（スマホのみ表示） */}
          <div className="block md:hidden mt-6">
            <iframe
              src="https://www.google.com/maps?q=45.329215,142.112069&z=17&output=embed"
              width="100%"
              className="h-[250px] rounded-lg"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="さるふつbase Google Map"
            ></iframe>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto pt-10 md:pt-50 text-center text-xs md:text-base leading-relaxed bg-[#FEFDFC]" style={{border: '2px solid #bfae8a', borderRadius: '16px', marginTop: '24px', padding: '20px 8px', boxSizing: 'border-box'}}>
        <span className="block md:hidden">
          <p>
            現地へお越しの際は、基本的にお車またはバイク等にて<br />お越しいただくようご案内しております。
          </p>
          <p className="mt-4">
            公共交通機関をご利用の場合は、<br />稚内駅からバスまたはレンタカーのご利用をおすすめいたします。
          </p>
          <p className="mt-4">
            冬期は積雪・凍結にご注意のうえ、冬用装備でお越しください。
          </p>
        </span>
        <span className="hidden md:block">
          <p>
            現地へお越しの際は、基本的にお車またはバイク等にてお越しいただくようご案内しております。<br />
            公共交通機関をご利用の場合は、稚内駅からバスまたはレンタカーのご利用をおすすめいたします。
          </p>
          <p className="mt-8">
            なお、冬期は積雪や路面の凍結がございますので、冬用装備を万全にしてお出かけください。
          </p>
        </span>
      </div>
    </div>
  )
} 