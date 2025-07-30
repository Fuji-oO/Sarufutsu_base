-- サンプルデータ
-- Created: 2025-07-22

-- 管理者ユーザのサンプルデータ
INSERT INTO public.users (email, password_hash, name, role) VALUES
('admin@sarufutsu-base.jp', '$2b$10$example_hash_here', '管理者', 'admin'),
('staff@sarufutsu-base.jp', '$2b$10$example_hash_here', 'スタッフ', 'staff');

-- 予約のサンプルデータ
INSERT INTO public.reservations (
  name, 
  email, 
  phone, 
  checkin_date, 
  checkout_date, 
  checkin_time, 
  num_guests, 
  adult_male, 
  adult_female, 
  child, 
  room_type, 
  notes, 
  status, 
  total_price, 
  price_detail
) VALUES
(
  '田中太郎',
  'tanaka@example.com',
  '090-1234-5678',
  '2025-08-15',
  '2025-08-17',
  '15:00',
  2,
  1,
  1,
  0,
  'standard',
  'チェックイン時間を早めたいです',
  'confirmed',
  20000,
  '宿泊料金: 20,000円'
),
(
  '佐藤花子',
  'sato@example.com',
  '080-9876-5432',
  '2025-08-20',
  '2025-08-22',
  '16:00',
  3,
  1,
  1,
  1,
  'premium',
  '子供用の布団をお願いします',
  'confirmed',
  30000,
  '宿泊料金: 30,000円'
),
(
  '山田次郎',
  'yamada@example.com',
  '070-5555-1234',
  '2025-08-25',
  '2025-08-26',
  '14:00',
  1,
  1,
  0,
  0,
  'standard',
  NULL,
  'pending',
  10000,
  '宿泊料金: 10,000円'
); 