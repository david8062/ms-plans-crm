import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@env/environment';
import { MsPlansEndpoints } from '@core/api/ms-plans-endpoints';
import { ApiResponse } from '@core/common/model/api-response';
import { RevenueMetrics } from '../models/revenue-metrics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiMsPlans;

  getRevenue(): Observable<RevenueMetrics> {
    return this.http.get<ApiResponse<RevenueMetrics>>(`${this.base}${MsPlansEndpoints.analytics.revenue}`)
      .pipe(map(r => r.data));
  }
}
