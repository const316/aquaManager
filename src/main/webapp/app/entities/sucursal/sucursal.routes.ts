import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { SucursalComponent } from './list/sucursal.component';
import { SucursalDetailComponent } from './detail/sucursal-detail.component';
import { SucursalUpdateComponent } from './update/sucursal-update.component';
import SucursalResolve from './route/sucursal-routing-resolve.service';

const sucursalRoute: Routes = [
  {
    path: '',
    component: SucursalComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SucursalDetailComponent,
    resolve: {
      sucursal: SucursalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SucursalUpdateComponent,
    resolve: {
      sucursal: SucursalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SucursalUpdateComponent,
    resolve: {
      sucursal: SucursalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default sucursalRoute;
