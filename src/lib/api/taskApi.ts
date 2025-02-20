import { supabase } from "@/lib/supabaseClient";
import { Task } from "@/types/task";

// 🔹 タスクを追加する関数
export async function addTask(newTask: Omit<Task, "id" | "user_id">, userId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ ...newTask, user_id: userId }])
    .select();

  if (error) {
    console.error("❌ タスク追加エラー:", error);
    throw error;
  }

  return data;
}

// 🔹 ユーザーのタスクを取得する関数
export async function fetchUserTasks(userId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("id, name, trader, min_level, objectives, user_id")
    .eq("user_id", userId);

  if (error) {
    console.error("❌ タスク取得エラー:", error);
    throw error;
  }

  return data;
}

// タスクを取得
export async function fetchTaskById(taskId: string) {
    const { data, error } = await supabase.from("tasks").select("*").eq("id", taskId).single();
    if (error) throw error;
    return data;
  }
  
  // タスクを更新
  export async function updateTask(taskId: string, updatedTask: Partial<Task>) {
    const { error } = await supabase.from("tasks").update(updatedTask).eq("id", taskId);
    if (error) throw error;
  }
  
  // タスクを削除
  export async function deleteTask(taskId: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) throw error;
  }