import { ISucursal } from 'app/entities/sucursal/sucursal.model';

export interface IMaestro {
  id: number;
  uniqueId?: number | null;
  nombre?: string | null;
  apellidos?: string | null;
  contacto?: string | null;
  activo?: number | null;
  sucursal?: ISucursal | null;
}

export type NewMaestro = Omit<IMaestro, 'id'> & { id: null };
