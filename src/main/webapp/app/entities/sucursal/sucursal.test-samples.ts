import { ISucursal, NewSucursal } from './sucursal.model';

export const sampleWithRequiredData: ISucursal = {
  id: 6923,
};

export const sampleWithPartialData: ISucursal = {
  id: 9139,
  telefono: 'phew',
};

export const sampleWithFullData: ISucursal = {
  id: 29054,
  nombre: 'drat agreeable',
  direccion: 'repossess',
  telefono: 'gah yuck reluctantly',
};

export const sampleWithNewData: NewSucursal = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
