import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { SucursalService } from '../service/sucursal.service';
import { ISucursal } from '../sucursal.model';
import { SucursalFormService } from './sucursal-form.service';

import { SucursalUpdateComponent } from './sucursal-update.component';

describe('Sucursal Management Update Component', () => {
  let comp: SucursalUpdateComponent;
  let fixture: ComponentFixture<SucursalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sucursalFormService: SucursalFormService;
  let sucursalService: SucursalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SucursalUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SucursalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SucursalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sucursalFormService = TestBed.inject(SucursalFormService);
    sucursalService = TestBed.inject(SucursalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const sucursal: ISucursal = { id: 456 };

      activatedRoute.data = of({ sucursal });
      comp.ngOnInit();

      expect(comp.sucursal).toEqual(sucursal);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISucursal>>();
      const sucursal = { id: 123 };
      jest.spyOn(sucursalFormService, 'getSucursal').mockReturnValue(sucursal);
      jest.spyOn(sucursalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sucursal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sucursal }));
      saveSubject.complete();

      // THEN
      expect(sucursalFormService.getSucursal).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(sucursalService.update).toHaveBeenCalledWith(expect.objectContaining(sucursal));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISucursal>>();
      const sucursal = { id: 123 };
      jest.spyOn(sucursalFormService, 'getSucursal').mockReturnValue({ id: null });
      jest.spyOn(sucursalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sucursal: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sucursal }));
      saveSubject.complete();

      // THEN
      expect(sucursalFormService.getSucursal).toHaveBeenCalled();
      expect(sucursalService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISucursal>>();
      const sucursal = { id: 123 };
      jest.spyOn(sucursalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sucursal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sucursalService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
