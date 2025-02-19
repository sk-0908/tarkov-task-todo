"use client";
import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { signOut } from "./auth";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { getPlayerLevel } from "./api";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [level, setLevel] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log("取得したセッション:", data?.session);

      if (error) {
        console.error("セッション取得エラー:", error);
        return;
      }

      if (data?.session?.user) {
        console.log("ユーザー情報更新:", data.session.user);
        setUser(data.session.user);

        try {
          const storedLevel = await getPlayerLevel(data.session.user.id);
          console.log("設定するプレイヤーレベル:", storedLevel);
          setLevel(storedLevel);
        } catch (err) {
          console.error("レベル取得エラー:", err);
        }
      } else {
        console.log("セッションがないため、user を null に設定");
        setUser(null);
        setLevel(0);
      }
    };

    fetchSession();

    return () => {};
  }, []);

  const logout = async () => {
    console.log("ログアウト処理開始...");
    await signOut();
    setUser(null);
    setLevel(0);
    router.push("/auth");
  };

  return { user, level, setLevel, logout };
}
