'use client'

import React, { useState, useMemo } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useRouter } from 'next/navigation'

// サンプル空室状況データ
const availability: Record<string, { Room1: boolean, Room2: boolean }> = {
  '2025-05-24': { Room1: true, Room2: true },
  '2025-05-25': { Room1: true, Room2: false },
  '2025-05-26': { Room1: false, Room2: true },
  '2025-05-27': { Room1: true, Room2: true },
  '2025-05-28': { Room1: true, Room2: true },
  '2025-05-29': { Room1: false, Room2: false },
  '2025-05-30': { Room1: true, Room2: true },
};

const guestOptions = [1,2,3,4,5];
const roomTypeLabels = { Room1: 'Room1（定員3名）', Room2: 'Room2（定員2名）', '貸切': '貸切（定員5名）' };

function getAvailableRoomTypes(guestCount: number, availability: Record<string, { Room1: boolean, Room2: boolean }>) {
  const roomTypes = new Set<string>();
  for (let date in availability) {
    const r1 = availability[date].Room1;
    const r2 = availability[date].Room2;
    if (guestCount <= 2) {
      if (r1) roomTypes.add('Room1');
      if (r2) roomTypes.add('Room2');
      if (r1 && r2) roomTypes.add('貸切'); // 1人でも貸切選択可
    } else if (guestCount === 3) {
      if (r1) roomTypes.add('Room1');
      if (r1 && r2) roomTypes.add('貸切');
    } else if (guestCount >= 4 && r1 && r2) {
      roomTypes.add('貸切');
    }
  }
  return Array.from(roomTypes);
}

function checkRoomAvailable(date: string, roomType: string, availability: Record<string, { Room1: boolean, Room2: boolean }>) {
  const r1 = availability[date]?.Room1;
  const r2 = availability[date]?.Room2;
  switch (roomType) {
    case 'Room1': return r1;
    case 'Room2': return r2;
    case '貸切': return r1 && r2;
    default: return false;
  }
}

function getValidDateList(roomType: string, availability: Record<string, { Room1: boolean, Room2: boolean }>) {
  // 予約可能な日付（文字列配列）
  return Object.keys(availability).filter(date => checkRoomAvailable(date, roomType, availability));
}

// 日付をyyyy-mm-ddでローカル取得
function formatYMD(date: Date|null) {
  if (!date) return '';
  return date.toLocaleDateString('sv-SE'); // 'yyyy-mm-dd'形式
}

// 電話番号バリデーション関数
function validatePhone(phone: string) {
  const numeric = phone.replace(/-/g, '');
  if (phone.trim() === '') return '電話番号を入力してください';
  if (!/^[0-9\-]+$/.test(phone)) return '数字とハイフン以外は使用できません';
  if (numeric.length < 10 || numeric.length > 11) return '電話番号は10桁または11桁で入力してください';
  if (!/^(0[5-9]0|0[1-9])/.test(numeric)) return '有効な電話番号を入力してください';
  return null;
}

export default function ReservationPage() {
  const [adultMale, setAdultMale] = useState(0);
  const [adultFemale, setAdultFemale] = useState(0);
  const [child, setChild] = useState(0);
  const [roomType, setRoomType] = useState('');
  const [checkIn, setCheckIn] = useState<Date|null>(null);
  const [checkOut, setCheckOut] = useState<Date|null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showChildTooltip, setShowChildTooltip] = useState(false);
  const [checkInTime, setCheckInTime] = useState('');
  const [guestsError, setGuestsError] = useState('');
  const [roomTypeError, setRoomTypeError] = useState('');
  const [checkInError, setCheckInError] = useState('');
  const [checkOutError, setCheckOutError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();

  // 人数に応じた部屋タイプ候補（大人+子供で判定）
  const availableRoomTypes = useMemo(() => getAvailableRoomTypes(adultMale + adultFemale + child, availability), [adultMale, adultFemale, child]);

  // 部屋タイプに応じた予約可能日
  const validDateList = useMemo(() => roomType ? getValidDateList(roomType, availability) : [], [roomType]);
  const validDateSet = useMemo(() => new Set(validDateList), [validDateList]);

  // カレンダーで選択不可日
  function tileDisabled({date}: {date: Date}) {
    // 今日より前は選択不可、翌日以降は全て選択可
    const today = new Date();
    today.setHours(0,0,0,0);
    return date < today;
  }

  // チェックアウトはチェックイン日+1以降で全日選択可（予約状況は無関係）
  function checkOutTileDisabled({date}: {date: Date}) {
    if (!checkIn) return true;
    const nextDay = new Date(checkIn.getTime());
    nextDay.setDate(nextDay.getDate() + 1);
    return date < nextDay;
  }

  // カレンダーに空室マーク表示
  function tileContent() {
    return null;
  }

  // 部屋タイプ選択時にチェックイン/アウトをリセット
  function handleRoomTypeChange(val: string) {
    setRoomType(val);
    setCheckIn(null);
    setCheckOut(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    setGuestsError('');
    setRoomTypeError('');
    setCheckInError('');
    setCheckOutError('');
    // 電話番号バリデーションを再実行し、エラーがあればセット
    const phoneValidation = validatePhone(phone);
    setPhoneError(phoneValidation ?? '');
    if (phoneValidation) hasError = true;
    if ((adultMale + adultFemale + child) < 1) {
      setGuestsError('宿泊人数を1名以上選択してください。');
      hasError = true;
    } else if ((adultMale + adultFemale) < 1) {
      setGuestsError('大人を1名以上選択してください。');
      hasError = true;
    } else if ((adultMale + adultFemale + child) > 5) {
      setGuestsError('定員を超えています。合計人数を5人以下にしてください。');
      hasError = true;
    }
    if (!roomType) {
      setRoomTypeError('部屋タイプを選択してください。');
      hasError = true;
    }
    if (!checkIn) {
      setCheckInError('チェックイン日を選択してください。');
      hasError = true;
    }
    if (!checkOut) {
      setCheckOutError('チェックアウト日を選択してください。');
      hasError = true;
    }
    if (hasError) return;
    // バリデーション後、クエリパラメータで/confirmに遷移
    const params = new URLSearchParams({
      checkIn: formatYMD(checkIn),
      checkOut: formatYMD(checkOut),
      guests: String(adultMale + adultFemale + child),
      roomType,
      name,
      email,
      phone,
      notes,
      checkInTime,
      adultMale: String(adultMale),
      adultFemale: String(adultFemale),
      child: String(child),
    });
    router.push(`/reservation/confirm?${params.toString()}`);
  };

  // 電話番号バリデーション用
  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setPhone(val);
    setPhoneError(validatePhone(val) ?? '');
  }
  function handlePhoneBlur() {
    setPhoneError(validatePhone(phone) ?? '');
  }

  // お名前・メールアドレスバリデーション
  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setName(val);
    setNameError(val.trim() === '' ? 'お名前を入力してください' : '');
  }
  function handleNameBlur() {
    setNameError(name.trim() === '' ? 'お名前を入力してください' : '');
  }
  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setEmail(val);
    setEmailError(val.trim() === '' ? 'メールアドレスを入力してください' : !/^\S+@\S+\.\S+$/.test(val) ? '有効なメールアドレスを入力してください' : '');
  }
  function handleEmailBlur() {
    setEmailError(email.trim() === '' ? 'メールアドレスを入力してください' : !/^\S+@\S+\.\S+$/.test(email) ? '有効なメールアドレスを入力してください' : '');
  }

  // 人数合計が変わったらguestsを自動更新
  React.useEffect(() => {
      if (adultMale + adultFemale + child > 5) {
      setGuestsError('定員を超えています。人数を5人以下にしてください。');
    } else {
      setGuestsError('');
    }
  }, [adultMale, adultFemale, child]);

  // 宿泊日数計算
  function getStayNights() {
    if (!checkIn || !checkOut) return 0;
    const diff = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.round(diff));
  }

  // 暖房費用が必要な日数をカウント（10/1～5/31のみ）
  function countHeatingNights() {
    if (!checkIn || !checkOut) return 0;
    let d = new Date(checkIn.getTime());
    let count = 0;
    while (d < checkOut) {
      const m = d.getMonth() + 1; // 1-12
      const day = d.getDate();
      // 10/1～12/31, 1/1～5/31
      if ((m === 10 && day >= 1) || (m === 11) || (m === 12) || (m >= 1 && m <= 5)) {
        if (!(m === 5 && day > 31)) count++;
      }
      d.setDate(d.getDate() + 1);
    }
    return count;
  }

  // 金額計算
  const stayNights = getStayNights();
  const totalGuests = adultMale + adultFemale + child;
  const totalAdult = adultMale + adultFemale;
  const totalChild = child;
  let basePrice = 0;
  let priceDetail = null;
  if (roomType === '貸切') {
    basePrice = 44000 * stayNights;
    priceDetail = (
      <li>貸切 × {stayNights}泊 × 44,000円 = {(basePrice).toLocaleString()}円</li>
    );
  } else {
    const baseAdult = totalAdult * 9900 * stayNights;
    const baseChild = totalChild * 4950 * stayNights;
    basePrice = baseAdult + baseChild;
    priceDetail = <>
      <li>大人 {totalAdult}名 × {stayNights}泊 × 9,900円 = {(baseAdult).toLocaleString()}円</li>
      {totalChild > 0 && (
        <li>子供 {totalChild}名 × {stayNights}泊 × 4,950円 = {(baseChild).toLocaleString()}円</li>
      )}
    </>;
  }
  const heatingNights = countHeatingNights();
  const heatingFee = totalGuests * 550 * heatingNights;
  const totalPrice = basePrice + heatingFee;

  return (
    <div className="min-h-screen py-[120px]" style={{background:'#F5EEDC'}}>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4 text-center" style={{letterSpacing:'0.1em', color:'#000'}}>Reservation</h1>
        <p className="text-ml text-center mb-12" style={{letterSpacing:'0.1em'}}>- ご予約 -</p>
        <div className="max-w-3xl mx-auto bg-white bg-opacity-90 rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 人数選択（合計は自動計算） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">宿泊人数</label>
              <div className="flex gap-4 mb-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">大人(男性)</label>
                  <select value={adultMale} onChange={e => { setAdultMale(Number(e.target.value)); setRoomType(''); setCheckIn(null); setCheckOut(null); }} className="w-full p-2 border rounded-md">
                    {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}名</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">大人(女性)</label>
                  <select value={adultFemale} onChange={e => { setAdultFemale(Number(e.target.value)); setRoomType(''); setCheckIn(null); setCheckOut(null); }} className="w-full p-2 border rounded-md">
                    {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}名</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1 flex items-center gap-1">子供
                    <span className="inline-block align-middle relative"
                      onMouseEnter={() => setShowChildTooltip(true)}
                      onMouseLeave={() => setShowChildTooltip(false)}
                      onTouchStart={() => setShowChildTooltip(v => !v)}
                      tabIndex={0}
                      onFocus={() => setShowChildTooltip(true)}
                      onBlur={() => setShowChildTooltip(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16">
                        <circle cx="8" cy="8" r="6.5" fill="#bbb" />
                        <text x="8" y="12" textAnchor="middle" fontSize="9" fill="#fff">i</text>
                      </svg>
                      {showChildTooltip && (
                        <div className="absolute left-1/2 z-50 w-64 -translate-x-1/2 mt-2 px-4 py-2 bg-white border border-gray-300 rounded shadow-lg text-xs text-gray-800 whitespace-pre-line" style={{top:'100%'}}>
                          12歳未満で寝具を利用するお子様の人数をご入力ください。添い寝のお子様は入力不要です。<br />なお、12歳以上は大人の人数となります。
                          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-3 h-3 bg-white border-l border-t border-gray-300 rotate-45"></span>
                        </div>
                      )}
                    </span>
                  </label>
                  <select value={child} onChange={e => { setChild(Number(e.target.value)); setRoomType(''); setCheckIn(null); setCheckOut(null); }} className="w-full p-2 border rounded-md">
                    {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}名</option>)}
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-700">合計: {adultMale + adultFemale + child}名</div>
              {guestsError && <p className="text-red-600 text-sm mt-1">{guestsError}</p>}
            </div>
            {/* 部屋タイプ選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">部屋タイプ</label>
              {availableRoomTypes.length === 0 ? (
                <div className="text-red-600">この人数で予約可能な部屋タイプがありません</div>
              ) : (
                <div className="flex gap-4">
                  {availableRoomTypes.map(type => (
                    <label key={type} className={`px-4 py-2 border rounded cursor-pointer ${roomType === type ? 'bg-blue-200 border-blue-500' : 'bg-white'}`}>
                      <input
                        type="radio"
                        name="roomType"
                        value={type}
                        checked={roomType === type}
                        onChange={() => handleRoomTypeChange(type)}
                        className="mr-2"
                        disabled={availableRoomTypes.length === 0}
                      />
                      {roomTypeLabels[type as keyof typeof roomTypeLabels]}
                    </label>
                  ))}
                </div>
              )}
              {roomTypeError && <p className="text-red-600 text-sm mt-1">{roomTypeError}</p>}
            </div>
            {/* カレンダー */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold mb-4">チェックイン</h2>
                <Calendar
                  onChange={(date) => setCheckIn(date as Date)}
                  value={checkIn}
                  tileDisabled={tileDisabled}
                  tileContent={tileContent}
                  className="w-full"
                />
                <input
                  type="date"
                  value={formatYMD(checkIn)}
                  onChange={e => setCheckIn(e.target.value ? new Date(e.target.value) : null)}
                  className="mt-2 w-full p-2 border rounded-md"
                  min={formatYMD(new Date())}
                  disabled={!roomType || availableRoomTypes.length === 0}
                />
                {checkInError && <p className="text-red-600 text-sm mt-1">{checkInError}</p>}
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4">チェックアウト</h2>
                <Calendar
                  onChange={(date) => setCheckOut(date as Date)}
                  value={checkOut}
                  tileDisabled={checkOutTileDisabled}
                  tileContent={() => null}
                  className="w-full"
                />
                <input
                  type="date"
                  value={formatYMD(checkOut)}
                  onChange={e => setCheckOut(e.target.value ? new Date(e.target.value) : null)}
                  className="mt-2 w-full p-2 border rounded-md"
                  min={checkIn ? formatYMD(new Date(checkIn.getTime() + 24*60*60*1000)) : formatYMD(new Date())}
                  disabled={!roomType || !checkIn || availableRoomTypes.length === 0}
                />
                {checkOutError && <p className="text-red-600 text-sm mt-1">{checkOutError}</p>}
              </div>
            </div>
            {/* 宿泊料金合計表示 */}
            <div className="my-8 text-center">
              <div className="inline-block bg-[#fff] rounded-lg px-6 py-4 shadow text-lg font-bold text-gray-800 max-w-lg w-full border-2" style={{ borderColor: '#BFAE8A' }}>
                料金合計：
                <span className="text-2xl text-gray-800 ml-2">{totalPrice.toLocaleString()}円 <span className="text-lg text-gray-800">(税込)</span></span>
                <div className="mt-3 text-center font-normal">
                  <button
                    type="button"
                    className="text-xs text-[#BFAE8A] underline hover:opacity-80 font-bold focus:outline-none"
                    onClick={() => setShowDetails(v => !v)}
                  >
                    料金明細 {showDetails ? '▲' : '▼'}
                  </button>
                  {showDetails && (
                    <div className="mt-2 text-xs text-gray-700">
                      <ul className="list-disc list-inside space-y-1">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">チェックイン予定時間 <span className="text-red-500">*</span></label>
              <select
                value={checkInTime}
                onChange={e => setCheckInTime(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">選択してください</option>
                {Array.from({length: 11}, (_, i) => {
                  const hour = 15 + Math.floor(i/2);
                  const min = i%2 === 0 ? '00' : '30';
                  return `${hour}:${min}`;
                }).map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            {/* お客様情報 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">お名前 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                  className="w-full p-2 border rounded-md"
                  required
                />
                {nameError && <p className="text-red-600 text-sm mt-1">{nameError}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  className="w-full p-2 border rounded-md"
                  required
                />
                {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">電話番号 <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  onBlur={handlePhoneBlur}
                  className="w-full p-2 border rounded-md"
                  required
                />
                {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ご要望・ご質問</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full p-2 border rounded-md h-32"
                />
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="text-white px-8 py-3 rounded-md font-bold transition hover:opacity-80"
                style={{ background: '#BFAE8A' }}
              >
                予約内容を確認する
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 