import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface LivenessData {
  status: string;
  uptimeSeconds: number;
  timestamp: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginData {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly healthBaseUrl = environment.healthBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getLiveness(): Observable<LivenessData> {
    return this.http
      .get<ApiSuccessResponse<LivenessData>>(`${this.healthBaseUrl}/liveness`)
      .pipe(map((response) => response.data));
  }

  login(payload: LoginPayload): Observable<LoginData> {
    return this.http
      .post<ApiSuccessResponse<LoginData>>(`${this.apiBaseUrl}/auth/login`, payload)
      .pipe(map((response) => response.data));
  }
}
