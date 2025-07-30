# データベーステーブル仕様書

## 概要
さるふつbaseの予約システム用データベーススキーマ

## reservations（予約情報）

| カラム名         | 型                    | 必須 | デフォルト値                | 説明                                   |
|-----------------|-----------------------|------|-----------------------------|----------------------------------------|
| id              | uuid                  | ○    | gen_random_uuid()           | 予約ID（自動生成, PK）                 |
| name            | text                  | ○    | なし                        | 予約者氏名                             |
| email           | text                  | ○    | なし                        | 予約者メールアドレス                   |
| phone           | text                  | ○    | なし                        | 電話番号                               |
| checkin_date    | date                  | ○    | なし                        | チェックイン日                         |
| checkout_date   | date                  | ○    | なし                        | チェックアウト日                       |
| checkin_time    | text                  | ○    | なし                        | チェックイン予定時刻                   |
| num_guests      | integer               | ○    | なし                        | 宿泊人数合計                           |
| adult_male      | integer               |      | 0                           | 大人（男性）                           |
| adult_female    | integer               |      | 0                           | 大人（女性）                           |
| child           | integer               |      | 0                           | 子供                                   |
| room_type       | text                  | ○    | なし                        | 部屋タイプ                             |
| notes           | text                  |      | null                        | ご要望・質問（任意）                   |
| status          | text                  | ○    | なし                        | 予約状態（例: confirmed, cancelled等） |
| total_price     | bigint                |      | null                        | 料金合計                               |
| price_detail    | text                  |      | null                        | 料金明細                               |
| created_at      | timestamp with time zone | ○    | now()                       | 作成日時（自動）                       |
| updated_at      | timestamp with time zone | ○    | now()                       | 更新日時（自動、トリガーで更新）       |

### 制約
- 主キー: `id`
- 外部キー: なし

---

## users（管理者ユーザ情報）

| カラム名         | 型                    | 必須 | デフォルト値                | 説明                                   |
|-----------------|-----------------------|------|-----------------------------|----------------------------------------|
| id              | uuid                  | ○    | gen_random_uuid()           | ユーザID（自動生成, PK）               |
| email           | text                  | ○    | なし                        | メールアドレス（ログインID）           |
| password_hash   | text                  | ○    | なし                        | パスワードハッシュ                     |
| name            | text                  |      | ''                          | 氏名                                   |
| role            | text                  | ○    | 'admin'                     | 権限（admin, staff等）                 |
| created_at      | timestamp with time zone | ○    | now()                       | 作成日時（自動）                       |
| updated_at      | timestamp with time zone | ○    | now()                       | 更新日時（自動、トリガーで更新）       |
| last_login_at   | timestamp with time zone |      | null                        | 最終ログイン日時                       |
| mfa_enabled     | boolean               |      | false                       | 2段階認証有効フラグ                    |

### 制約
- 主キー: `id`
- 外部キー: なし

---

## トリガー

### update_updated_at_column()
- 目的: `updated_at`カラムを自動更新
- 対象テーブル: `reservations`, `users`
- 実行タイミング: UPDATE時

---

## 運用上の注意事項

### 予約状態（status）
- `confirmed`: 予約確定
- `cancelled`: キャンセル
- `pending`: 保留中

### 部屋タイプ（room_type）
- `standard`: スタンダード
- `premium`: プレミアム
- その他必要に応じて追加

### 権限（role）
- `admin`: 管理者（全権限）
- `staff`: スタッフ（閲覧・編集のみ）
- 将来的な権限拡張も考慮 