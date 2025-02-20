"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { fetchTaskById, updateTask, deleteTask } from "@/lib/api/taskApi";

interface Task {
  id: string;
  name: string;
  trader?: string | null;
  min_level: number;
  objectives: string[];
}

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedTask, setUpdatedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!user) return;
    const loadTask = async () => {
      try {
        const fetchedTask = await fetchTaskById(params.id);
        setTask(fetchedTask);
        setUpdatedTask(fetchedTask);
      } catch (error) {
        console.error("❌ タスクの取得に失敗:", error);
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
    } catch (error) {
      console.error("❌ タスク更新エラー:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(params.id);
      console.log("✅ タスクが削除されました！");
      router.push("/dashboard");
    } catch (error) {
      console.error("❌ タスク削除エラー:", error);
    }
  };

  if (loading) return <p className="text-center">タスクを読み込み中...</p>;

  if (!task) return <p className="text-center text-red-500">タスクが見つかりません。</p>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">タスク詳細</h2>

      {editMode ? (
        <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
          <input
            type="text"
            value={updatedTask?.name}
            onChange={(e) => setUpdatedTask({ ...updatedTask!, name: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="number"
            value={updatedTask?.min_level}
            onChange={(e) => setUpdatedTask({ ...updatedTask!, min_level: Number(e.target.value) })}
            className="w-full p-2 rounded bg-gray-700 text-white mt-2"
          />
          <button onClick={handleUpdate} className="mt-4 bg-blue-500 px-6 py-2 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-all">
            保存
          </button>
          <button onClick={() => setEditMode(false)} className="mt-2 bg-gray-500 px-6 py-2 rounded-lg text-lg font-semibold hover:bg-gray-600 transition-all">
            キャンセル
          </button>
        </div>
      ) : (
        <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-bold">{task.name}</h3>
          <p className="text-gray-400">トレーダー: {task.trader || "不明"}</p>
          <p>最低レベル: {task.min_level}</p>
          <button onClick={() => setEditMode(true)} className="mt-4 bg-yellow-500 px-6 py-2 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition-all">
            編集
          </button>
          <button onClick={handleDelete} className="mt-4 bg-red-500 px-6 py-2 rounded-lg text-lg font-semibold hover:bg-red-600 transition-all">
            削除
          </button>
        </div>
      )}
    </div>
  );
}
