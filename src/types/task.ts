export interface Task {
  id: string;
  name: string;
  trader: string | null;
  min_level: number;
  objectives: { description: string; completed: boolean }[]; // 各目標の完了状態を管理
  requirements?: { taskIds: string[] };
  user_id: string;
  completed: boolean; // タスクの完了状態
}
