import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageQuery } from '../common/model/page-query.model';
import { PagedResponse } from '../common/model/api-response';

export abstract class BasePaginatedService<T> {

  protected constructor(
    protected http: HttpClient,
    protected baseUrl: string,
  ) {}

  protected buildParams(query: PageQuery & Record<string, any>): HttpParams {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value);
      }
    });
    return params;
  }

  getPage(query: PageQuery & Record<string, any>): Observable<PagedResponse<T>> {
    const params = this.buildParams(query);
    return this.http.get<PagedResponse<T>>(this.baseUrl, { params });
  }
}
