import type { OnInit } from '@angular/core';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingIndicatorComponent } from '../../shared/ui/loading-indicator.component';
import { ApiService, type LivenessData } from '../../core/services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoadingIndicatorComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  readonly liveness = signal<LivenessData | null>(null);
  readonly loading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.refreshHealth();
  }

  refreshHealth(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.apiService
      .getLiveness()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (payload) => {
          this.liveness.set(payload);
          this.loading.set(false);
        },
        error: (error: Error) => {
          this.errorMessage.set(error.message);
          this.loading.set(false);
        },
      });
  }
}
