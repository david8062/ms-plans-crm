import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@env/environment';
import { MsPlansEndpoints } from '@core/api/ms-plans-endpoints';
import { ApiResponse, ListResponse, PagedResponse } from '@core/common/model/api-response';
import { Subscription, SubscriptionRequest, CancelSubscriptionRequest } from '../models/subscription.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionsService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiMsPlans;

  getAll(page = 0, size = 20): Observable<PagedResponse<Subscription>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PagedResponse<Subscription>>(`${this.base}${MsPlansEndpoints.subscriptions.root}`, { params });
  }

  getById(id: string): Observable<Subscription> {
    return this.http.get<ApiResponse<Subscription>>(`${this.base}${MsPlansEndpoints.subscriptions.byId(id)}`)
      .pipe(map(r => r.data));
  }

  getByTenant(tenantId: string): Observable<Subscription[]> {
    return this.http.get<ListResponse<Subscription>>(`${this.base}${MsPlansEndpoints.subscriptions.byTenant(tenantId)}`)
      .pipe(map(r => r.data));
  }

  create(body: SubscriptionRequest): Observable<Subscription> {
    return this.http.post<ApiResponse<Subscription>>(`${this.base}${MsPlansEndpoints.subscriptions.root}`, body)
      .pipe(map(r => r.data));
  }

  activate(id: string): Observable<Subscription> {
    return this.http.patch<ApiResponse<Subscription>>(`${this.base}${MsPlansEndpoints.subscriptions.activate(id)}`, {})
      .pipe(map(r => r.data));
  }

  suspend(id: string): Observable<Subscription> {
    return this.http.patch<ApiResponse<Subscription>>(`${this.base}${MsPlansEndpoints.subscriptions.suspend(id)}`, {})
      .pipe(map(r => r.data));
  }

  cancel(id: string, body?: CancelSubscriptionRequest): Observable<Subscription> {
    return this.http.patch<ApiResponse<Subscription>>(`${this.base}${MsPlansEndpoints.subscriptions.cancel(id)}`, body ?? {})
      .pipe(map(r => r.data));
  }

  convertTrial(id: string): Observable<Subscription> {
    return this.http.patch<ApiResponse<Subscription>>(`${this.base}${MsPlansEndpoints.subscriptions.convertTrial(id)}`, {})
      .pipe(map(r => r.data));
  }

  /** Dispara el ciclo de expiración (vencer trials/periodos -> PAST_DUE -> SUSPENDED). Devuelve nº de transiciones. */
  runExpiration(): Observable<number> {
    return this.http.post<ApiResponse<{ transitions: number }>>(`${this.base}${MsPlansEndpoints.subscriptions.runExpiration}`, {})
      .pipe(map(r => r.data?.transitions ?? 0));
  }
}
