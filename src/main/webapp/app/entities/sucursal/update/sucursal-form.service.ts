import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISucursal, NewSucursal } from '../sucursal.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISucursal for edit and NewSucursalFormGroupInput for create.
 */
type SucursalFormGroupInput = ISucursal | PartialWithRequiredKeyOf<NewSucursal>;

type SucursalFormDefaults = Pick<NewSucursal, 'id'>;

type SucursalFormGroupContent = {
  id: FormControl<ISucursal['id'] | NewSucursal['id']>;
  nombre: FormControl<ISucursal['nombre']>;
  direccion: FormControl<ISucursal['direccion']>;
  telefono: FormControl<ISucursal['telefono']>;
};

export type SucursalFormGroup = FormGroup<SucursalFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SucursalFormService {
  createSucursalFormGroup(sucursal: SucursalFormGroupInput = { id: null }): SucursalFormGroup {
    const sucursalRawValue = {
      ...this.getFormDefaults(),
      ...sucursal,
    };
    return new FormGroup<SucursalFormGroupContent>({
      id: new FormControl(
        { value: sucursalRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nombre: new FormControl(sucursalRawValue.nombre),
      direccion: new FormControl(sucursalRawValue.direccion),
      telefono: new FormControl(sucursalRawValue.telefono),
    });
  }

  getSucursal(form: SucursalFormGroup): ISucursal | NewSucursal {
    return form.getRawValue() as ISucursal | NewSucursal;
  }

  resetForm(form: SucursalFormGroup, sucursal: SucursalFormGroupInput): void {
    const sucursalRawValue = { ...this.getFormDefaults(), ...sucursal };
    form.reset(
      {
        ...sucursalRawValue,
        id: { value: sucursalRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SucursalFormDefaults {
    return {
      id: null,
    };
  }
}
