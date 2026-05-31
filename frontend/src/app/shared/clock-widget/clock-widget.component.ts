import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clock-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clock-widget.component.html',
  styleUrl: './clock-widget.component.scss'
})
export class ClockWidgetComponent implements OnInit, OnDestroy {
  now = signal(new Date());
  private timer?: any;

  ngOnInit() {
    const align = 1000 - (Date.now() % 1000);
    setTimeout(() => {
      this.now.set(new Date());
      this.timer = setInterval(() => this.now.set(new Date()), 1000);
    }, align);
  }
  ngOnDestroy() { if (this.timer) clearInterval(this.timer); }

  /* Analog clock hand rotations */
  hourDeg   = computed(() => ((this.now().getHours() % 12) + this.now().getMinutes() / 60) * 30);
  minuteDeg = computed(() => (this.now().getMinutes() + this.now().getSeconds() / 60) * 6);
  secondDeg = computed(() => this.now().getSeconds() * 6);

  /* Digital read-outs */
  hh = computed(() => String(this.now().getHours() % 12 || 12).padStart(2, '0'));
  mm = computed(() => String(this.now().getMinutes()).padStart(2, '0'));
  ss = computed(() => String(this.now().getSeconds()).padStart(2, '0'));
  ap = computed(() => this.now().getHours() >= 12 ? 'PM' : 'AM');

  weekday = computed(() => this.now().toLocaleDateString([], { weekday: 'long' }));
  dayNum  = computed(() => this.now().getDate());
  monthYear = computed(() => this.now().toLocaleDateString([], { month: 'long', year: 'numeric' }));

  /* Greeting based on time of day */
  greeting = computed(() => {
    const h = this.now().getHours();
    if (h < 5)  return 'Good night';
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    if (h < 21) return 'Good evening';
    return 'Good night';
  });

  /* Twelve tick marks around the analog face */
  ticks = Array.from({ length: 12 }, (_, i) => i);
}
