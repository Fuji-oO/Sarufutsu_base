/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // 画像の最適化設定
  images: {
    domains: ['localhost'],
    unoptimized: true, // 開発環境での画像最適化を無効化
  },
  // 開発サーバーの設定
  webpack: (config, { dev, isServer }) => {
    // 開発環境でのみ適用
    if (dev && !isServer) {
      // ホットリロードの設定
      config.watchOptions = {
        poll: 1000, // ポーリング間隔（ミリ秒）
        aggregateTimeout: 300, // 変更検知後の待機時間
      }
    }
    return config
  },
}

module.exports = nextConfig 