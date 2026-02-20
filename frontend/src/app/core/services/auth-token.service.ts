import type { Signal } from '@angular/core';
import { Injectable, signal } from '@angular/core';

const TOKEN_STORAGE_KEY = 'mean_auth_token';

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  private readonly tokenState = signal<string | null>(this.readTokenFromStorage());
  public readonly token: Signal<string | null> = this.tokenState.asReadonly();

  getToken(): string | null {
    return this.tokenState();
  }

  setToken(token: string): void {
    this.tokenState.set(token);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  }

  clearToken(): void {
    this.tokenState.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }

  private readTokenFromStorage(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }
}
