import { IMaestro, NewMaestro } from './maestro.model';

export const sampleWithRequiredData: IMaestro = {
  id: 1596,
};

export const sampleWithPartialData: IMaestro = {
  id: 7177,
  nombre: 'in ah',
};

export const sampleWithFullData: IMaestro = {
  id: 2129,
  nombre: 'emancipate',
  apellidos: 'frank shuck rim',
  contacto: 'fizz',
  activo: 8178,
  sucursalId: 17320,
};

export const sampleWithNewData: NewMaestro = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
