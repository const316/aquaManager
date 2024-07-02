import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMaestro, NewMaestro } from '../maestro.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMaestro for edit and NewMaestroFormGroupInput for create.
 */
type MaestroFormGroupInput = IMaestro | PartialWithRequiredKeyOf<NewMaestro>;

type MaestroFormDefaults = Pick<NewMaestro, 'id'>;

type MaestroFormGroupContent = {
  id: FormControl<IMaestro['id'] | NewMaestro['id']>;
  nombre: FormControl<IMaestro['nombre']>;
  apellidos: FormControl<IMaestro['apellidos']>;
  contacto: FormControl<IMaestro['contacto']>;
  activo: FormControl<IMaestro['activo']>;
  sucursalId: FormControl<IMaestro['sucursalId']>;
  sucursal: FormControl<IMaestro['sucursal']>;
};

export type MaestroFormGroup = FormGroup<MaestroFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MaestroFormService {
  createMaestroFormGroup(maestro: MaestroFormGroupInput = { id: null }): MaestroFormGroup {
    const maestroRawValue = {
      ...this.getFormDefaults(),
      ...maestro,
    };
    return new FormGroup<MaestroFormGroupContent>({
      id: new FormControl(
        { value: maestroRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nombre: new FormControl(maestroRawValue.nombre),
      apellidos: new FormControl(maestroRawValue.apellidos),
      contacto: new FormControl(maestroRawValue.contacto),
      activo: new FormControl(maestroRawValue.activo),
      sucursalId: new FormControl(maestroRawValue.sucursalId),
      sucursal: new FormControl(maestroRawValue.sucursal),
    });
  }

  getMaestro(form: MaestroFormGroup): IMaestro | NewMaestro {
    return form.getRawValue() as IMaestro | NewMaestro;
  }

  resetForm(form: MaestroFormGroup, maestro: MaestroFormGroupInput): void {
    const maestroRawValue = { ...this.getFormDefaults(), ...maestro };
    form.reset(
      {
        ...maestroRawValue,
        id: { value: maestroRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MaestroFormDefaults {
    return {
      id: null,
    };
  }
}
