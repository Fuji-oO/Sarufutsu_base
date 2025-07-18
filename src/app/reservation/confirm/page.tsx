"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FadeTransitionWrapper from '../../../components/FadeTransitionWrapper';

const notesList = [
　'1. チェックイン・チェックアウトについて\nチェックインは 15:00〜20:00まで、チェックアウトは 10:00までです。\n※20:00以降になる場合や時間変更の際は、必ず事前にご連絡ください。',
  '2. キャンセルポリシー\n3日前まで：無料\n2日前：宿泊料金の30％\n前日：宿泊料金の50％\n当日及び不泊：宿泊料金の100％\n※キャンセルはメールまたは電話にてご連絡ください。',
  '3. 宿泊費のお支払い\n宿泊費のお支払いは現金のみとなります。ご了承ください。',
  '4. 禁煙・騒音\n館内は全て禁煙です。電子タバコもご利用いただけません。\n深夜22時以降は他のお客様への配慮のため、静かにお過ごしください。\n騒音・迷惑行為がある場合はご退室いただく場合がございます。',
  '5. ペット・動物\nペットの同伴はお断りしております。',
  '6. 貴重品・盗難について\n貴重品の管理はお客様ご自身でお願いいたします。\n万一の盗難・紛失について当施設では責任を負いかねます。',
  '7. 宿泊人数の制限\n予約された人数を超えてのご宿泊はできません。\nチェックイン時に身分証のご提示をお願いする場合があります。',
  '8. 客室清掃\n4泊以上のご滞在の場合は、3日ごとに客室清掃を行っております。\nそれ以外の日程で清掃をご希望の際は、1回3,000円にて承ります。\n（清掃には2時間程度お時間をいただいております）',
  '9. 近隣店舗について\n徒歩圏内の飲食店・商店は19時頃にはすべて閉店いたします。\n必要な飲食物は事前準備か早めの購入をおすすめします。',
  '10. 緊急連絡先\n滞在中にトラブルや緊急事態があった場合は、以下までご連絡ください。\n携帯：070-2616-1188',
];

export default function ReservationConfirmPageWrapper() {
  return (
    <Suspense>
      <ReservationConfirmPage />
    </Suspense>
  );
}

function ReservationConfirmPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [form, setForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: '',
    roomType: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
    adultMale: '',
    adultFemale: '',
    child: '',
    checkInTime: '',
  });
  const [showThanks, setShowThanks] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [thanksVisible, setThanksVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const confirmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setForm({
      checkIn: params.get('checkIn') || '',
      checkOut: params.get('checkOut') || '',
      guests: params.get('guests') || '',
      roomType: params.get('roomType') || '',
      name: params.get('name') || '',
      email: params.get('email') || '',
      phone: params.get('phone') || '',
      notes: params.get('notes') || '',
      adultMale: params.get('adultMale') || '',
      adultFemale: params.get('adultFemale') || '',
      child: params.get('child') || '',
      checkInTime: params.get('checkInTime') || '',
    });
  }, [params]);

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || '送信に失敗しました。時間をおいて再度お試しください。');
      setFadeOut(true);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setShowThanks(true);
        setTimeout(() => {
          setThanksVisible(true);
        }, 200); // スクロール後0.2秒待ってからフェードイン
      }, 600); // フェードアウト時間
    } catch (e: any) {
      setError('予期せぬエラーが発生しました。時間をおいて再度お試しいただくか、sarufutsu.base@gmail.comまでご連絡ください。');
    } finally {
      setLoading(false);
    }
  };

  // 料金計算用関数
  function parseDate(str: string) {
    if (!str) return null;
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  function getStayNights() {
    const inDate = parseDate(form.checkIn);
    const outDate = parseDate(form.checkOut);
    if (!inDate || !outDate) return 0;
    const diff = (outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.round(diff));
  }
  function countHeatingNights() {
    const inDate = parseDate(form.checkIn);
    const outDate = parseDate(form.checkOut);
    if (!inDate || !outDate) return 0;
    let d = new Date(inDate.getTime());
    let count = 0;
    while (d < outDate) {
      const m = d.getMonth() + 1;
      const day = d.getDate();
      if ((m === 10 && day >= 1) || (m === 11) || (m === 12) || (m >= 1 && m <= 5)) {
        if (!(m === 5 && day > 31)) count++;
      }
      d.setDate(d.getDate() + 1);
    }
    return count;
  }
  const stayNights = getStayNights();
  const totalGuests = Number(form.adultMale || 0) + Number(form.adultFemale || 0) + Number(form.child || 0);
  const totalAdult = Number(form.adultMale || 0) + Number(form.adultFemale || 0);
  const totalChild = Number(form.child || 0);

  // --- 7月限定セール対応 ---
  function isJuly2025(date: Date) {
    return date.getFullYear() === 2025 && date.getMonth() === 6;
  }
  function getStayDates() {
    const inDate = parseDate(form.checkIn);
    const outDate = parseDate(form.checkOut);
    if (!inDate || !outDate) return [];
    const dates = [];
    let d = new Date(inDate.getTime());
    while (d < outDate) {
      dates.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return dates;
  }
  const stayDates = getStayDates();
  let basePrice = 0;
  let priceDetail = null;
  let julyAdultNights = 0, julyChildNights = 0, julyKashikiriNights = 0;
  let normalAdultNights = 0, normalChildNights = 0, normalKashikiriNights = 0;
  if (form.roomType === '貸切') {
    stayDates.forEach(date => {
      if (isJuly2025(date)) {
        julyKashikiriNights++;
      } else {
        normalKashikiriNights++;
      }
    });
    basePrice = 38500 * julyKashikiriNights + 44000 * normalKashikiriNights;
    priceDetail = <>
      {julyKashikiriNights > 0 && (
        <li>
          貸切 × {julyKashikiriNights}泊 × <span className="text-red-600 font-bold">38,500円</span> = <span className="text-red-600 font-bold">{(38500 * julyKashikiriNights).toLocaleString()}円</span> <span className="text-red-600 font-bold">【7月限定セール価格適用】</span>
        </li>
      )}
      {normalKashikiriNights > 0 && (
        <li>
          貸切 × {normalKashikiriNights}泊 × 44,000円 = {(44000 * normalKashikiriNights).toLocaleString()}円
        </li>
      )}
    </>;
  } else {
    stayDates.forEach(date => {
      if (isJuly2025(date)) {
        julyAdultNights += Number(form.adultMale || 0) + Number(form.adultFemale || 0);
        julyChildNights += Number(form.child || 0);
      } else {
        normalAdultNights += Number(form.adultMale || 0) + Number(form.adultFemale || 0);
        normalChildNights += Number(form.child || 0);
      }
    });
    const baseAdultJuly = julyAdultNights * 7700;
    const baseChildJuly = julyChildNights * 3850;
    const baseAdultNormal = normalAdultNights * 9900;
    const baseChildNormal = normalChildNights * 4950;
    basePrice = baseAdultJuly + baseChildJuly + baseAdultNormal + baseChildNormal;
    priceDetail = <>
      {julyAdultNights > 0 && (
        <li>
          大人 {Number(form.adultMale || 0) + Number(form.adultFemale || 0)}名 × {julyAdultNights / ((Number(form.adultMale || 0) + Number(form.adultFemale || 0)) || 1)}泊 × <span className="text-red-600 font-bold">7,700円</span> = <span className="text-red-600 font-bold">{baseAdultJuly.toLocaleString()}円</span> <span className="text-red-600 font-bold">【7月限定セール価格適用】</span>
        </li>
      )}
      {normalAdultNights > 0 && (
        <li>
          大人 {Number(form.adultMale || 0) + Number(form.adultFemale || 0)}名 × {normalAdultNights / ((Number(form.adultMale || 0) + Number(form.adultFemale || 0)) || 1)}泊 × 9,900円 = {(baseAdultNormal).toLocaleString()}円
        </li>
      )}
      {julyChildNights > 0 && (
        <li>
          子供 {Number(form.child || 0)}名 × {julyChildNights / (Number(form.child || 0) || 1)}泊 × <span className="text-red-600 font-bold">3,850円</span> = <span className="text-red-600 font-bold">{baseChildJuly.toLocaleString()}円</span> <span className="text-red-600 font-bold">【7月限定セール価格適用】</span>
        </li>
      )}
      {normalChildNights > 0 && (
        <li>
          子供 {Number(form.child || 0)}名 × {normalChildNights / (Number(form.child || 0) || 1)}泊 × 4,950円 = {(baseChildNormal).toLocaleString()}円
        </li>
      )}
    </>;
  }
  const heatingNights = countHeatingNights();
  const heatingFee = totalGuests * 550 * heatingNights;
  const totalPrice = basePrice + heatingFee;
  const [showDetails, setShowDetails] = useState(false);

  return (
    <FadeTransitionWrapper>
      <div className="min-h-screen flex items-center justify-center pt-8 pb-16 md:py-[120px]" style={{background:'#F5EEDC'}}>
        <div
          className={`max-w-3xl w-full bg-white rounded-lg shadow-lg p-4 md:p-8 mx-2 md:mx-4 transition-opacity duration-700 ${fadeOut && !showThanks ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          style={{ transitionDuration: '700ms' }}
        >
          {showThanks ? (
            <div
              className={`flex flex-col items-center justify-center min-h-[40vh] transition-opacity duration-800 ${thanksVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDuration: '800ms' }}
            >
              <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center">ご予約ありがとうございます</h1>
              <p className="mb-6 md:mb-10 text-center text-xs md:text-base text-gray-800">
                送信いただいた内容を確認のうえ、こちらから改めてご連絡差し上げます。<br />
                恐れ入りますが、今しばらくお待ちくださいませ。
              </p>
              <button
                className="w-full max-w-xs bg-[#BFAE8A] text-white py-2 md:py-3 rounded-md font-bold hover:bg-[#A4936A] transition-colors text-sm md:text-base"
                onClick={() => router.push('/')}
              >
                トップページに戻る
              </button>
            </div>
          ) : (
            <div ref={confirmRef}>
              <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center">予約内容の確認</h1>
              <div className="space-y-2 md:space-y-4 mb-4 md:mb-8 text-xs md:text-base">
                <div><span className="font-bold">チェックイン日：</span>{form.checkIn}</div>
                <div><span className="font-bold">チェックアウト日：</span>{form.checkOut}</div>
                <div><span className="font-bold">チェックイン予定時間：</span>{form.checkInTime}</div>
                <div><span className="font-bold">宿泊人数：</span>{form.guests}名</div>
                <div><span className="font-bold">大人(男性)：</span>{form.adultMale || '0'}名</div>
                <div><span className="font-bold">大人(女性)：</span>{form.adultFemale || '0'}名</div>
                <div><span className="font-bold">子供：</span>{form.child || '0'}名</div>
                <div><span className="font-bold">部屋タイプ：</span>{form.roomType}</div>
                <div><span className="font-bold">お名前：</span>{form.name}</div>
                <div><span className="font-bold">メールアドレス：</span>{form.email}</div>
                <div><span className="font-bold">電話番号：</span>{form.phone}</div>
                <div><span className="font-bold">ご要望/ご質問：</span>{form.notes}</div>
              </div>
              {/* 料金合計表示 */}
              <div className="my-4 md:my-8 text-center">
                <div className="inline-block bg-[#fff] rounded-lg px-4 md:px-6 py-2 md:py-4 shadow text-base md:text-lg font-bold text-gray-800 max-w-lg w-full border-2" style={{ borderColor: '#BFAE8A' }}>
                  料金合計：
                  <span className="text-lg md:text-2xl text-gray-800 ml-2">{totalPrice.toLocaleString()}円 <span className="text-base md:text-lg text-gray-800">(税込)</span></span>
                  <div className="mt-2 md:mt-3 text-center font-normal">
                    <button
                      type="button"
                      className="text-xs text-[#BFAE8A] underline hover:opacity-80 font-bold focus:outline-none"
                      onClick={() => setShowDetails(v => !v)}
                    >
                      料金明細 {showDetails ? '▲' : '▼'}
                    </button>
                    {showDetails && (
                      <div className="mt-2 text-xs text-gray-700">
                        <ul className="list-disc list-inside space-y-1 text-left inline-block">
                          {priceDetail}
                          {heatingFee > 0 && (
                            <li>暖房費 {totalGuests}名 × {heatingNights}泊 × 550円 = {heatingFee.toLocaleString()}円</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-4 md:mb-6">
                {/* スマホ用注意書き */}
                <div className="block md:hidden mb-8 text-red-700 font-semibold text-center text-xs">
                  上記のご予約はまだ確定しておりません。<br />
                  送信いただいた内容を確認のうえ、<br />
                  こちらから改めてご連絡差し上げます。<br />
                  恐れ入りますが、今しばらくお待ちくださいませ。
                </div>
                {/* PC用注意書き */}
                <div className="hidden md:block mb-4 md:mb-8 text-red-700 font-semibold text-center text-base">
                  上記のご予約はまだ確定しておりません。<br />
                  送信いただいた内容を確認のうえ、こちらから改めてご連絡差し上げます。<br />
                  恐れ入りますが、今しばらくお待ちくださいませ。
                </div>
                <h2 className="text-base md:text-xl font-bold mb-2 md:mb-4">注意事項</h2>
                <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
                  {notesList.map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="whitespace-pre-line">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-center mt-6 md:mt-8 mb-6 md:mb-6">
                <input
                  type="checkbox"
                  id="agree"
                  checked={checked}
                  onChange={e => setChecked(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="agree" className="text-xs md:text-sm">注意事項を確認しました</label>
              </div>
              {/* スマホ用規約同意文 */}
              <div className="block md:hidden mb-4 text-center text-xs text-gray-700">
                <a href="/policy" className="underline text-blue-700 hover:text-blue-900" target="_blank" rel="noopener noreferrer">利用規約</a>、
                <a href="/terms" className="underline text-blue-700 hover:text-blue-900" target="_blank" rel="noopener noreferrer">宿泊約款</a>、
                及び
                <a href="/privacy" className="underline text-blue-700 hover:text-blue-900" target="_blank" rel="noopener noreferrer">プライバシーポリシー</a>
                を確認した上で内容に同意します。<br />
                入力情報と質問の回答はご予約宿泊施設に提供されます。
              </div>
              {/* PC用規約同意文 */}
              <div className="hidden md:block mb-2 md:mb-4 text-center text-xs text-gray-700">
                <a href="/policy" className="underline text-blue-700 hover:text-blue-900" target="_blank" rel="noopener noreferrer">利用規約</a>、
                <a href="/terms" className="underline text-blue-700 hover:text-blue-900" target="_blank" rel="noopener noreferrer">宿泊約款</a>、
                及び
                <a href="/privacy" className="underline text-blue-700 hover:text-blue-900" target="_blank" rel="noopener noreferrer">プライバシーポリシー</a>
                を確認した上で内容に同意します。<br />
                入力情報と質問の回答はご予約宿泊施設に提供されます。
              </div>
              <div className="flex flex-col items-center gap-1 md:gap-0">
                <button
                  className={`w-40 md:w-full text-white py-2 md:py-3 rounded-md font-bold transition-colors text-sm md:text-base ${!checked || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#A4936A]'} mx-auto`}
                  style={{ background: '#BFAE8A' }}
                  disabled={!checked || loading}
                  onClick={handleConfirm}
                >
                  {loading ? '送信中...' : '送信'}
                </button>
                {error && (
                  <div className="text-center text-red-600 text-xs md:text-sm mt-2">{error}</div>
                )}
                <button
                  type="button"
                  className="w-40 md:w-full mt-2 md:mt-4 py-2 md:py-3 rounded-md font-bold border text-sm md:text-base mx-auto"
                  style={{ background: '#fff', borderColor: '#BFAE8A', color: '#BFAE8A', borderWidth: '2px' }}
                  onClick={() => router.back()}
                >
                  戻る
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </FadeTransitionWrapper>
  );
} 