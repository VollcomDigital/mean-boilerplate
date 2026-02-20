import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../../shared/models/user.model';
import type { ApiSuccessResponse } from '../../shared/models/api-response.model';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUser = signal<User | null>(this.loadUserFromStorage());
  private readonly token = signal<string | null>(this.loadTokenFromStorage());

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this.token());

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  login(credentials: LoginRequest): Observable<ApiSuccessResponse<AuthResponse>> {
    return this.http
      .post<ApiSuccessResponse<AuthResponse>>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(tap((response) => this.handleAuthResponse(response.data)));
  }

  register(data: RegisterRequest): Observable<ApiSuccessResponse<AuthResponse>> {
    return this.http
      .post<ApiSuccessResponse<AuthResponse>>(`${environment.apiUrl}/auth/register`, data)
      .pipe(tap((response) => this.handleAuthResponse(response.data)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.token.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.token();
  }

  private handleAuthResponse(data: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    this.currentUser.set(data.user);
    this.token.set(data.token);
  }

  private loadTokenFromStorage(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  private loadUserFromStorage(): User | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
