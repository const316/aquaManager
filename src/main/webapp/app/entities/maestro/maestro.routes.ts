import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { MaestroComponent } from './list/maestro.component';
import { MaestroDetailComponent } from './detail/maestro-detail.component';
import { MaestroUpdateComponent } from './update/maestro-update.component';
import MaestroResolve from './route/maestro-routing-resolve.service';

const maestroRoute: Routes = [
  {
    path: '',
    component: MaestroComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MaestroDetailComponent,
    resolve: {
      maestro: MaestroResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MaestroUpdateComponent,
    resolve: {
      maestro: MaestroResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MaestroUpdateComponent,
    resolve: {
      maestro: MaestroResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default maestroRoute;
