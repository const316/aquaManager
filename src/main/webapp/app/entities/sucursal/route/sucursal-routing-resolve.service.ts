import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISucursal } from '../sucursal.model';
import { SucursalService } from '../service/sucursal.service';

const sucursalResolve = (route: ActivatedRouteSnapshot): Observable<null | ISucursal> => {
  const id = route.params['id'];
  if (id) {
    return inject(SucursalService)
      .find(id)
      .pipe(
        mergeMap((sucursal: HttpResponse<ISucursal>) => {
          if (sucursal.body) {
            return of(sucursal.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default sucursalResolve;
