import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../maestro.test-samples';

import { MaestroFormService } from './maestro-form.service';

describe('Maestro Form Service', () => {
  let service: MaestroFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaestroFormService);
  });

  describe('Service methods', () => {
    describe('createMaestroFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMaestroFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            uniqueId: expect.any(Object),
            nombre: expect.any(Object),
            apellidos: expect.any(Object),
            contacto: expect.any(Object),
            activo: expect.any(Object),
            sucursal: expect.any(Object),
          }),
        );
      });

      it('passing IMaestro should create a new form with FormGroup', () => {
        const formGroup = service.createMaestroFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            uniqueId: expect.any(Object),
            nombre: expect.any(Object),
            apellidos: expect.any(Object),
            contacto: expect.any(Object),
            activo: expect.any(Object),
            sucursal: expect.any(Object),
          }),
        );
      });
    });

    describe('getMaestro', () => {
      it('should return NewMaestro for default Maestro initial value', () => {
        const formGroup = service.createMaestroFormGroup(sampleWithNewData);

        const maestro = service.getMaestro(formGroup) as any;

        expect(maestro).toMatchObject(sampleWithNewData);
      });

      it('should return NewMaestro for empty Maestro initial value', () => {
        const formGroup = service.createMaestroFormGroup();

        const maestro = service.getMaestro(formGroup) as any;

        expect(maestro).toMatchObject({});
      });

      it('should return IMaestro', () => {
        const formGroup = service.createMaestroFormGroup(sampleWithRequiredData);

        const maestro = service.getMaestro(formGroup) as any;

        expect(maestro).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMaestro should not enable id FormControl', () => {
        const formGroup = service.createMaestroFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMaestro should disable id FormControl', () => {
        const formGroup = service.createMaestroFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
