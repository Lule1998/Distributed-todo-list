import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <div class="todo-item" [class.completed]="task.completed">
      @if (editing) {
        <mat-form-field class="edit-form">
          <input matInput
                 #editInput
                 [value]="task.text"
                 (keyup.enter)="finishEditing(editInput.value)"
                 (keyup.escape)="cancelEditing()"
                 (blur)="finishEditing(editInput.value)">
          <button matSuffix
                  mat-icon-button
                  color="primary"
                  (click)="finishEditing(editInput.value)">
            <mat-icon>check</mat-icon>
          </button>
        </mat-form-field>
      } @else {
        <div class="todo-content">
          <mat-checkbox
            [checked]="task.completed"
            (change)="toggleComplete.emit(task.id)"
            color="primary">
            <span class="todo-text">{{ task.text }}</span>
          </mat-checkbox>
          
          <div class="todo-actions">
            <button mat-icon-button (click)="startEditing()">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteTask.emit(task.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .todo-item {
      background: white;
      border-radius: 4px;
      padding: 8px;
      margin-bottom: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      &.completed {
        background: #f8f9fa;
        
        .todo-text {
          text-decoration: line-through;
          color: #6c757d;
        }
      }
    }

    .todo-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 40px;
    }

    .todo-text {
      margin-left: 8px;
      font-size: 16px;
    }

    .todo-actions {
      display: flex;
      gap: 4px;
      opacity: 0.2;
      transition: opacity 0.3s ease;
    }

    .todo-item:hover .todo-actions {
      opacity: 1;
    }

    .edit-form {
      width: 100%;
      margin: 0;

      ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }
    }

    mat-checkbox {
      margin-right: 8px;
    }
  `]
})
export class TodoItemComponent {
  @Input({ required: true }) task!: Task;
  @Output() toggleComplete = new EventEmitter<string>();
  @Output() editTask = new EventEmitter<{id: string, text: string}>();
  @Output() deleteTask = new EventEmitter<string>();

  editing = false;

  startEditing(): void {
    this.editing = true;
  }

  finishEditing(newText: string): void {
    if (this.editing && newText.trim() && newText !== this.task.text) {
      this.editTask.emit({ id: this.task.id, text: newText.trim() });
    }
    this.editing = false;
  }

  cancelEditing(): void {
    this.editing = false;
  }
}