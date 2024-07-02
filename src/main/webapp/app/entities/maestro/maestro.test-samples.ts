import { IMaestro, NewMaestro } from './maestro.model';

export const sampleWithRequiredData: IMaestro = {
  id: 1596,
};

export const sampleWithPartialData: IMaestro = {
  id: 7177,
  uniqueId: 17073,
};

export const sampleWithFullData: IMaestro = {
  id: 20906,
  uniqueId: 17070,
  nombre: 'itch moisturize',
  apellidos: 'because far hound',
  contacto: 'rightfully',
  activo: 3621,
};

export const sampleWithNewData: NewMaestro = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
