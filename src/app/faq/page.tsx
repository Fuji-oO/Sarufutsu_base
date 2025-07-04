"use client";
import { useState } from "react";

const FAQ_CATEGORIES = [
  { key: "stay", label: "ご宿泊に関して" },
  { key: "meal", label: "お食事に関して" },
  { key: "facility", label: "設備に関して" },
  { key: "service", label: "サービスに関して" },
];

const FAQ_LIST = {
  stay: [
    {
      q: "チェックイン・チェックアウトの時間は何時ですか？",
      a: "チェックインは15:00〜20:00、チェックアウトは10:00までとなっております。20時以降のご到着やお時間のご変更がある場合は事前にご連絡ください。",
    },
    {
      q: "宿泊料金の支払い方法は何がありますか？",
      a: "お支払いは現金のみとなっております。クレジットカードやQRコード決済等はご利用いただけませんので、あらかじめご了承ください。",
    },
    {
      q: "ペットの同伴は可能ですか？",
      a: "基本的にペットの同伴はご遠慮いただいておりますが、特別な事情がある場合は事前にご相談ください。",
    },
    {
      q: "子ども連れでも宿泊できますか？",
      a: "はい、お子さま連れのお客様も大歓迎です。予約状況やご宿泊人数次第では貸切も可能ですので、ご家族で安心してご利用いただけます。",
    },
    {
      q: "1人でも宿泊できますか？",
      a: "もちろんです。お一人様でのご宿泊も大歓迎ですので、どうぞごゆっくりお過ごしください。",
    },
    {
      q: "キャンセルポリシーはどうなっていますか？",
      a: "ご予約のキャンセルにつきましては、2日前まで30％、前日50％、当日やご連絡なしの場合は100％のキャンセル料を頂戴しております。ご予定に変更がある場合はお早めにご連絡ください。",
    },
    {
      q: "深夜のチェックインは可能ですか？",
      a: "通常のチェックインは20時までですが、やむを得ず遅くなる場合は事前にご連絡ください。",
    },
    {
      q: "連泊時の客室清掃はありますか？",
      a: "連泊中の客室清掃は3泊以上からとなります。ご希望の場合はご相談ください。",
    },
    {
      q: "門限はありますか？",
      a: "特に門限は設けておりませんが、深夜の出入りは他のお客様のご迷惑にならないようご配慮ください。",
    },
  ],
  meal: [
    {
      q: "食事の提供はありますか？",
      a: "お食事の提供は行っておりませんが、キッチンでの自炊や外食をお楽しみいただけます。",
    },
    {
      q: "近くに飲食店やスーパーはありますか？",
      a: "近隣に飲食店やスーパーはございますが、19時ごろにはすべて閉店してしまうため、お食事やお飲み物等は事前のご用意をおすすめしております。なお、車で10分ほどの場所に、セイコーマート(コンビニ)がございます。※詳細はチェックイン時にご案内いたします。",
    },
    {
      q: "食事や飲み物の持ち込みはできますか？",
      a: "はい、ご自由にお持ち込みいただけます。キッチンもご利用いただけますので、どうぞご活用ください。",
    },
    {
      q: "自動販売機はありますか？",
      a: "恐れ入りますが、館内に自動販売機はございません。近隣の設置場所をご案内できますので、お気軽にお尋ねください。",
    },
    {
      q: "おすすめの地元の食材はありますか？",
      a: "猿払村は新鮮なホタテや蟹、鮭などの海産物が有名です。地元の味をぜひお楽しみください。",
    },
  ],
  facility: [
    {
      q: "駐車場はありますか？",
      a: "敷地内に無料の駐車スペースをご用意しております。ご予約不要でご利用いただけます。",
    },
    {
      q: "共有スペースはありますか？どんな設備がありますか？",
      a: "はい、リビングやキッチン、ベランダなどの共有スペースがございます。",
    },
    {
      q: "洗濯機や乾燥機は使えますか？",
      a: "洗濯機はスタッフ専用となっており、お客様のご利用はご遠慮いただいております。",
    },
    {
      q: "浴室の時間制限はありますか？",
      a: "バスルームは23:00〜翌5:00の間はご利用いただけません。ご協力をお願いいたします。",
    },
    {
      q: "キッチンの時間制限はありますか？",
      a: "キッチンは23:00〜翌5:00の間、コンロとシンクのご利用はできませんが、それ以外はご自由にお使いいただけます。",
    },
    {
      q: "冷暖房設備は各客室にありますか？",
      a: "各客室に冷房設備はございませんが、暖房設備はございます。",
    },
    {
      q: "Wi-Fiは利用できますか？",
      a: "はい、館内全体で無料Wi-Fiをご利用いただけます。接続方法は館内掲示をご覧ください。",
    },
    {
      q: "各部屋にコンセントはありますか？",
      a: "はい、各お部屋にコンセントをご用意しております。",
    },
    {
      q: "アメニティ（タオル、歯ブラシなど）は用意されていますか？",
      a: "タオルと歯ブラシのご用意がございます。その他のアメニティは必要に応じてご持参ください。",
    },
    {
      q: "貴重品の保管場所はありますか？",
      a: "貴重品はご自身で管理をお願いいたします。専用ロッカー等はございませんので、十分ご注意ください。",
    },
    {
      q: "薪ストーブは使用可能ですか？",
      a: "冬季期間中のみご利用いただけます。ただし、火災や煙害の防止のため、薪ストーブの着火や薪の追加などの操作はすべてスタッフが行います。ご希望の際は、お気軽にスタッフまでお声掛けください。",
    },
  ],
  service: [
    {
      q: "お部屋の清掃やシーツ交換はありますか？",
      a: "お部屋の清掃はやシーツ交換は、4泊以上のご滞在の場合に限り、3日ごとに行います。それ以外の日程で清掃をご希望の際は有償となります。ご希望の際は、お気軽にお声掛けください。",
    },
    {
      q: "荷物の預かりサービスはありますか？チェックイン前後でも可能ですか？",
      a: "はい、お荷物のお預かりも承っております。チェックイン前後でご希望の場合は前日までにご相談ください。",
    },
    {
      q: "観光案内やマップの提供はありますか？",
      a: "はい、観光マップや周辺情報をご用意しております。お気軽にお声がけください。",
    },
    {
      q: "送迎サービスはありますか？",
      a: "送迎サービスは行っておりませんが、交通手段などご不明な点はご案内いたします。",
    },
    {
      q: "地元の体験ツアーの手配はしてもらえますか？",
      a: "体験ツアーの手配は行っておりませんが、地元のおすすめスポットや体験情報はご案内可能です。",
    },
    {
      q: "宅配便の受取・発送は可能ですか？",
      a: "恐れ入りますが、宅配便の受け取りおよび発送は承っておりません。",
    },
  ],
};

export default function FAQPage() {
  const [active, setActive] = useState("stay");
  const [fade, setFade] = useState(true);

  const handleTab = (key: string) => {
    setFade(false);
    setTimeout(() => {
      setActive(key);
      setFade(true);
    }, 200);
  };

  return (
    <div className="min-h-screen pt-16 pb-16 md:py-[120px] px-2 md:px-0" style={{ background: '#f5eedc' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-center" style={{letterSpacing:'0.1em', color:'#000'}}>FAQ</h1>
        <div className="text-xs md:text-base text-center mb-6 md:mb-12" style={{letterSpacing:'0.1em'}}>- よくあるご質問 -</div>
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow py-4 md:py-8 px-2 md:px-6">
            <div className="grid grid-cols-2 gap-2 mb-8 md:mb-16 md:flex md:flex-wrap md:justify-center md:gap-4">
            {FAQ_CATEGORIES.map(cat => (
                <button
                key={cat.key}
                className={`px-2 md:px-4 py-2 text-xs md:text-lg font-semibold border-b-2 md:border-b-2 transition-all duration-200 rounded md:rounded-none
                  ${active === cat.key
                    ? 'border-[#bfae8a] text-black font-bold bg-[#f5eedc] md:bg-transparent'
                    : 'border-transparent text-gray-500 hover:text-black bg-white md:bg-transparent'}
                `}
                onClick={() => handleTab(cat.key)}
                >
                {cat.label}
                </button>
            ))}
            </div>
            <div className={`transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}> 
            <section>
                <h2 className="text-sm md:text-xl font-bold mb-2 md:mb-6">【{FAQ_CATEGORIES.find(c => c.key === active)?.label}】</h2>
                <div>
                {FAQ_LIST[active].map((item, idx) => (
                    <div key={`${active}-${idx}`} className="py-4 md:py-8" style={idx !== FAQ_LIST[active].length - 1 ? { borderBottom: '1px solid #bfae8a' } : {}}>
                    <div className="mb-1 md:mb-2 flex items-start">
                        <span className="font-serif text-lg md:text-2xl mr-2">Q</span>
                        <span className="text-sm md:text-lg font-bold">{item.q}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="font-serif text-base md:text-xl mr-2">A</span>
                        <span className="text-xs md:text-base text-gray-700 leading-relaxed">{item.a}</span>
                    </div>
                    </div>
                ))}
                </div>
            </section>
            </div>
        </div>
      </div>
    </div>
  );
} 