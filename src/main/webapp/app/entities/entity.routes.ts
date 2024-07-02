import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'aquaManagerApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'sucursal',
    data: { pageTitle: 'aquaManagerApp.sucursal.home.title' },
    loadChildren: () => import('./sucursal/sucursal.routes'),
  },
  {
    path: 'alumno',
    data: { pageTitle: 'aquaManagerApp.alumno.home.title' },
    loadChildren: () => import('./alumno/alumno.routes'),
  },
  {
    path: 'maestro',
    data: { pageTitle: 'aquaManagerApp.maestro.home.title' },
    loadChildren: () => import('./maestro/maestro.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
