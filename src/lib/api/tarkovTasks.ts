export async function fetchTarkovTasks() {
    const response = await fetch("/api/tarkovTasks");
    if (!response.ok) {
      throw new Error(`タスクの取得に失敗しました: ${response.statusText}`);
    }
    return response.json();
  }
  