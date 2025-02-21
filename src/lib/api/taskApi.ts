import { supabase } from "@/lib/supabaseClient";
import { Task } from "@/types/task";

// 🔹 タスクを追加する関数 (objectives を JSONB に変換)
export async function addTask(newTask: Omit<Task, "id" | "user_id">, userId: string) {
  const formattedTask = {
    ...newTask,
    user_id: userId,
    objectives: newTask.objectives.map((desc) => ({ description: desc, completed: false })), // JSONB フォーマット適用
  };

  const { data, error } = await supabase
    .from("tasks")
    .insert([formattedTask])
    .select();

  if (error) {
    console.error("❌ タスク追加エラー:", error);
    throw error;
  }

  return data;
}

// 🔹 ユーザーのタスクを取得する関数 (objectives をパース)
export async function fetchUserTasks(userId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("id, name, trader, min_level, objectives, user_id, completed")
    .eq("user_id", userId);

  if (error) {
    console.error("❌ タスク取得エラー:", error);
    throw error;
  }

  // `objectives` を JSONB 形式にパース
  return data.map((task) => ({
    ...task,
    objectives: task.objectives || [],
  }));
}

// 🔹 タスクを取得 (objectives をパース)
export async function fetchTaskById(taskId: string) {
  const { data, error } = await supabase.from("tasks").select("*").eq("id", taskId).single();
  if (error) throw error;

  return {
    ...data,
    objectives: data.objectives || [], // JSONB を確実に配列で返す
  };
}

// 🔹 タスクを更新 (objectives を JSONB に対応)
export async function updateTask(taskId: string, updatedTask: Partial<Task>) {
  const formattedTask = {
    ...updatedTask,
    objectives: updatedTask.objectives?.map((obj) =>
      typeof obj === "string" ? { description: obj, completed: false } : obj
    ),
  };

  const { error } = await supabase.from("tasks").update(formattedTask).eq("id", taskId);
  if (error) throw error;
}

// 🔹 タスクを削除
export async function deleteTask(taskId: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) throw error;
}
