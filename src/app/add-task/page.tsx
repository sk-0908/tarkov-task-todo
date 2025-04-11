"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addTask } from "@/lib/api/taskApi";
import { useAuth } from "@/lib/useAuth";

export default function AddTaskPage() {
  const { user } = useAuth();
  const [taskName, setTaskName] = useState("");
  const [trader, setTrader] = useState("");
  const [min_level, setMinPlayerLevel] = useState(1);
  const [objectives, setObjectives] = useState<string[]>([""]);
  const router = useRouter();

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
  };

  const addObjectiveField = () => setObjectives([...objectives, ""]);
  const removeObjectiveField = (index: number) =>
    setObjectives(objectives.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newTask = {
      name: taskName,
      trader: trader || null,
      min_level: min_level,
      completed: false,
      objectives: objectives
        .filter((obj) => obj.trim() !== "")
        .map((description) => ({
          description,
          completed: false,
        })),
    };

    try {
      await addTask(newTask, user.id);
      console.log("✅ タスクが追加されました:", newTask);
      router.push("/dashboard");
    } catch (error) {
      console.error("❌ タスク追加エラー:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6">タスクを追加</h2>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-gray-800 p-4 rounded-lg shadow-lg space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">タスク名</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="タスク名を入力"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">トレーダー</label>
          <input
            type="text"
            value={trader}
            onChange={(e) => setTrader(e.target.value)}
            placeholder="トレーダー名を入力（例: Prapor, Therapist）"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">最低プレイヤーレベル</label>
          <input
            type="number"
            value={min_level}
            onChange={(e) => setMinPlayerLevel(Number(e.target.value))}
            min={1}
            max={100}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">タスク目標</label>
          {objectives.map((objective, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={objective}
                onChange={(e) => handleObjectiveChange(index, e.target.value)}
                placeholder={`目標 ${index + 1}`}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              />
              <button
                type="button"
                onClick={() => removeObjectiveField(index)}
                className="bg-red-500 px-3 py-2 rounded text-white hover:bg-red-600 transition-all"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addObjectiveField}
            className="mt-2 bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600 transition-all w-full"
          >
            + 目標を追加
          </button>
        </div>

        <button
          type="submit"
          className="mt-4 bg-green-500 px-6 py-2 rounded-lg text-lg font-semibold hover:bg-green-600 transition-all w-full"
        >
          タスクを追加
        </button>
      </form>

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-6 bg-gray-500 px-6 py-2 rounded-lg text-lg font-semibold hover:bg-gray-600 transition-all"
      >
        キャンセル
      </button>
    </div>
  );
}
