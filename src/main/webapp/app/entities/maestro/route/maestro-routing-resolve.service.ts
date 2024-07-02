import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMaestro } from '../maestro.model';
import { MaestroService } from '../service/maestro.service';

const maestroResolve = (route: ActivatedRouteSnapshot): Observable<null | IMaestro> => {
  const id = route.params['id'];
  if (id) {
    return inject(MaestroService)
      .find(id)
      .pipe(
        mergeMap((maestro: HttpResponse<IMaestro>) => {
          if (maestro.body) {
            return of(maestro.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default maestroResolve;
