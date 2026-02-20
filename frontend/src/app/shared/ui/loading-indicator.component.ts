import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  template: `
    <div class="loading-indicator">
      <span class="spinner" aria-hidden="true"></span>
      <span>{{ message() }}</span>
    </div>
  `,
  styles: `
    .loading-indicator {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #334155;
      font-weight: 500;
    }

    .spinner {
      width: 0.875rem;
      height: 0.875rem;
      border-radius: 9999px;
      border: 2px solid #94a3b8;
      border-top-color: #0f172a;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class LoadingIndicatorComponent {
  readonly message = input('Loading...');
}
