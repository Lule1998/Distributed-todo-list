import { Injectable, signal, computed } from '@angular/core';
import { TodoCRDT } from '../models/crdt.model';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private crdt = new TodoCRDT(crypto.randomUUID());
  private tasksSignal = signal<Task[]>([]);
  
  readonly tasks = computed(() => this.tasksSignal());
  
  constructor() {
    this.loadFromStorage();
    window.addEventListener('storage', (e) => {
      if (e.key === 'todo-state') {
        this.handleStorageChange();
      }
    });
  }

  private saveToStorage(): void {
    // Pretvaramo Map u array parova za spremanje
    const state = Array.from(this.crdt.getState().entries());
    localStorage.setItem('todo-state', JSON.stringify(state));
    this.updateTasksSignal();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem('todo-state');
    if (stored) {
      try {
        // Parsiramo JSON i kreiramo nove Task objekte
        const parsedData = JSON.parse(stored);
        const state = new Map<string, Task>(
          parsedData.map(([key, value]: [string, any]) => [
            key,
            {
              id: value.id,
              text: value.text,
              completed: value.completed,
              timestamp: value.timestamp,
              tombstone: value.tombstone,
              lastModified: value.lastModified,
              modifiedBy: value.modifiedBy
            }
          ])
        );
        this.crdt.setState(state);
        this.updateTasksSignal();
      } catch (error) {
        console.error('Error loading from storage:', error);
        this.tasksSignal.set([]);
      }
    }
  }

  private updateTasksSignal(): void {
    this.tasksSignal.set(this.crdt.getTasks());
  }

  private handleStorageChange(): void {
    this.loadFromStorage();
  }

  addTask(text: string): void {
    this.crdt.addTask(text);
    this.saveToStorage();
  }

  editTask(taskId: string, newText: string): void {
    this.crdt.editTask(taskId, newText);
    this.saveToStorage();
  }

  toggleTask(taskId: string): void {
    this.crdt.toggleComplete(taskId);
    this.saveToStorage();
  }

  deleteTask(taskId: string): void {
    this.crdt.deleteTask(taskId);
    this.saveToStorage();
  }
}