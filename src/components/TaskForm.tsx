import { useState } from "react";

interface Task {
  id: string;
  name: string;
  trader?: { name: string };
  min_level: number;
  objectives: { description: string }[];
}

interface TaskFormProps {
  onAddTask: (newTask: Task) => void;
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [taskName, setTaskName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9), // 一時的なID
      name: taskName,
      min_level: 1, // 仮のデフォルト値
      objectives: [],
    };

    onAddTask(newTask);
    setTaskName(""); // 入力欄をリセット
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg bg-gray-800 p-4 rounded-lg shadow-lg mt-6">
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="タスク名を入力"
        className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
      />
      <button
        type="submit"
        className="mt-2 bg-green-500 px-4 py-2 rounded-lg text-lg font-semibold hover:bg-green-600 transition-all w-full"
      >
        タスク追加
      </button>
    </form>
  );
}
