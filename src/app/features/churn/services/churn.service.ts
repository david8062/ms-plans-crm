import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@env/environment';
import { MsPlansEndpoints } from '@core/api/ms-plans-endpoints';
import { ApiResponse, PagedResponse } from '@core/common/model/api-response';
import { Churn, ChurnRequest, ChurnSummary } from '../models/churn.model';

@Injectable({ providedIn: 'root' })
export class ChurnService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiMsPlans;

  getAll(page = 0, size = 20): Observable<PagedResponse<Churn>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PagedResponse<Churn>>(`${this.base}${MsPlansEndpoints.churn.root}`, { params });
  }

  getSummary(): Observable<ChurnSummary> {
    return this.http.get<ApiResponse<ChurnSummary>>(`${this.base}${MsPlansEndpoints.churn.summary}`)
      .pipe(map(r => r.data));
  }

  register(body: ChurnRequest): Observable<Churn> {
    return this.http.post<ApiResponse<Churn>>(`${this.base}${MsPlansEndpoints.churn.root}`, body)
      .pipe(map(r => r.data));
  }

  update(id: string, body: ChurnRequest): Observable<Churn> {
    return this.http.put<ApiResponse<Churn>>(`${this.base}${MsPlansEndpoints.churn.byId(id)}`, body)
      .pipe(map(r => r.data));
  }
}
