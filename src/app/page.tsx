"use client";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      console.log("未ログインのため /auth へリダイレクト");
      router.push("/auth");
    } else {
      console.log("ログイン済みのため /dashboard へリダイレクト");
      router.push("/dashboard");
    }
  }, [user, router]);

  return null;
}