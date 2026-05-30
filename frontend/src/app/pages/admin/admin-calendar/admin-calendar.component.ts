import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { Todo, TodoService } from '../../../core/services/todo.service';

@Component({
  selector: 'app-admin-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-calendar.component.html',
  styleUrl: './admin-calendar.component.scss'
})
export class AdminCalendarComponent {
  private toast = inject(ToastService);
  todoSvc = inject(TodoService);

  viewMonth = signal(new Date().getMonth());
  viewYear  = signal(new Date().getFullYear());
  selectedKey = signal(this.todoSvc.toKey(new Date()));

  newText = '';
  newPriority: 'low' | 'med' | 'high' = 'med';

  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  monthCells = computed(() => {
    const m = this.viewMonth(), y = this.viewYear();
    const firstOfMonth = new Date(y, m, 1);
    const start = new Date(firstOfMonth);
    start.setDate(1 - firstOfMonth.getDay());
    const todayKey = this.todoSvc.toKey(new Date());
    const selKey = this.selectedKey();
    const map = this.todoSvc.todos();
    const cells: any[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = this.todoSvc.toKey(d);
      const list = map[key] || [];
      cells.push({
        date: d, key,
        inMonth: d.getMonth() === m,
        isToday: key === todayKey,
        isSelected: key === selKey,
        count: list.length,
        hasHigh: list.some(t => t.priority === 'high' && !t.done)
      });
    }
    return cells;
  });

  viewLabel  = computed(() => `${this.monthNames[this.viewMonth()]} ${this.viewYear()}`);
  selectedDateLabel = computed(() => this.todoSvc.fromKey(this.selectedKey()).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
  selectedTodos = computed(() => this.todoSvc.listFor(this.selectedKey()));
  monthStats = computed(() => this.todoSvc.monthStats(this.viewYear(), this.viewMonth()));

  prevMonth() {
    if (this.viewMonth() === 0) { this.viewMonth.set(11); this.viewYear.update(y => y - 1); }
    else this.viewMonth.update(m => m - 1);
  }
  nextMonth() {
    if (this.viewMonth() === 11) { this.viewMonth.set(0); this.viewYear.update(y => y + 1); }
    else this.viewMonth.update(m => m + 1);
  }
  goToday() {
    const d = new Date();
    this.viewMonth.set(d.getMonth());
    this.viewYear.set(d.getFullYear());
    this.selectedKey.set(this.todoSvc.toKey(d));
  }
  selectCell(cell: { date: Date; key: string; inMonth: boolean }) {
    if (!cell.inMonth) {
      this.viewMonth.set(cell.date.getMonth());
      this.viewYear.set(cell.date.getFullYear());
    }
    this.selectedKey.set(cell.key);
  }

  addTodo() {
    if (!this.todoSvc.add(this.selectedKey(), this.newText, this.newPriority)) {
      this.toast.error('Type a task first'); return;
    }
    this.newText = '';
    this.toast.success('Task added');
  }
  toggleDone(t: Todo) { this.todoSvc.toggle(this.selectedKey(), t.id); }
  deleteTodo(t: Todo) { this.todoSvc.remove(this.selectedKey(), t.id); this.toast.success('Task removed'); }
  clearCompleted() {
    const n = this.todoSvc.clearDone(this.selectedKey());
    if (n) this.toast.success(`${n} completed task${n === 1 ? '' : 's'} cleared`);
    else this.toast.info('Nothing to clear');
  }
}
