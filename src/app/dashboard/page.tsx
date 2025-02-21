"use client";

import { useAuth } from "@/lib/useAuth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchUserTasks } from "@/lib/api/taskApi";
import { updatePlayerLevel } from "@/lib/api/playerLevel";
import { Task } from "@/types/task";

export default function Dashboard() {
  const { user, level, setLevel, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLevel, setNewLevel] = useState(level);
  const [showCompleted, setShowCompleted] = useState(false); // ✅ 完了タスクの表示/非表示トグル
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchUserTasks(user.id);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("❌ タスクの取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [user]);

  useEffect(() => {
    setNewLevel(level);
  }, [level]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (value < 1) value = 1;
    if (value > 100) value = 100;
    setNewLevel(value);
  };

  const handleSaveLevel = async () => {
    if (!user) return;
    try {
      await updatePlayerLevel(user.id, newLevel);
      setLevel(newLevel);
      console.log("✅ プレイヤーレベルが更新されました！", newLevel);
    } catch (error) {
      console.error("レベル更新エラー:", error);
    }
  };

  if (!user) return <p className="text-center text-lg text-red-500">ログインしてください。</p>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <header className="w-full max-w-2xl flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">ようこそ, {user.email}</h2>
        <button onClick={logout} className="bg-red-500 px-5 py-2 rounded-lg text-lg font-semibold hover:bg-red-600 transition-all">
          ログアウト
        </button>
      </header>

      {/* プレイヤーレベル管理 */}
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-semibold mb-4">プレイヤーレベル</h3>
        <div className="text-4xl font-bold mb-4 text-blue-400">Lv. {level}</div>
        
        <input
          type="number"
          value={newLevel}
          onChange={handleLevelChange}
          min={1}
          max={100}
          className="p-2 text-xl text-center rounded bg-gray-700 border border-gray-600 w-full max-w-xs focus:ring focus:ring-blue-400"
        />
        
        <button
          onClick={handleSaveLevel}
          className="mt-4 bg-blue-500 px-6 py-2 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-all"
        >
          レベル更新
        </button>
      </div>

      {/* タスク追加ページへ遷移するボタン */}
      <button
        onClick={() => router.push("/add-task")}
        className="mt-6 bg-green-500 px-6 py-2 rounded-lg text-lg font-semibold hover:bg-green-600 transition-all"
      >
        タスクを追加する
      </button>

      {/* 完了タスクの表示/非表示トグル */}
      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          checked={showCompleted}
          onChange={() => setShowCompleted(!showCompleted)}
          className="w-5 h-5 mr-2 cursor-pointer"
        />
        <label className="text-lg cursor-pointer">完了したタスクを表示</label>
      </div>

      {/* タスク一覧 */}
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg text-center mt-6">
        <h3 className="text-xl font-semibold mb-4">タスク一覧</h3>
        {loading ? (
          <p>タスクを読み込み中...</p>
        ) : (
          <ul className="space-y-4">
            {tasks.filter(task => showCompleted || !task.completed).length === 0 ? (
              <p className="text-gray-400">表示するタスクがありません。</p>
            ) : (
              tasks
                .filter(task => showCompleted || !task.completed)
                .map((task: Task) => (
                  <li key={task.id} className={`bg-gray-700 p-4 rounded-lg shadow-md ${level < task.min_level ? 'opacity-50' : ''}`}>
                    <h4 className="text-lg font-bold cursor-pointer hover:underline" onClick={() => router.push(`/task/${task.id}`)}>
                      {task.name}
                    </h4>
                    <p className="text-sm text-gray-400">トレーダー: {task.trader || "不明"}</p>
                    <p className="text-sm">最低レベル: {task.min_level}</p>
                  </li>
                ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
