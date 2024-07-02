import dayjs from 'dayjs/esm';
import { ISucursal } from 'app/entities/sucursal/sucursal.model';

export interface IAlumno {
  id: number;
  uniqueId?: number | null;
  nombre?: string | null;
  apellidos?: string | null;
  fechaNacimiento?: dayjs.Dayjs | null;
  direccion?: string | null;
  madre?: string | null;
  padre?: string | null;
  contacto?: string | null;
  contacto2?: string | null;
  email?: string | null;
  activo?: number | null;
  inscrito?: number | null;
  sucursal?: ISucursal | null;
}

export type NewAlumno = Omit<IAlumno, 'id'> & { id: null };
