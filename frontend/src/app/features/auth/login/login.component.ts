import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, type ApiResponse } from '../../../core/services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="login-card">
      <h2>Login</h2>
      <p class="hint">Placeholder – implement JWT auth in production.</p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="field">
          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email" />
          @if (form.get('email')?.invalid && form.get('email')?.touched) {
            <span class="error">Valid email required</span>
          }
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input id="password" type="password" formControlName="password" />
          @if (form.get('password')?.invalid && form.get('password')?.touched) {
            <span class="error">Password required</span>
          }
        </div>
        @if (message()) {
          <p class="message">{{ message() }}</p>
        }
        <button type="submit" [disabled]="form.invalid || loading()">
          {{ loading() ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  `,
  styles: [
    `
      .login-card {
        max-width: 400px;
        padding: 2rem;
        background: var(--color-surface);
        border-radius: 8px;
        border: 1px solid var(--color-border);
      }
      .login-card h2 {
        margin-top: 0;
      }
      .hint {
        color: var(--color-muted);
        font-size: 0.875rem;
        margin-bottom: 1.5rem;
      }
      .field {
        margin-bottom: 1rem;
      }
      .field label {
        display: block;
        margin-bottom: 0.25rem;
        font-weight: 500;
      }
      .field input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--color-border);
        border-radius: 4px;
      }
      .error {
        color: var(--color-error);
        font-size: 0.75rem;
      }
      .message {
        margin: 1rem 0;
        padding: 0.5rem;
        background: var(--color-bg-muted);
        border-radius: 4px;
      }
      button {
        margin-top: 0.5rem;
        padding: 0.5rem 1.5rem;
        background: var(--color-primary);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `,
  ],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loading = signal(false);
  message = signal('');

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.message.set('');

    this.api
      .post<{ message: string; token: string | null }>('/api/auth/login', this.form.getRawValue())
      .subscribe({
        next: (res: ApiResponse<{ message: string; token: string | null }>) => {
          this.loading.set(false);
          if (res.data?.token) {
            localStorage.setItem('token', res.data.token);
            this.router.navigate(['/']);
          } else {
            this.message.set(res.data?.message ?? 'Login endpoint ready – add JWT in backend.');
          }
        },
        error: () => {
          this.loading.set(false);
          this.message.set('Login failed. Check console.');
        },
      });
  }
}
