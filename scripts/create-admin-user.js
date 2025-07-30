const bcrypt = require('bcryptjs')

// 管理者ユーザーの作成
async function createAdminUser() {
  const email = 'admin@sarufutsu-base.com'
  const password = 'sarufutsu2025'
  const name = '管理者'
  
  // パスワードをハッシュ化
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  
  console.log('管理者ユーザー作成用SQL:')
  console.log('')
  console.log(`INSERT INTO public.users (email, password_hash, name, role) VALUES ('${email}', '${passwordHash}', '${name}', 'admin');`)
  console.log('')
  console.log('上記のSQLをSupabaseのSQL Editorで実行してください。')
  console.log('')
  console.log('ログイン情報:')
  console.log(`メールアドレス: ${email}`)
  console.log(`パスワード: ${password}`)
}

createAdminUser().catch(console.error) 