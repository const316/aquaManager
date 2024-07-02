import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { ISucursal } from 'app/entities/sucursal/sucursal.model';
import { SucursalService } from 'app/entities/sucursal/service/sucursal.service';
import { MaestroService } from '../service/maestro.service';
import { IMaestro } from '../maestro.model';
import { MaestroFormService } from './maestro-form.service';

import { MaestroUpdateComponent } from './maestro-update.component';

describe('Maestro Management Update Component', () => {
  let comp: MaestroUpdateComponent;
  let fixture: ComponentFixture<MaestroUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let maestroFormService: MaestroFormService;
  let maestroService: MaestroService;
  let sucursalService: SucursalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MaestroUpdateComponent],
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
      .overrideTemplate(MaestroUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MaestroUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    maestroFormService = TestBed.inject(MaestroFormService);
    maestroService = TestBed.inject(MaestroService);
    sucursalService = TestBed.inject(SucursalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Sucursal query and add missing value', () => {
      const maestro: IMaestro = { id: 456 };
      const sucursal: ISucursal = { id: 19824 };
      maestro.sucursal = sucursal;

      const sucursalCollection: ISucursal[] = [{ id: 7113 }];
      jest.spyOn(sucursalService, 'query').mockReturnValue(of(new HttpResponse({ body: sucursalCollection })));
      const additionalSucursals = [sucursal];
      const expectedCollection: ISucursal[] = [...additionalSucursals, ...sucursalCollection];
      jest.spyOn(sucursalService, 'addSucursalToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ maestro });
      comp.ngOnInit();

      expect(sucursalService.query).toHaveBeenCalled();
      expect(sucursalService.addSucursalToCollectionIfMissing).toHaveBeenCalledWith(
        sucursalCollection,
        ...additionalSucursals.map(expect.objectContaining),
      );
      expect(comp.sucursalsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const maestro: IMaestro = { id: 456 };
      const sucursal: ISucursal = { id: 4826 };
      maestro.sucursal = sucursal;

      activatedRoute.data = of({ maestro });
      comp.ngOnInit();

      expect(comp.sucursalsSharedCollection).toContain(sucursal);
      expect(comp.maestro).toEqual(maestro);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMaestro>>();
      const maestro = { id: 123 };
      jest.spyOn(maestroFormService, 'getMaestro').mockReturnValue(maestro);
      jest.spyOn(maestroService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ maestro });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: maestro }));
      saveSubject.complete();

      // THEN
      expect(maestroFormService.getMaestro).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(maestroService.update).toHaveBeenCalledWith(expect.objectContaining(maestro));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMaestro>>();
      const maestro = { id: 123 };
      jest.spyOn(maestroFormService, 'getMaestro').mockReturnValue({ id: null });
      jest.spyOn(maestroService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ maestro: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: maestro }));
      saveSubject.complete();

      // THEN
      expect(maestroFormService.getMaestro).toHaveBeenCalled();
      expect(maestroService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMaestro>>();
      const maestro = { id: 123 };
      jest.spyOn(maestroService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ maestro });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(maestroService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSucursal', () => {
      it('Should forward to sucursalService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(sucursalService, 'compareSucursal');
        comp.compareSucursal(entity, entity2);
        expect(sucursalService.compareSucursal).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
