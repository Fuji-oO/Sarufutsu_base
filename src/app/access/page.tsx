import React from 'react'

export default function AccessPage() {
  return (
    <div className="min-h-screen py-[120px] px-4" style={{ background: '#F5EEDC' }}>
      <h1 className="text-4xl font-bold mb-4 text-center"style={{letterSpacing:'0.1em'}}>Access</h1>
      <p className="text-ml text-center mb-20" style={{letterSpacing:'0.1em'}}>- アクセス -</p>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Google Map埋め込み */}
        <div>
          <iframe
            src="https://www.google.com/maps?q=45.329215,142.112069&z=17&output=embed"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="さるふつbase Google Map"
          ></iframe>
        </div>
        {/* 施設情報 */}
        <div>
          <table className="w-full text-base">
            <tbody>
              <tr>
                <td className="align-top pr-4 py-8 font-bold">住所</td>
                <td className="py-8">〒098-6233　北海道宗谷郡猿払村鬼志別南町176</td>
              </tr>
              <tr>
                <td className="align-top pr-4 pb-8 font-bold">駐車場</td>
                <td className="pb-8">さるふつbaseの入口前に1台と、<br />隣接する空き地に3台ほど車を駐車できるスペースがございます。<br />ぜひご利用ください。</td>
              </tr>
              <tr>
                <td className="align-top pr-4 pb-8 font-bold min-w-[130px]">チェックイン</td>
                <td className="pb-8">15:00 – 20:00<br />※20:00以降や時間変更の際は、事前にご連絡ください。</td>
              </tr>
              <tr>
                <td className="align-top pr-4 pb-8 font-bold min-w-[130px]">チェックアウト</td>
                <td className="pb-8">10:00</td>
              </tr>
              <tr>
                <td className="align-top pr-4 font-bold">マップ</td>
                <td>
                  <a
                    href="https://maps.google.com/?q=45.329215,142.112069"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline inline-flex items-center"
                  >
                    Google Mapで見る ↗
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="max-w-4xl mx-auto pt-24 text-center text-ml leading-relaxed bg-[#FEFDFC]" style={{border: '2px solid #bfae8a', borderRadius: '16px', marginTop: '48px', padding: '40px 24px'}}>
        <p>
          現地へお越しの際は、基本的にお車またはバイク等にてお越しいただくようご案内しております。<br />
          公共交通機関をご利用の場合は、稚内駅からバスまたはレンタカーのご利用をおすすめいたします。
        </p>
        <p className="mt-8">
          なお、冬期は積雪や路面の凍結がございますので、冬用装備を万全にしてお出かけください。
        </p>
      </div>
    </div>
  )
} 