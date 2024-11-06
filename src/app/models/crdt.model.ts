import { Task } from "./task.model";

export class TodoCRDT {
    private clientId: string;
    private tasks: Map<string, Task>;
    private clock: number;
  
    constructor(clientId: string) {
      this.clientId = clientId;
      this.tasks = new Map();
      this.clock = 0;
    }
  
    private generateTaskId(): string {
      return `${this.clientId}-${this.clock}-${Date.now()}`;
    }
  
    private tick(): number {
      this.clock++;
      return this.clock;
    }
  
    addTask(text: string): Task {
      const taskId = this.generateTaskId();
      const timestamp = this.tick();
      
      const task: Task = {
        id: taskId,
        text,
        completed: false,
        timestamp,
        tombstone: false,
        lastModified: timestamp,
        modifiedBy: this.clientId
      };
      
      this.tasks.set(taskId, task);
      return task;
    }
  
    editTask(taskId: string, newText: string): Task | null {
      const task = this.tasks.get(taskId);
      if (!task || task.tombstone) return null;
  
      const timestamp = this.tick();
      
      if (timestamp > task.lastModified) {
        const updatedTask = {
          ...task,
          text: newText,
          lastModified: timestamp,
          modifiedBy: this.clientId
        };
        this.tasks.set(taskId, updatedTask);
        return updatedTask;
      }
      return null;
    }
  
    toggleComplete(taskId: string): Task | null {
      const task = this.tasks.get(taskId);
      if (!task || task.tombstone) return null;
  
      const timestamp = this.tick();
      
      if (timestamp > task.lastModified) {
        const updatedTask = {
          ...task,
          completed: !task.completed,
          lastModified: timestamp,
          modifiedBy: this.clientId
        };
        this.tasks.set(taskId, updatedTask);
        return updatedTask;
      }
      return null;
    }
  
    deleteTask(taskId: string): Task | null {
      const task = this.tasks.get(taskId);
      if (!task) return null;
  
      const timestamp = this.tick();
      
      if (timestamp > task.lastModified) {
        const updatedTask = {
          ...task,
          tombstone: true,
          lastModified: timestamp,
          modifiedBy: this.clientId
        };
        this.tasks.set(taskId, updatedTask);
        return updatedTask;
      }
      return null;
    }
  
    merge(otherCRDT: TodoCRDT): void {
      this.clock = Math.max(this.clock, otherCRDT.clock);
  
      for (const [taskId, otherTask] of otherCRDT.tasks) {
        const localTask = this.tasks.get(taskId);
        
        if (!localTask) {
          this.tasks.set(taskId, {...otherTask});
        } else if (otherTask.lastModified > localTask.lastModified) {
          this.tasks.set(taskId, {...otherTask});
        } else if (otherTask.lastModified === localTask.lastModified && 
                   otherTask.modifiedBy > localTask.modifiedBy) {
          this.tasks.set(taskId, {...otherTask});
        }
      }
    }
  
    getTasks(): Task[] {
      return Array.from(this.tasks.values())
        .filter(task => !task.tombstone)
        .sort((a, b) => b.timestamp - a.timestamp);
    }
  
    getState(): Map<string, Task> {
      return new Map(this.tasks);
    }
  
    setState(state: Map<string, Task>): void {
      this.tasks = new Map(state);
    }
  }
  