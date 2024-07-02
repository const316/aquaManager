import dayjs from 'dayjs/esm';

import { IAlumno, NewAlumno } from './alumno.model';

export const sampleWithRequiredData: IAlumno = {
  id: 30657,
};

export const sampleWithPartialData: IAlumno = {
  id: 19512,
  uniqueId: 11388,
  apellidos: 'boo',
  direccion: 'sharply alpha',
  contacto: 'triumphantly phooey quietly',
  contacto2: 'where acceptable',
};

export const sampleWithFullData: IAlumno = {
  id: 5429,
  uniqueId: 5268,
  nombre: 'via',
  apellidos: 'ha uneven correctly',
  fechaNacimiento: dayjs('2024-07-02'),
  direccion: 'strictly ample',
  madre: 'weakly temporariness',
  padre: 'fixed physical',
  contacto: 'as',
  contacto2: 'lightly via',
  email: 'Matteo12@gmail.com',
  activo: 17785,
  inscrito: 21015,
};

export const sampleWithNewData: NewAlumno = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
