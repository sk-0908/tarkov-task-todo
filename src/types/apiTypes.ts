export type Trader = {
    name: string;
  };
  
  export type Objective = {
    description: string;
  };
  
  export type TaskRequirement = {
    taskIds: string[];
  };
  
  export type Task = {
    id: string;
    name: string;
    trader?: Trader;
    minPlayerLevel?: number;
    objectives?: Objective[];
    taskRequirements?: TaskRequirement[];
  };
  
  export type PlayerLevel = {
    user_id: string;
    level: number;
  };
  