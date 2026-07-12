import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@env/environment';
import { MsPlansEndpoints } from '@core/api/ms-plans-endpoints';
import { ApiResponse } from '@core/common/model/api-response';

export interface LoginRequest  { username: string; password: string; }
export interface LoginResponse { token: string; username: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiMsPlans}${MsPlansEndpoints.auth.login}`;

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(this.url, body).pipe(
      map(r => r.data),
    );
  }

  saveToken(token: string): void { localStorage.setItem('crm_token', token); }
  getToken(): string | null       { return localStorage.getItem('crm_token'); }
  isLoggedIn(): boolean           { return !!this.getToken(); }
}
