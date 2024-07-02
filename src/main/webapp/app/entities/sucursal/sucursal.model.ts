export interface ISucursal {
  id: number;
  uniqueId?: number | null;
  nombre?: string | null;
  direccion?: string | null;
  telefono?: string | null;
}

export type NewSucursal = Omit<ISucursal, 'id'> & { id: null };
