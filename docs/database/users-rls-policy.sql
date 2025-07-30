-- usersテーブル専用のRLSポリシー
-- 匿名ユーザーでもユーザーデータの読み取りを許可（認証用）
CREATE POLICY "Allow anonymous read access to users" ON public.users
FOR SELECT USING (true);

-- 匿名ユーザーでもユーザーデータの更新を許可（最終ログイン時刻更新用）
CREATE POLICY "Allow anonymous update access to users" ON public.users
FOR UPDATE USING (true); 