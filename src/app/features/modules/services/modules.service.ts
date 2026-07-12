import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@env/environment';
import { MsPlansEndpoints } from '@core/api/ms-plans-endpoints';
import { ApiResponse, ListResponse } from '@core/common/model/api-response';
import { Module, ModuleRequest, SubscriptionModule, AddModuleRequest } from '../models/module.model';

@Injectable({ providedIn: 'root' })
export class ModulesService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiMsPlans;

  getAll(): Observable<Module[]> {
    return this.http.get<ListResponse<Module>>(`${this.base}${MsPlansEndpoints.modules.root}`)
      .pipe(map(r => r.data));
  }

  getAllActive(): Observable<Module[]> {
    return this.http.get<ListResponse<Module>>(`${this.base}${MsPlansEndpoints.modules.active}`)
      .pipe(map(r => r.data));
  }

  create(body: ModuleRequest): Observable<Module> {
    return this.http.post<ApiResponse<Module>>(`${this.base}${MsPlansEndpoints.modules.root}`, body)
      .pipe(map(r => r.data));
  }

  update(id: string, body: ModuleRequest): Observable<Module> {
    return this.http.put<ApiResponse<Module>>(`${this.base}${MsPlansEndpoints.modules.byId(id)}`, body)
      .pipe(map(r => r.data));
  }

  deactivate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}${MsPlansEndpoints.modules.byId(id)}`);
  }

  getSubscriptionModules(subscriptionId: string): Observable<SubscriptionModule[]> {
    return this.http.get<ListResponse<SubscriptionModule>>(`${this.base}${MsPlansEndpoints.modules.forSubscription(subscriptionId)}`)
      .pipe(map(r => r.data));
  }

  addToSubscription(subscriptionId: string, body: AddModuleRequest): Observable<SubscriptionModule> {
    return this.http.post<ApiResponse<SubscriptionModule>>(`${this.base}${MsPlansEndpoints.modules.forSubscription(subscriptionId)}`, body)
      .pipe(map(r => r.data));
  }

  removeFromSubscription(subscriptionId: string, moduleSlug: string): Observable<void> {
    return this.http.delete<void>(`${this.base}${MsPlansEndpoints.modules.removeFromSub(subscriptionId, moduleSlug)}`);
  }
}
