import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@env/environment';
import { MsPlansEndpoints } from '@core/api/ms-plans-endpoints';
import { ApiResponse, ListResponse } from '@core/common/model/api-response';
import { Plan, PlanRequest, PlanPriceRequest, PlanFeatureRequest } from '../models/plan.model';

@Injectable({ providedIn: 'root' })
export class PlansService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiMsPlans;

  getAll(): Observable<Plan[]> {
    return this.http.get<ListResponse<Plan>>(`${this.base}${MsPlansEndpoints.plans.root}`)
      .pipe(map(r => r.data));
  }

  getById(id: string): Observable<Plan> {
    return this.http.get<ApiResponse<Plan>>(`${this.base}${MsPlansEndpoints.plans.byId(id)}`)
      .pipe(map(r => r.data));
  }

  create(body: PlanRequest): Observable<Plan> {
    return this.http.post<ApiResponse<Plan>>(`${this.base}${MsPlansEndpoints.plans.root}`, body)
      .pipe(map(r => r.data));
  }

  update(id: string, body: PlanRequest): Observable<Plan> {
    return this.http.put<ApiResponse<Plan>>(`${this.base}${MsPlansEndpoints.plans.byId(id)}`, body)
      .pipe(map(r => r.data));
  }

  deactivate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}${MsPlansEndpoints.plans.byId(id)}`);
  }

  addPrice(planId: string, body: PlanPriceRequest): Observable<Plan> {
    return this.http.post<ApiResponse<Plan>>(`${this.base}${MsPlansEndpoints.plans.prices(planId)}`, body)
      .pipe(map(r => r.data));
  }

  updatePrice(planId: string, priceId: string, body: PlanPriceRequest): Observable<Plan> {
    return this.http.put<ApiResponse<Plan>>(`${this.base}${MsPlansEndpoints.plans.priceById(planId, priceId)}`, body)
      .pipe(map(r => r.data));
  }

  addFeature(planId: string, body: PlanFeatureRequest): Observable<Plan> {
    return this.http.post<ApiResponse<Plan>>(`${this.base}${MsPlansEndpoints.plans.features(planId)}`, body)
      .pipe(map(r => r.data));
  }

  updateFeature(planId: string, featureId: string, body: PlanFeatureRequest): Observable<Plan> {
    return this.http.put<ApiResponse<Plan>>(`${this.base}${MsPlansEndpoints.plans.featureById(planId, featureId)}`, body)
      .pipe(map(r => r.data));
  }

  deleteFeature(planId: string, featureId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}${MsPlansEndpoints.plans.featureById(planId, featureId)}`);
  }
}
