import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { MaestroDetailComponent } from './maestro-detail.component';

describe('Maestro Management Detail Component', () => {
  let comp: MaestroDetailComponent;
  let fixture: ComponentFixture<MaestroDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaestroDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: MaestroDetailComponent,
              resolve: { maestro: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(MaestroDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaestroDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load maestro on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MaestroDetailComponent);

      // THEN
      expect(instance.maestro()).toEqual(expect.objectContaining({ id: 123 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
