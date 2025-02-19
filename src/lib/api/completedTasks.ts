import { supabase } from "@/utils/supabaseClient";

/**
 * プレイヤーが完了したタスクの ID を取得する関数
 * @param userId ユーザーの ID
 * @returns 完了済みタスク ID の配列
 */
export async function getPlayerCompletedTasks(userId: string): Promise<string[]> {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  try {
    const { data, error } = await supabase
      .from("completed_tasks")
      .select("task_id")
      .eq("user_id", userId);

    if (error) {
      console.error("完了済みタスクの取得エラー:", error);
      throw error;
    }

    return data.map((task) => task.task_id);
  } catch (error) {
    console.error("完了済みタスクの取得失敗:", error);
    return [];
  }
}

/**
 * タスクを完了済みにする関数
 * @param userId ユーザーの ID
 * @param taskId タスクの ID
 */
export async function completeTask(userId: string, taskId: string): Promise<void> {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  try {
    const { error } = await supabase.from("completed_tasks").insert([{ user_id: userId, task_id: taskId }]);

    if (error) {
      console.error("タスクの完了登録エラー:", error);
      throw error;
    }
  } catch (error) {
    console.error("タスクの完了登録に失敗しました:", error);
  }
}

/**
 * 完了済みタスクを削除する関数
 * @param userId ユーザーの ID
 * @param taskId タスクの ID
 */
export async function removeCompletedTask(userId: string, taskId: string): Promise<void> {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  try {
    const { error } = await supabase
      .from("completed_tasks")
      .delete()
      .eq("user_id", userId)
      .eq("task_id", taskId);

    if (error) {
      console.error("完了済みタスクの削除エラー:", error);
      throw error;
    }
  } catch (error) {
    console.error("完了済みタスクの削除に失敗しました:", error);
  }
}
