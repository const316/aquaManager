import { ISucursal } from 'app/entities/sucursal/sucursal.model';

export interface IMaestro {
  id: number;
  nombre?: string | null;
  apellidos?: string | null;
  contacto?: string | null;
  activo?: number | null;
  sucursalId?: number | null;
  sucursal?: ISucursal | null;
}

export type NewMaestro = Omit<IMaestro, 'id'> & { id: null };
