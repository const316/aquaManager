import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISucursal } from '../sucursal.model';
import { SucursalService } from '../service/sucursal.service';
import { SucursalFormService, SucursalFormGroup } from './sucursal-form.service';

@Component({
  standalone: true,
  selector: 'jhi-sucursal-update',
  templateUrl: './sucursal-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SucursalUpdateComponent implements OnInit {
  isSaving = false;
  sucursal: ISucursal | null = null;

  protected sucursalService = inject(SucursalService);
  protected sucursalFormService = inject(SucursalFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: SucursalFormGroup = this.sucursalFormService.createSucursalFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sucursal }) => {
      this.sucursal = sucursal;
      if (sucursal) {
        this.updateForm(sucursal);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sucursal = this.sucursalFormService.getSucursal(this.editForm);
    if (sucursal.id !== null) {
      this.subscribeToSaveResponse(this.sucursalService.update(sucursal));
    } else {
      this.subscribeToSaveResponse(this.sucursalService.create(sucursal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISucursal>>): void {
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

  protected updateForm(sucursal: ISucursal): void {
    this.sucursal = sucursal;
    this.sucursalFormService.resetForm(this.editForm, sucursal);
  }
}
