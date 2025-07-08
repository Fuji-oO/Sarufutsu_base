'use client'

import React, { useState, useMemo } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useRouter } from 'next/navigation'
import { FaInstagram } from "react-icons/fa";
import FadeTransitionWrapper from '../../components/FadeTransitionWrapper';

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
  // --- 既存予約フォームUI・ロジックは一時停止のため全てコメントアウトで温存 ---
  /*
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
  */

  // --- ここから一時的な案内画面 ---
  return (
    <FadeTransitionWrapper>
      <div className="min-h-screen pt-16 pb-16 md:py-[120px]" style={{background:'#F5EEDC'}}>
        <div className="container mx-auto px-2 md:px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-center" style={{letterSpacing:'0.1em', color:'#000'}}>Reservation</h1>
          <p className="text-xs md:text-base text-center mb-6 md:mb-12" style={{letterSpacing:'0.1em'}}>- ご予約 -</p>
          <div className="max-w-2xl mx-auto bg-[#FEFDFC] rounded-lg shadow p-6 md:p-10 text-center text-base md:text-xl font-semibold text-gray-800 flex flex-col items-center gap-6" style={{border: '2px solid #bfae8a'}}>
            <div className="mb-2">
              <span className="font-bold text-base md:text-xl tracking-widest font-mono" style={{fontFamily: 'Klee One, cursive', letterSpacing:'0.1em'}}>現在、ご予約はお電話または<br />InstagramのDMにて受け付けております。</span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
              <a href="tel:070-2616-1188" className="inline-block px-6 py-3 rounded-full font-bold bg-[#bfae8a] text-white text-base md:text-xl shadow hover:opacity-90 transition" style={{letterSpacing:'0.1em', minWidth:'180px'}}>☎ 070-2616-1188</a>
              <a href="https://www.instagram.com/sarufutsu_base/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-[#f5f1e6] text-[#3a2e13] text-lg md:text-xl shadow border border-[#bfae8a] hover:bg-[#bfae8a] hover:text-white transition" style={{letterSpacing:'0.1em', minWidth:'180px'}}>
                <FaInstagram size={22} /> Instagram
              </a>
            </div>
            <div className="text-xs md:text-sm text-gray-500 mt-4">※お電話での受付は、9:00〜18:00の時間帯となっております。</div>
            <div className="text-xs md:text-sm text-gray-500">※空室状況やご質問もお気軽にご連絡ください。</div>
          </div>
        </div>
      </div>
    </FadeTransitionWrapper>
  );
} 