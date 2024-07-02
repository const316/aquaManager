import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../sucursal.test-samples';

import { SucursalFormService } from './sucursal-form.service';

describe('Sucursal Form Service', () => {
  let service: SucursalFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SucursalFormService);
  });

  describe('Service methods', () => {
    describe('createSucursalFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSucursalFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            uniqueId: expect.any(Object),
            nombre: expect.any(Object),
            direccion: expect.any(Object),
            telefono: expect.any(Object),
          }),
        );
      });

      it('passing ISucursal should create a new form with FormGroup', () => {
        const formGroup = service.createSucursalFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            uniqueId: expect.any(Object),
            nombre: expect.any(Object),
            direccion: expect.any(Object),
            telefono: expect.any(Object),
          }),
        );
      });
    });

    describe('getSucursal', () => {
      it('should return NewSucursal for default Sucursal initial value', () => {
        const formGroup = service.createSucursalFormGroup(sampleWithNewData);

        const sucursal = service.getSucursal(formGroup) as any;

        expect(sucursal).toMatchObject(sampleWithNewData);
      });

      it('should return NewSucursal for empty Sucursal initial value', () => {
        const formGroup = service.createSucursalFormGroup();

        const sucursal = service.getSucursal(formGroup) as any;

        expect(sucursal).toMatchObject({});
      });

      it('should return ISucursal', () => {
        const formGroup = service.createSucursalFormGroup(sampleWithRequiredData);

        const sucursal = service.getSucursal(formGroup) as any;

        expect(sucursal).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISucursal should not enable id FormControl', () => {
        const formGroup = service.createSucursalFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSucursal should disable id FormControl', () => {
        const formGroup = service.createSucursalFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
