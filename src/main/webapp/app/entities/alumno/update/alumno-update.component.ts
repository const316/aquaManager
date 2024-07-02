import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISucursal } from 'app/entities/sucursal/sucursal.model';
import { SucursalService } from 'app/entities/sucursal/service/sucursal.service';
import { IAlumno } from '../alumno.model';
import { AlumnoService } from '../service/alumno.service';
import { AlumnoFormService, AlumnoFormGroup } from './alumno-form.service';

@Component({
  standalone: true,
  selector: 'jhi-alumno-update',
  templateUrl: './alumno-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AlumnoUpdateComponent implements OnInit {
  isSaving = false;
  alumno: IAlumno | null = null;

  sucursalsSharedCollection: ISucursal[] = [];

  protected alumnoService = inject(AlumnoService);
  protected alumnoFormService = inject(AlumnoFormService);
  protected sucursalService = inject(SucursalService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AlumnoFormGroup = this.alumnoFormService.createAlumnoFormGroup();

  compareSucursal = (o1: ISucursal | null, o2: ISucursal | null): boolean => this.sucursalService.compareSucursal(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ alumno }) => {
      this.alumno = alumno;
      if (alumno) {
        this.updateForm(alumno);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const alumno = this.alumnoFormService.getAlumno(this.editForm);
    if (alumno.id !== null) {
      this.subscribeToSaveResponse(this.alumnoService.update(alumno));
    } else {
      this.subscribeToSaveResponse(this.alumnoService.create(alumno));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAlumno>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(alumno: IAlumno): void {
    this.alumno = alumno;
    this.alumnoFormService.resetForm(this.editForm, alumno);

    this.sucursalsSharedCollection = this.sucursalService.addSucursalToCollectionIfMissing<ISucursal>(
      this.sucursalsSharedCollection,
      alumno.sucursal,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.sucursalService
      .query()
      .pipe(map((res: HttpResponse<ISucursal[]>) => res.body ?? []))
      .pipe(
        map((sucursals: ISucursal[]) => this.sucursalService.addSucursalToCollectionIfMissing<ISucursal>(sucursals, this.alumno?.sucursal)),
      )
      .subscribe((sucursals: ISucursal[]) => (this.sucursalsSharedCollection = sucursals));
  }
}
