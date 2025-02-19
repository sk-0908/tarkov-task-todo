import { supabase } from "@/lib/supabaseClient";

export async function getPlayerLevel(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from("player_levels")
    .select("level")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("プレイヤーレベルの取得に失敗:", error);
    return 1; // デフォルトレベル 1
  }

  return data.level;
}

export async function updatePlayerLevel(userId: string, newLevel: number): Promise<void> {
  await supabase
    .from("player_levels")
    .upsert([{ user_id: userId, level: newLevel }], { onConflict: "user_id" });
}
