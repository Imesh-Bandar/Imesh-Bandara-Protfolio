import { Injectable, signal, computed } from '@angular/core';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
  priority: 'low' | 'med' | 'high';
  createdAt: number;
}

export type TodoMap = Record<string, Todo[]>; // key = YYYY-MM-DD

const STORAGE_KEY = 'admin_calendar_todos';

@Injectable({ providedIn: 'root' })
export class TodoService {
  /** All todos keyed by date. Signal so any component re-renders on change. */
  todos = signal<TodoMap>(this.load());

  /** Today's key */
  todayKey = computed(() => this.toKey(new Date()));

  todaysList = computed<Todo[]>(() => {
    const list = this.todos()[this.todayKey()] || [];
    return list.slice().sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      const order = { high: 0, med: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });
  });

  todayCounts = computed(() => {
    const list = this.todos()[this.todayKey()] || [];
    return { total: list.length, done: list.filter(t => t.done).length };
  });

  private load(): TodoMap {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos()));
  }

  toKey(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  fromKey(k: string): Date {
    const [y, m, d] = k.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  listFor(key: string): Todo[] {
    return (this.todos()[key] || []).slice().sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      const order = { high: 0, med: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });
  }

  add(key: string, text: string, priority: Todo['priority'] = 'med'): boolean {
    const t = text.trim();
    if (!t) return false;
    const todo: Todo = { id: Date.now(), text: t, done: false, priority, createdAt: Date.now() };
    this.todos.update(map => {
      const next = { ...map };
      next[key] = [...(next[key] || []), todo];
      return next;
    });
    this.persist();
    return true;
  }

  toggle(key: string, id: number) {
    this.todos.update(map => {
      const list = (map[key] || []).map(t => t.id === id ? { ...t, done: !t.done } : t);
      return { ...map, [key]: list };
    });
    this.persist();
  }

  remove(key: string, id: number) {
    this.todos.update(map => {
      const list = (map[key] || []).filter(t => t.id !== id);
      const next = { ...map };
      if (list.length) next[key] = list; else delete next[key];
      return next;
    });
    this.persist();
  }

  clearDone(key: string): number {
    let removed = 0;
    this.todos.update(map => {
      const list = (map[key] || []).filter(t => { if (t.done) { removed++; return false; } return true; });
      const next = { ...map };
      if (list.length) next[key] = list; else delete next[key];
      return next;
    });
    if (removed) this.persist();
    return removed;
  }

  monthStats(year: number, month: number): { total: number; done: number } {
    let total = 0, done = 0;
    const map = this.todos();
    for (const [k, list] of Object.entries(map)) {
      const d = this.fromKey(k);
      if (d.getFullYear() === year && d.getMonth() === month) {
        total += list.length;
        done += list.filter(t => t.done).length;
      }
    }
    return { total, done };
  }
}
