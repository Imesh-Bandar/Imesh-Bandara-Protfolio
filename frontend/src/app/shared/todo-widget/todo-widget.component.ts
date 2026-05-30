import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Todo, TodoService } from '../../core/services/todo.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-todo-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './todo-widget.component.html',
  styleUrl: './todo-widget.component.scss'
})
export class TodoWidgetComponent {
  todoSvc = inject(TodoService);
  private toast = inject(ToastService);

  newText = '';
  newPriority: 'low' | 'med' | 'high' = 'med';
  collapsed = false;

  get todayLabel(): string {
    return new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  }

  add() {
    if (!this.todoSvc.add(this.todoSvc.todayKey(), this.newText, this.newPriority)) {
      this.toast.error('Type a task first'); return;
    }
    this.newText = '';
    this.toast.success('Task added');
  }
  toggle(t: Todo) { this.todoSvc.toggle(this.todoSvc.todayKey(), t.id); }
  remove(t: Todo) { this.todoSvc.remove(this.todoSvc.todayKey(), t.id); }
}
