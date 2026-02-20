import { Component, signal, inject, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { JsonPipe } from '@angular/common';

interface HealthData {
  status: string;
  timestamp: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div class="home">
      <h2>Welcome to MEAN Stack</h2>
      <p class="subtitle">Cloud-native • TypeScript • 12-Factor</p>

      @if (health(); as data) {
        <div class="health-card">
          <h3>API Health</h3>
          <p><strong>Status:</strong> {{ data.status }}</p>
          <p><strong>Timestamp:</strong> {{ data.timestamp }}</p>
        </div>
      } @else if (loading()) {
        <p>Checking API...</p>
      } @else if (error()) {
        <p class="error">API unreachable. Is the backend running?</p>
      }
    </div>
  `,
  styles: [
    `
      .home {
        max-width: 600px;
      }
      .home h2 {
        margin-bottom: 0.5rem;
      }
      .subtitle {
        color: var(--color-muted);
        margin-bottom: 2rem;
      }
      .health-card {
        padding: 1.5rem;
        background: var(--color-surface);
        border-radius: 8px;
        border: 1px solid var(--color-border);
      }
      .health-card h3 {
        margin-top: 0;
      }
      .error {
        color: var(--color-error);
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  private readonly api = inject(ApiService);

  health = signal<HealthData | null>(null);
  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    this.api.get<HealthData>('/health/liveness').subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.health.set(res.data);
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
