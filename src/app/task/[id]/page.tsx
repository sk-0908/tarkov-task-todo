"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { fetchTaskById, updateTask, deleteTask } from "@/lib/api/taskApi";
import { Task } from "@/types/task";

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedTask, setUpdatedTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadTask = async () => {
      try {
        const fetchedTask = await fetchTaskById(params.id);
        setTask(fetchedTask);
        setUpdatedTask(fetchedTask);
      } catch (err) {
        console.error("❌ タスクの取得に失敗:", err);
        setError("タスクの取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [user, params.id]);

  const handleUpdate = async () => {
    if (!updatedTask) return;
    try {
      await updateTask(params.id, updatedTask);
      setTask(updatedTask);
      setEditMode(false);
      console.log("✅ タスクが更新されました！");
    } catch (err) {
      console.error("❌ タスク更新エラー:", err);
      setError("タスクの更新に失敗しました。");
    }
  };

  const handleDelete = async () => {
    if (!confirm("このタスクを削除してもよろしいですか？")) return;
    try {
      await deleteTask(params.id);
      console.log("✅ タスクが削除されました！");
      router.push("/dashboard");
    } catch (err) {
      console.error("❌ タスク削除エラー:", err);
      setError("タスクの削除に失敗しました。");
    }
  };

  // ✅ タスクの完了状態をトグルする関数
  const toggleTaskCompletion = async () => {
    if (!task) return;
    try {
      const updatedStatus = !task.completed;
      const updatedTaskData = { ...task, completed: updatedStatus };
      await updateTask(task.id, { completed: updatedStatus }); // Supabase に反映
      setTask(updatedTaskData); // 即時 UI 更新
      console.log(`✅ タスク "${task.name}" の完了状態を ${updatedStatus ? "完了" : "未完了"} に変更`);
    } catch (err) {
      console.error("❌ タスク完了状態の更新に失敗:", err);
      setError("タスクの完了状態の更新に失敗しました。");
    }
  };

  if (loading) return <p className="text-center">タスクを読み込み中...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!task) return <p className="text-center text-red-500">タスクが見つかりません。</p>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">タスク詳細</h2>

      {editMode ? (
        <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
          <label className="block text-gray-400">タスク名</label>
          <input
            type="text"
            value={updatedTask?.name}
            onChange={(e) => setUpdatedTask({ ...updatedTask!, name: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white mt-1"
          />

          <label className="block mt-4 text-gray-400">トレーダー</label>
          <input
            type="text"
            value={updatedTask?.trader ?? ""}
            onChange={(e) => setUpdatedTask({ ...updatedTask!, trader: e.target.value || null })}
            className="w-full p-2 rounded bg-gray-700 text-white mt-1"
          />

          <label className="block mt-4 text-gray-400">最低レベル</label>
          <input
            type="number"
            value={updatedTask?.min_level}
            onChange={(e) => setUpdatedTask({ ...updatedTask!, min_level: Number(e.target.value) })}
            className="w-full p-2 rounded bg-gray-700 text-white mt-1"
          />

          <label className="block mt-4 text-gray-400">目標 (カンマ区切りで入力)</label>
          <input
            type="text"
            value={updatedTask?.objectives.join(", ")}
            onChange={(e) =>
              setUpdatedTask({
                ...updatedTask!,
                objectives: e.target.value.split(",").map((o) => ({
                  description: o.trim(),
                  completed: false, // 新規追加時は未完了とする
                })),
              })
            }
            
            className="w-full p-2 rounded bg-gray-700 text-white mt-1"
          />

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 px-6 py-2 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-all"
            >
              保存
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-500 px-6 py-2 rounded-lg text-lg font-semibold hover:bg-gray-600 transition-all"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-bold">{task.name}</h3>
          <p className="text-gray-400">トレーダー: {task.trader || "不明"}</p>
          <p>最低レベル: {task.min_level}</p>

          {/* ✅ 完了トグルスイッチ */}
          <label className="flex items-center justify-center mt-4">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={toggleTaskCompletion}
              className="mr-2"
            />
            <span className={task.completed ? "text-green-400" : "text-red-400"}>
              {task.completed ? "完了" : "未完了"}
            </span>
          </label>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setEditMode(true)}
              className="bg-yellow-500 px-6 py-2 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition-all"
            >
              編集
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 px-6 py-2 rounded-lg text-lg font-semibold hover:bg-red-600 transition-all"
            >
              削除
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-6 bg-gray-700 px-6 py-2 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all"
      >
        戻る
      </button>
    </div>
  );
}
