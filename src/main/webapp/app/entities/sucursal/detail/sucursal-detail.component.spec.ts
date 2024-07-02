import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { SucursalDetailComponent } from './sucursal-detail.component';

describe('Sucursal Management Detail Component', () => {
  let comp: SucursalDetailComponent;
  let fixture: ComponentFixture<SucursalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucursalDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: SucursalDetailComponent,
              resolve: { sucursal: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(SucursalDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucursalDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sucursal on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SucursalDetailComponent);

      // THEN
      expect(instance.sucursal()).toEqual(expect.objectContaining({ id: 123 }));
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
