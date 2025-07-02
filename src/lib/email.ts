import { Resend } from 'resend';

export async function sendContactEmail({
  name,
  email,
  phone,
  subject,
  message
}: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}, apiKey: string) {
  const resend = new Resend(apiKey);
  const subjectMap = {
    reservation: '宿泊予約について',
    facility: '施設について',
    access: 'アクセスについて',
    other: 'その他',
  };
  const subjectJp = subjectMap[subject] || subject;

  let adminResult, userResult, errorInfo = [];
  // 管理者宛
  try {
    adminResult = await resend.emails.send({
      from: 'さるふつbase <onboarding@resend.dev>',
      to: 'sarufutsu.base@gmail.com',
      subject: '【さるふつbase】新規お問い合わせがありました',
      text: `お名前: ${name}\nメールアドレス: ${email}\n電話番号: ${phone}\nお問い合わせ項目: ${subjectJp}\n\nお問い合わせ内容:\n${message}`,
    });
    console.log('Resend contact email result:', adminResult);
  } catch (error) {
    errorInfo.push('管理者宛メール送信失敗: ' + String(error));
    console.error('Resend contact email error:', error);
  }
  // 送信者宛
  try {
    userResult = await resend.emails.send({
      from: 'さるふつbase <onboarding@resend.dev>',
      to: email,
      subject: '【さるふつbase】お問い合わせありがとうございます（自動返信）',
      text: `この度は「さるふつbase」へお問い合わせいただき、誠にありがとうございます。\n本メールは自動返信です。内容を確認のうえ、担当者より改めてご連絡いたします。\n\n──────────────\n【お問い合わせ内容】\n\nお名前：${name}\nメールアドレス：${email}\n電話番号：${phone}\nお問い合わせ項目：${subjectJp}\nお問い合わせ内容：\n${message}\n\n──────────────\n※本メールは自動送信です。ご返信いただいてもお答えできません。\n※内容に誤りがある場合や、3営業日以内に返信がない場合は、お手数ですが再度ご連絡ください。\n\nさるふつbase\nsarufutsu.base@gmail.com`,
    });
    console.log('Resend contact user auto-reply result:', userResult);
  } catch (error) {
    errorInfo.push('送信者宛メール送信失敗: ' + String(error));
    console.error('Resend contact user auto-reply error:', error);
  }
  if (errorInfo.length > 0) throw new Error(errorInfo.join(' / '));
  return { adminResult, userResult };
}

export async function sendReservationEmail(data: {
  checkIn: string;
  checkOut: string;
  checkInTime: string;
  guests: number;
  adultMale: number;
  adultFemale: number;
  child: number;
  roomType: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}, apiKey: string) {
  const resend = new Resend(apiKey);
  function parseDate(str: string) {
    if (!str) return null;
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  function getStayNights() {
    const inDate = parseDate(data.checkIn);
    const outDate = parseDate(data.checkOut);
    if (!inDate || !outDate) return 0;
    const diff = (outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.round(diff));
  }
  function countHeatingNights() {
    const inDate = parseDate(data.checkIn);
    const outDate = parseDate(data.checkOut);
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
  const totalGuests = Number(data.adultMale || 0) + Number(data.adultFemale || 0) + Number(data.child || 0);
  const totalAdult = Number(data.adultMale || 0) + Number(data.adultFemale || 0);
  const totalChild = Number(data.child || 0);
  const baseAdult = totalAdult * 9900 * stayNights;
  const baseChild = totalChild * 4950 * stayNights;
  const heatingNights = countHeatingNights();
  const isKashikiri = data.roomType === '貸切';
  let totalPrice, priceDetail = "";

  // --- 7月限定セール対応 ---
  function isJuly2025(date) {
    return date.getFullYear() === 2025 && date.getMonth() === 6;
  }
  function getStayDates() {
    const inDate = parseDate(data.checkIn);
    const outDate = parseDate(data.checkOut);
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
  let julyAdultNights = 0, julyChildNights = 0, julyKashikiriNights = 0;
  let normalAdultNights = 0, normalChildNights = 0, normalKashikiriNights = 0;
  if (data.roomType === '貸切') {
    stayDates.forEach(date => {
      if (isJuly2025(date)) {
        julyKashikiriNights++;
      } else {
        normalKashikiriNights++;
      }
    });
    basePrice = 38500 * julyKashikiriNights + 44000 * normalKashikiriNights;
    priceDetail = julyKashikiriNights > 0 ? `  ・貸切 ${julyKashikiriNights}泊 × 38,500円 = ${(38500 * julyKashikiriNights).toLocaleString()}円 【7月限定セール価格適用】\n` : '';
    priceDetail += normalKashikiriNights > 0 ? `  ・貸切 ${normalKashikiriNights}泊 × 44,000円 = ${(44000 * normalKashikiriNights).toLocaleString()}円\n` : '';
  } else {
    stayDates.forEach(date => {
      if (isJuly2025(date)) {
        julyAdultNights += Number(data.adultMale || 0) + Number(data.adultFemale || 0);
        julyChildNights += Number(data.child || 0);
      } else {
        normalAdultNights += Number(data.adultMale || 0) + Number(data.adultFemale || 0);
        normalChildNights += Number(data.child || 0);
      }
    });
    const baseAdultJuly = julyAdultNights * 7700;
    const baseChildJuly = julyChildNights * 3850;
    const baseAdultNormal = normalAdultNights * 9900;
    const baseChildNormal = normalChildNights * 4950;
    basePrice = baseAdultJuly + baseChildJuly + baseAdultNormal + baseChildNormal;
    if (julyAdultNights > 0) priceDetail += `  ・大人 ${Number(data.adultMale || 0) + Number(data.adultFemale || 0)}名 × ${julyAdultNights / ((Number(data.adultMale || 0) + Number(data.adultFemale || 0)) || 1)}泊 × 7,700円 = ${baseAdultJuly.toLocaleString()}円 【7月限定セール価格適用】\n`;
    if (normalAdultNights > 0) priceDetail += `  ・大人 ${Number(data.adultMale || 0) + Number(data.adultFemale || 0)}名 × ${normalAdultNights / ((Number(data.adultMale || 0) + Number(data.adultFemale || 0)) || 1)}泊 × 9,900円 = ${baseAdultNormal.toLocaleString()}円\n`;
    if (julyChildNights > 0) priceDetail += `  ・子供 ${Number(data.child || 0)}名 × ${julyChildNights / (Number(data.child || 0) || 1)}泊 × 3,850円 = ${baseChildJuly.toLocaleString()}円 【7月限定セール価格適用】\n`;
    if (normalChildNights > 0) priceDetail += `  ・子供 ${Number(data.child || 0)}名 × ${normalChildNights / (Number(data.child || 0) || 1)}泊 × 4,950円 = ${baseChildNormal.toLocaleString()}円\n`;
  }
  const heatingFee = (Number(data.adultMale || 0) + Number(data.adultFemale || 0) + Number(data.child || 0)) * 550 * heatingNights;
  totalPrice = basePrice + heatingFee;
  if (heatingFee > 0) priceDetail += `  ・暖房費 ${Number(data.adultMale || 0) + Number(data.adultFemale || 0) + Number(data.child || 0)}名 × ${heatingNights}泊 × 550円 = ${(heatingFee).toLocaleString()}円\n`;

  const mailBody = `
【予約内容】

チェックイン日: ${data.checkIn}
チェックアウト日: ${data.checkOut}
チェックイン予定時間: ${data.checkInTime}

宿泊人数合計: ${data.guests}名
大人(男性): ${data.adultMale}名
大人(女性): ${data.adultFemale}名
子供: ${data.child}名
部屋タイプ: ${data.roomType}

お名前: ${data.name}
メールアドレス: ${data.email}
電話番号: ${data.phone}

ご要望/ご質問:
${data.notes || '（なし）'}

------------------------------
■ 料金合計：${totalPrice.toLocaleString()}円（税込）
■ 料金明細：
${priceDetail}`;

  let adminResult, userResult, errorInfo = [];
  // 管理者宛
  try {
    adminResult = await resend.emails.send({
      from: 'さるふつbase <onboarding@resend.dev>',
      to: 'sarufutsu.base@gmail.com',
      subject: '【さるふつbase】新規予約がありました',
      text: mailBody,
    });
    console.log('Resend reservation email result:', adminResult);
  } catch (error) {
    errorInfo.push('管理者宛メール送信失敗: ' + String(error));
    console.error('Resend reservation email error:', error);
  }
  // 送信者宛
  try {
    userResult = await resend.emails.send({
      from: 'さるふつbase <onboarding@resend.dev>',
      to: data.email,
      subject: '【さるふつbase】ご予約内容の確認（自動返信）',
      text: `この度は「さるふつbase」へご予約いただき、誠にありがとうございます。\n本メールは自動返信です。内容を確認のうえ、担当者より改めてご連絡いたします。\n\n──────────────\n【ご予約内容】\n\nチェックイン日：${data.checkIn}\nチェックアウト日：${data.checkOut}\nチェックイン予定時間：${data.checkInTime}\n\n宿泊人数合計：${data.guests}名\n大人(男性)：${data.adultMale}名\n大人(女性)：${data.adultFemale}名\n子供：${data.child}名\n部屋タイプ：${data.roomType}\n\nお名前：${data.name}\nメールアドレス：${data.email}\n電話番号：${data.phone}\n\nご要望/ご質問：\n${data.notes || '（なし）'}\n\n------------------------------\n■ 料金合計：${totalPrice.toLocaleString()}円（税込）\n■ 料金明細：\n${priceDetail}\n\n──────────────\n※本メールは自動送信です。ご返信いただいてもお答えできません。\n※内容に誤りがある場合や、3営業日以内に返信がない場合は、お手数ですが再度ご連絡ください。\n\nさるふつbase\nsarufutsu.base@gmail.com`,
    });
    console.log('Resend reservation user auto-reply result:', userResult);
  } catch (error) {
    errorInfo.push('送信者宛メール送信失敗: ' + String(error));
    console.error('Resend reservation user auto-reply error:', error);
  }
  if (errorInfo.length > 0) throw new Error(errorInfo.join(' / '));
  return { adminResult, userResult };
} 