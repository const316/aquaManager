import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AlumnoComponent } from './list/alumno.component';
import { AlumnoDetailComponent } from './detail/alumno-detail.component';
import { AlumnoUpdateComponent } from './update/alumno-update.component';
import AlumnoResolve from './route/alumno-routing-resolve.service';

const alumnoRoute: Routes = [
  {
    path: '',
    component: AlumnoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AlumnoDetailComponent,
    resolve: {
      alumno: AlumnoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AlumnoUpdateComponent,
    resolve: {
      alumno: AlumnoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AlumnoUpdateComponent,
    resolve: {
      alumno: AlumnoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default alumnoRoute;
