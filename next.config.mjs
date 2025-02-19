/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
  
    async headers() {
      return [
        {
          source: "/api/:path*", // `/api/` 以下のすべてのエンドポイントに適用
          headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" }, // 認証情報を許可
            { key: "Access-Control-Allow-Origin", value: "*" }, // すべてのオリジンを許可（必要なら特定のオリジンに変更）
            { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,POST" }, // 許可する HTTP メソッド
            { key: "Access-Control-Allow-Headers", value: "X-Requested-With, Content-Type, Authorization" }, // 許可するリクエストヘッダー
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  