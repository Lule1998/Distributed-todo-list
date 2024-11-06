export interface Task {
    id: string;
    text: string;
    completed: boolean;
    timestamp: number;
    tombstone: boolean;
    lastModified: number;
    modifiedBy: string;
  }