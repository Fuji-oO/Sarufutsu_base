-- RLS (Row Level Security) ポリシー設定
-- Created: 2025-07-22

-- reservationsテーブルのRLSを有効化
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- 匿名ユーザーがreservationsテーブルを読み取り可能にするポリシー
CREATE POLICY "Allow anonymous read access to reservations" ON public.reservations
  FOR SELECT USING (true);

-- 匿名ユーザーがreservationsテーブルに挿入可能にするポリシー
CREATE POLICY "Allow anonymous insert access to reservations" ON public.reservations
  FOR INSERT WITH CHECK (true);

-- 匿名ユーザーがreservationsテーブルを更新可能にするポリシー
CREATE POLICY "Allow anonymous update access to reservations" ON public.reservations
  FOR UPDATE USING (true);

-- 匿名ユーザーがreservationsテーブルを削除可能にするポリシー
CREATE POLICY "Allow anonymous delete access to reservations" ON public.reservations
  FOR DELETE USING (true);

-- usersテーブルのRLSを有効化
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 匿名ユーザーがusersテーブルを読み取り可能にするポリシー
CREATE POLICY "Allow anonymous read access to users" ON public.users
  FOR SELECT USING (true);

-- 匿名ユーザーがusersテーブルに挿入可能にするポリシー
CREATE POLICY "Allow anonymous insert access to users" ON public.users
  FOR INSERT WITH CHECK (true);

-- 匿名ユーザーがusersテーブルを更新可能にするポリシー
CREATE POLICY "Allow anonymous update access to users" ON public.users
  FOR UPDATE USING (true);

-- 匿名ユーザーがusersテーブルを削除可能にするポリシー
CREATE POLICY "Allow anonymous delete access to users" ON public.users
  FOR DELETE USING (true); 

-- RLSポリシー（reservationsテーブル用）
-- 匿名ユーザーでも予約データの読み取りを許可
CREATE POLICY "Allow anonymous read access to reservations" ON public.reservations
FOR SELECT USING (true);

-- 匿名ユーザーでも予約データの挿入を許可
CREATE POLICY "Allow anonymous insert access to reservations" ON public.reservations
FOR INSERT WITH CHECK (true);

-- 匿名ユーザーでも予約データの更新を許可
CREATE POLICY "Allow anonymous update access to reservations" ON public.reservations
FOR UPDATE USING (true);

-- usersテーブル用のRLSポリシー
-- 匿名ユーザーでもユーザーデータの読み取りを許可（認証用）
CREATE POLICY "Allow anonymous read access to users" ON public.users
FOR SELECT USING (true);

-- 匿名ユーザーでもユーザーデータの更新を許可（最終ログイン時刻更新用）
CREATE POLICY "Allow anonymous update access to users" ON public.users
FOR UPDATE USING (true); 