import React from 'react'

const SpendPage = () => {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/稚内観光_宗谷丘陵宗谷岬牧場_稚内市提供.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full mx-auto px-60 py-[120px] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* 左カラム：キャッチコピー */}
        <div className="flex flex-col items-start h-full">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-8" style={{letterSpacing:'0.08em'}}>
            北の大地で、<br className="hidden md:block" />
            心ほどけるひとときを。
          </h1>
        </div>
        {/* 右カラム：テキストボックス */}
        <div className="flex items-center justify-center">
          <div className=" text-base md:text-lg text-white leading-relaxed max-w-[850px] pt-12">
            潮風に包まれる海辺の風景、
            果てしなくまっすぐに続くエサヌカ線、<br />
            そして静寂の中に息づく雄大な自然。<br /><br />
            猿払村には、日常からそっと離れ、<br />
            心と体を整える時間が広がっています。<br /><br />
            都会の喧騒を忘れて、大切な人と、あるいはひとりで、<br />
            自分らしく過ごす時間。<br /><br />
            この場所だからこそ出会える、
            特別な体験と穏やかな時間を、<br />ぜひお楽しみください。
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpendPage 