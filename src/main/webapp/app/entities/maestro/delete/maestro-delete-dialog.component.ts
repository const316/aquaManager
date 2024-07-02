import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IMaestro } from '../maestro.model';
import { MaestroService } from '../service/maestro.service';

@Component({
  standalone: true,
  templateUrl: './maestro-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MaestroDeleteDialogComponent {
  maestro?: IMaestro;

  protected maestroService = inject(MaestroService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.maestroService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
