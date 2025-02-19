import { supabase } from "@/utils/supabaseClient";

export async function getPlayerLevel(userId: string): Promise<number> {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  try {
    const { data, error } = await supabase
      .from("player_levels")
      .select("level")
      .eq("user_id", userId)
      .single(); // ユーザーごとに1件のみ取得

    if (error) {
      console.error("Failed to fetch player level:", error);
      return 1; // デフォルトのレベル（1）を返す
    }

    return data?.level ?? 1; // データがない場合は 1 を返す
  } catch (err) {
    console.error("Unexpected error fetching player level:", err);
    return 1;
  }
}

// プレイヤーレベルを更新する関数
export async function updatePlayerLevel(userId: string, newLevel: number): Promise<void> {
    if (!supabase) throw new Error("Supabase client is not initialized.");
  
    try {
      // まず現在のレベルを取得
      const currentLevel = await getPlayerLevel(userId);
  
      if (currentLevel === newLevel) {
        console.log("レベルは既に最新です。");
        return;
      }
  
      const { error } = await supabase
        .from("player_levels")
        .upsert([{ user_id: userId, level: newLevel }], { onConflict: "user_id" });
  
      if (error) {
        throw error;
      }
  
      console.log("プレイヤーレベルが更新されました:", newLevel);
    } catch (error) {
      console.error("レベル更新エラー:", error);
    }
  }
  