import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISucursal } from 'app/entities/sucursal/sucursal.model';
import { SucursalService } from 'app/entities/sucursal/service/sucursal.service';
import { IMaestro } from '../maestro.model';
import { MaestroService } from '../service/maestro.service';
import { MaestroFormService, MaestroFormGroup } from './maestro-form.service';

@Component({
  standalone: true,
  selector: 'jhi-maestro-update',
  templateUrl: './maestro-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MaestroUpdateComponent implements OnInit {
  isSaving = false;
  maestro: IMaestro | null = null;

  sucursalsSharedCollection: ISucursal[] = [];

  protected maestroService = inject(MaestroService);
  protected maestroFormService = inject(MaestroFormService);
  protected sucursalService = inject(SucursalService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: MaestroFormGroup = this.maestroFormService.createMaestroFormGroup();

  compareSucursal = (o1: ISucursal | null, o2: ISucursal | null): boolean => this.sucursalService.compareSucursal(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ maestro }) => {
      this.maestro = maestro;
      if (maestro) {
        this.updateForm(maestro);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const maestro = this.maestroFormService.getMaestro(this.editForm);
    if (maestro.id !== null) {
      this.subscribeToSaveResponse(this.maestroService.update(maestro));
    } else {
      this.subscribeToSaveResponse(this.maestroService.create(maestro));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMaestro>>): void {
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

  protected updateForm(maestro: IMaestro): void {
    this.maestro = maestro;
    this.maestroFormService.resetForm(this.editForm, maestro);

    this.sucursalsSharedCollection = this.sucursalService.addSucursalToCollectionIfMissing<ISucursal>(
      this.sucursalsSharedCollection,
      maestro.sucursal,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.sucursalService
      .query()
      .pipe(map((res: HttpResponse<ISucursal[]>) => res.body ?? []))
      .pipe(
        map((sucursals: ISucursal[]) =>
          this.sucursalService.addSucursalToCollectionIfMissing<ISucursal>(sucursals, this.maestro?.sucursal),
        ),
      )
      .subscribe((sucursals: ISucursal[]) => (this.sucursalsSharedCollection = sucursals));
  }
}
