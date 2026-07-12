import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/components/toast/toast.service';
import { ApiError } from '../common/model/api-response';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);
  const token = localStorage.getItem('crm_token');

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('crm_token');
        router.navigate(['/login']);
        return throwError(() => error);
      }
      const apiError = error.error as ApiError | undefined;
      const msg = apiError?.message ?? 'Ha ocurrido un error inesperado';
      toast.error(msg);
      return throwError(() => error);
    }),
  );
};
