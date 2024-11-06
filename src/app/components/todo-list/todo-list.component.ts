
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { TodoService } from '../../services/todo.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    TodoItemComponent
  ],
  template: `
    <mat-card class="todo-container">
      <mat-card-header>
        <mat-card-title>Distributivna Todo Lista</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <div class="add-todo">
          <mat-form-field class="full-width">
            <mat-label>Dodati novi zadatak</mat-label>
            <input matInput
                   #todoInput
                   (keyup.enter)="addTask(todoInput.value); todoInput.value = ''">
          </mat-form-field>
          <button mat-raised-button
                  color="primary"
                  (click)="addTask(todoInput.value); todoInput.value = ''">
            Dodati
          </button>
        </div>

        <div class="todo-list">
          @for (task of todoService.tasks(); track task.id) {
            <app-todo-item
              [task]="task"
              (toggleComplete)="todoService.toggleTask($event)"
              (editTask)="todoService.editTask($event.id, $event.text)"
              (deleteTask)="todoService.deleteTask($event)">
            </app-todo-item>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .todo-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
    }

    .add-todo {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .full-width {
      width: 100%;
    }

    .todo-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  `]
})
export class TodoListComponent {
  todoService = inject(TodoService);

  addTask(text: string): void {
    if (text.trim()) {
      this.todoService.addTask(text);
    }
  }
}