import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAlumno, NewAlumno } from '../alumno.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAlumno for edit and NewAlumnoFormGroupInput for create.
 */
type AlumnoFormGroupInput = IAlumno | PartialWithRequiredKeyOf<NewAlumno>;

type AlumnoFormDefaults = Pick<NewAlumno, 'id'>;

type AlumnoFormGroupContent = {
  id: FormControl<IAlumno['id'] | NewAlumno['id']>;
  nombre: FormControl<IAlumno['nombre']>;
  apellidos: FormControl<IAlumno['apellidos']>;
  fechaNacimiento: FormControl<IAlumno['fechaNacimiento']>;
  direccion: FormControl<IAlumno['direccion']>;
  madre: FormControl<IAlumno['madre']>;
  padre: FormControl<IAlumno['padre']>;
  contacto: FormControl<IAlumno['contacto']>;
  contacto2: FormControl<IAlumno['contacto2']>;
  email: FormControl<IAlumno['email']>;
  activo: FormControl<IAlumno['activo']>;
  inscrito: FormControl<IAlumno['inscrito']>;
  sucursalId: FormControl<IAlumno['sucursalId']>;
  sucursal: FormControl<IAlumno['sucursal']>;
};

export type AlumnoFormGroup = FormGroup<AlumnoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AlumnoFormService {
  createAlumnoFormGroup(alumno: AlumnoFormGroupInput = { id: null }): AlumnoFormGroup {
    const alumnoRawValue = {
      ...this.getFormDefaults(),
      ...alumno,
    };
    return new FormGroup<AlumnoFormGroupContent>({
      id: new FormControl(
        { value: alumnoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nombre: new FormControl(alumnoRawValue.nombre),
      apellidos: new FormControl(alumnoRawValue.apellidos),
      fechaNacimiento: new FormControl(alumnoRawValue.fechaNacimiento),
      direccion: new FormControl(alumnoRawValue.direccion),
      madre: new FormControl(alumnoRawValue.madre),
      padre: new FormControl(alumnoRawValue.padre),
      contacto: new FormControl(alumnoRawValue.contacto),
      contacto2: new FormControl(alumnoRawValue.contacto2),
      email: new FormControl(alumnoRawValue.email),
      activo: new FormControl(alumnoRawValue.activo),
      inscrito: new FormControl(alumnoRawValue.inscrito),
      sucursalId: new FormControl(alumnoRawValue.sucursalId),
      sucursal: new FormControl(alumnoRawValue.sucursal),
    });
  }

  getAlumno(form: AlumnoFormGroup): IAlumno | NewAlumno {
    return form.getRawValue() as IAlumno | NewAlumno;
  }

  resetForm(form: AlumnoFormGroup, alumno: AlumnoFormGroupInput): void {
    const alumnoRawValue = { ...this.getFormDefaults(), ...alumno };
    form.reset(
      {
        ...alumnoRawValue,
        id: { value: alumnoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AlumnoFormDefaults {
    return {
      id: null,
    };
  }
}
