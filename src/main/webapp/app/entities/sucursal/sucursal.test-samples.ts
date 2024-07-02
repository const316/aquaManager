import { ISucursal, NewSucursal } from './sucursal.model';

export const sampleWithRequiredData: ISucursal = {
  id: 28000,
};

export const sampleWithPartialData: ISucursal = {
  id: 5238,
  nombre: 'mine',
  direccion: 'scooter and',
  telefono: 'recapitulation',
};

export const sampleWithFullData: ISucursal = {
  id: 30395,
  uniqueId: 368,
  nombre: 'pish butterfly following',
  direccion: 'wherever without',
  telefono: 'aside',
};

export const sampleWithNewData: NewSucursal = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
