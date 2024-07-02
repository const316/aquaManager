import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ISucursal } from '../sucursal.model';
import { SucursalService } from '../service/sucursal.service';

@Component({
  standalone: true,
  templateUrl: './sucursal-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SucursalDeleteDialogComponent {
  sucursal?: ISucursal;

  protected sucursalService = inject(SucursalService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sucursalService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
