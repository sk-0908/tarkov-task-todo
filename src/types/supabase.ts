export type Database = {
    public: {
      Tables: {
        player_levels: {
          Row: {
            user_id: string;
            level: number;
          };
        };
        completed_tasks: {
          Row: {
            user_id: string;
            task_id: string;
          };
        };
      };
    };
  };
  