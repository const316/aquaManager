import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { ISucursal } from 'app/entities/sucursal/sucursal.model';
import { SucursalService } from 'app/entities/sucursal/service/sucursal.service';
import { AlumnoService } from '../service/alumno.service';
import { IAlumno } from '../alumno.model';
import { AlumnoFormService } from './alumno-form.service';

import { AlumnoUpdateComponent } from './alumno-update.component';

describe('Alumno Management Update Component', () => {
  let comp: AlumnoUpdateComponent;
  let fixture: ComponentFixture<AlumnoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let alumnoFormService: AlumnoFormService;
  let alumnoService: AlumnoService;
  let sucursalService: SucursalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AlumnoUpdateComponent],
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
      .overrideTemplate(AlumnoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AlumnoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    alumnoFormService = TestBed.inject(AlumnoFormService);
    alumnoService = TestBed.inject(AlumnoService);
    sucursalService = TestBed.inject(SucursalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Sucursal query and add missing value', () => {
      const alumno: IAlumno = { id: 456 };
      const sucursal: ISucursal = { id: 777 };
      alumno.sucursal = sucursal;

      const sucursalCollection: ISucursal[] = [{ id: 769 }];
      jest.spyOn(sucursalService, 'query').mockReturnValue(of(new HttpResponse({ body: sucursalCollection })));
      const additionalSucursals = [sucursal];
      const expectedCollection: ISucursal[] = [...additionalSucursals, ...sucursalCollection];
      jest.spyOn(sucursalService, 'addSucursalToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ alumno });
      comp.ngOnInit();

      expect(sucursalService.query).toHaveBeenCalled();
      expect(sucursalService.addSucursalToCollectionIfMissing).toHaveBeenCalledWith(
        sucursalCollection,
        ...additionalSucursals.map(expect.objectContaining),
      );
      expect(comp.sucursalsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const alumno: IAlumno = { id: 456 };
      const sucursal: ISucursal = { id: 14847 };
      alumno.sucursal = sucursal;

      activatedRoute.data = of({ alumno });
      comp.ngOnInit();

      expect(comp.sucursalsSharedCollection).toContain(sucursal);
      expect(comp.alumno).toEqual(alumno);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAlumno>>();
      const alumno = { id: 123 };
      jest.spyOn(alumnoFormService, 'getAlumno').mockReturnValue(alumno);
      jest.spyOn(alumnoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ alumno });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: alumno }));
      saveSubject.complete();

      // THEN
      expect(alumnoFormService.getAlumno).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(alumnoService.update).toHaveBeenCalledWith(expect.objectContaining(alumno));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAlumno>>();
      const alumno = { id: 123 };
      jest.spyOn(alumnoFormService, 'getAlumno').mockReturnValue({ id: null });
      jest.spyOn(alumnoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ alumno: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: alumno }));
      saveSubject.complete();

      // THEN
      expect(alumnoFormService.getAlumno).toHaveBeenCalled();
      expect(alumnoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAlumno>>();
      const alumno = { id: 123 };
      jest.spyOn(alumnoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ alumno });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(alumnoService.update).toHaveBeenCalled();
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
