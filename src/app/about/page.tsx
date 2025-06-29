export default function AboutPage() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center relative"
      style={{
        backgroundImage: "url('/images/F2D672C95457493BBA6F316D8F95B4E3_LL.webp')",
      }}
    >
      {/* 霞エフェクト */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 60% 40%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 60%, rgba(255,255,255,0.12) 100%)',
        mixBlendMode: 'lighten',
      }} />
      {/* 右側フェードグラデーション */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(245,238,220,0.25) 48%, #F5EEDC 100%)',
      }} />
      <div className="w-full flex flex-row justify-between items-start px-20 py-32 gap-8 relative" style={{maxWidth:'1600px',margin:'0 auto',zIndex:2}}>
        {/* 左側 タイトル */}
        <div className="flex-1 flex items-start">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg text-center" style={{color:'#333333'}}>
            'さるふつbase'について
          </h1>
        </div>
        {/* 右側 コンセプト本文 */}
        <div className="flex-1 max-w-2xl rounded-lg p-10">
          <p className="text-gray-800 leading-relaxed whitespace-pre-line mt-4">
            日本最北の村、猿払。<br />
            広がる湿原や草原、どこまでも続く空と海。<br />
            そんな雄大な自然の中で、力強く暮らす人たちがいます。<br /><br />

            「さるふつbase」は、この自然に囲まれた1日1〜2組限定のゲストハウス。<br />
            貸切もできて、静けさの中でゆったりとした時間が過ごせます。<br /><br />

            でも、ここはただの“宿”ではありません。<br />
            地域の人がふらっと立ち寄って、お茶を飲んだりおしゃべりしたり。<br />
            ときにはイベントやワークショップも開かれ、人々の交流が生まれる場所です。<br /><br />

            あたたかなつながりや、人との距離の近さ――<br />
            どこか懐かしい感覚が、ここには残っています。<br /><br />

            北の風を感じながら、少しだけ深呼吸して、<br />
            日常を忘れるようなひとときを過ごしてみませんか？<br />
          </p>
        </div>
      </div>
    </div>
  )
} 