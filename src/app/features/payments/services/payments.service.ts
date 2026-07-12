import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@env/environment';
import { MsPlansEndpoints } from '@core/api/ms-plans-endpoints';
import { ApiResponse, PagedResponse } from '@core/common/model/api-response';
import { Payment, PaymentRequest } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiMsPlans;

  getAll(page = 0, size = 20): Observable<PagedResponse<Payment>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PagedResponse<Payment>>(`${this.base}${MsPlansEndpoints.payments.root}`, { params });
  }

  record(body: PaymentRequest): Observable<Payment> {
    return this.http.post<ApiResponse<Payment>>(`${this.base}${MsPlansEndpoints.payments.root}`, body)
      .pipe(map(r => r.data));
  }

  markFailed(id: string): Observable<Payment> {
    return this.http.patch<ApiResponse<Payment>>(`${this.base}${MsPlansEndpoints.payments.fail(id)}`, {})
      .pipe(map(r => r.data));
  }

  refund(id: string): Observable<Payment> {
    return this.http.patch<ApiResponse<Payment>>(`${this.base}${MsPlansEndpoints.payments.refund(id)}`, {})
      .pipe(map(r => r.data));
  }
}
