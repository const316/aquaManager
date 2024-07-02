import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAlumno } from '../alumno.model';
import { AlumnoService } from '../service/alumno.service';

@Component({
  standalone: true,
  templateUrl: './alumno-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AlumnoDeleteDialogComponent {
  alumno?: IAlumno;

  protected alumnoService = inject(AlumnoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.alumnoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
