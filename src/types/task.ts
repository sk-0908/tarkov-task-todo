export interface Task {
    id: string;
    name: string;
    trader: string | null; // null を許容
    min_level: number;
    objectives: string[];
    requirements?: { taskIds: string[] };
    user_id: string;
  }
  