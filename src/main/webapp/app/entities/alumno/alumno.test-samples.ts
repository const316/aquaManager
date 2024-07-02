import dayjs from 'dayjs/esm';

import { IAlumno, NewAlumno } from './alumno.model';

export const sampleWithRequiredData: IAlumno = {
  id: 30657,
};

export const sampleWithPartialData: IAlumno = {
  id: 19512,
  nombre: 'wherever dereference',
  fechaNacimiento: dayjs('2024-07-02'),
  madre: 'alpha extremely spouse',
  contacto2: 'quietly',
  email: 'Rossie38@yahoo.com',
};

export const sampleWithFullData: IAlumno = {
  id: 26090,
  nombre: 'anti honey ugh',
  apellidos: 'so',
  fechaNacimiento: dayjs('2024-07-02'),
  direccion: 'correctly doss icky',
  madre: 'velocity gladly',
  padre: 'wretched',
  contacto: 'opposite alphabetise',
  contacto2: 'aside fooey',
  email: 'Valentina76@yahoo.com',
  activo: 28277,
  inscrito: 3960,
  sucursalId: 17785,
};

export const sampleWithNewData: NewAlumno = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
