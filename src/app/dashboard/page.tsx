"use client";
import { useAuth } from "@/lib/useAuth";
import { useState, useEffect } from "react";
import { getPlayerLevel, updatePlayerLevel } from "@/lib/api/playerLevel";

interface Task {
  id: string;
  name: string;
  trader?: { name: string };
  minPlayerLevel: number;
  objectives: { description: string }[];
}

export default function Dashboard() {
  const { user, level, setLevel, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLevel, setNewLevel] = useState(level);

  useEffect(() => {
    if (!user) return;

    const fetchPlayerLevel = async () => {
      try {
        const fetchedLevel = await getPlayerLevel(user.id);
        setLevel(fetchedLevel);
      } catch (error) {
        console.error("プレイヤーレベルの取得に失敗:", error);
      }
    };

    fetchPlayerLevel();
  }, [user, setLevel]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tarkovTasks");
        if (!response.ok) throw new Error("タスクの取得に失敗しました");

        const data: Task[] = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

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
    if (!user) {
      console.error("❌ ユーザーが未ログイン");
      return;
    }
  
    console.log("🔄 レベル保存処理開始: ", { userId: user.id, newLevel });
  
    try {
      await updatePlayerLevel(user.id, newLevel);
      
      // もう一度レベルを取得して更新確認
      const updatedLevel = await getPlayerLevel(user.id);
      setLevel(updatedLevel);
  
      console.log("✅ プレイヤーレベルが更新されました！", updatedLevel);
    } catch (error) {
      console.error("❌ レベル更新エラー:", error);
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

      {/* タスク一覧 */}
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg text-center mt-6">
        <h3 className="text-xl font-semibold mb-4">タスク一覧</h3>
        {loading ? (
          <p>タスクを読み込み中...</p>
        ) : (
          <ul className="space-y-4">
            {tasks.length === 0 ? (
              <p className="text-gray-400">表示するタスクがありません。</p>
            ) : (
              tasks.map((task: Task) => (
                <li key={task.id} className={`bg-gray-700 p-4 rounded-lg shadow-md ${level < task.minPlayerLevel ? 'opacity-50' : ''}`}>
                  <h4 className="text-lg font-bold">{task.name}</h4>
                  <p className="text-sm text-gray-400">トレーダー: {task.trader?.name || "不明"}</p>
                  <p className="text-sm">最低レベル: {task.minPlayerLevel}</p>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
