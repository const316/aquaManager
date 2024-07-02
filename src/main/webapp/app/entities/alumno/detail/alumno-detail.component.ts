import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IAlumno } from '../alumno.model';

@Component({
  standalone: true,
  selector: 'jhi-alumno-detail',
  templateUrl: './alumno-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class AlumnoDetailComponent {
  alumno = input<IAlumno | null>(null);

  previousState(): void {
    window.history.back();
  }
}
