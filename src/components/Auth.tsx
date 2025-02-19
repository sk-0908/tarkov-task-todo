"use client";
import { useState } from "react";
import { signIn, signUp } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (isSignUp: boolean) => {
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }

      console.log("ログイン成功");
      router.push("/dashboard");
    } catch (err: unknown) { // ✅ `unknown` に変更
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("予期しないエラーが発生しました");
      }
      console.error("認証エラー:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-4">ログイン / 新規登録</h2>
      <input
        className="mb-2 p-2 rounded bg-gray-700 border border-gray-600"
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="mb-2 p-2 rounded bg-gray-700 border border-gray-600"
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-500 px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
        onClick={() => handleAuth(false)}
      >
        {loading ? "処理中..." : "ログイン"}
      </button>
      <button
        className="mt-2 bg-green-500 px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
        onClick={() => handleAuth(true)}
      >
        {loading ? "処理中..." : "新規登録"}
      </button>
      {error && <p className="text-red-400 mt-2">{error}</p>}
    </div>
  );
}
