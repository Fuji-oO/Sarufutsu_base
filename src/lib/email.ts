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

  try {
    const result = await resend.emails.send({
      from: 'さるふつbase <onboarding@resend.dev>',
      to: 'sarufutsu.base@gmail.com',
      subject: '【さるふつbase】新規お問い合わせがありました',
      text: `お名前: ${name}\nメールアドレス: ${email}\n電話番号: ${phone}\nお問い合わせ項目: ${subjectJp}\n\nお問い合わせ内容:\n${message}`,
    });
    console.log('Resend contact email result:', result);
    return result;
  } catch (error) {
    console.error('Resend contact email error:', error);
    throw error;
  }
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
  const baseAdult = totalAdult * 8800 * stayNights;
  const baseChild = totalChild * 4400 * stayNights;
  const heatingNights = countHeatingNights();
  const heatingFee = totalGuests * 550 * heatingNights;
  const totalPrice = baseAdult + baseChild + heatingFee;

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
  ・大人 ${totalAdult}名 × ${stayNights}泊 × 9,900円 = ${(baseAdult).toLocaleString()}円
${totalChild > 0 ? `  ・子供 ${totalChild}名 × ${stayNights}泊 × 4,950円 = ${(baseChild).toLocaleString()}円
` : ''}${heatingFee > 0 ? `  ・暖房費 ${totalGuests}名 × ${heatingNights}泊 × 550円 = ${(heatingFee).toLocaleString()}円
` : ''}`;

  try {
    const result = await resend.emails.send({
      from: 'さるふつbase <onboarding@resend.dev>',
      to: 'sarufutsu.base@gmail.com',
      subject: '【さるふつbase】新規予約がありました',
      text: mailBody,
    });
    console.log('Resend reservation email result:', result);
    return result;
  } catch (error) {
    console.error('Resend reservation email error:', error);
    throw error;
  }
} 