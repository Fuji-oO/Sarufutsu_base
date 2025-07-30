const bcrypt = require('bcryptjs')

async function generateNewHash() {
  const password = 'sarufutsu2025'
  const saltRounds = 10
  
  try {
    const hash = await bcrypt.hash(password, saltRounds)
    console.log('新しいパスワードハッシュ:')
    console.log(hash)
    console.log('')
    console.log('SupabaseのSQL Editorで以下を実行してください:')
    console.log('')
    console.log(`INSERT INTO public.users (email, password_hash, name, role) VALUES ('admin@sarufutsu-base.com', '${hash}', '管理者', 'admin');`)
  } catch (error) {
    console.error('ハッシュ生成エラー:', error)
  }
}

generateNewHash() 