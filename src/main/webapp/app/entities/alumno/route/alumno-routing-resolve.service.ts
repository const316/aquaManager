import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAlumno } from '../alumno.model';
import { AlumnoService } from '../service/alumno.service';

const alumnoResolve = (route: ActivatedRouteSnapshot): Observable<null | IAlumno> => {
  const id = route.params['id'];
  if (id) {
    return inject(AlumnoService)
      .find(id)
      .pipe(
        mergeMap((alumno: HttpResponse<IAlumno>) => {
          if (alumno.body) {
            return of(alumno.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default alumnoResolve;
