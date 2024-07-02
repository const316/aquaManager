import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ISucursal } from '../sucursal.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../sucursal.test-samples';

import { SucursalService } from './sucursal.service';

const requireRestSample: ISucursal = {
  ...sampleWithRequiredData,
};

describe('Sucursal Service', () => {
  let service: SucursalService;
  let httpMock: HttpTestingController;
  let expectedResult: ISucursal | ISucursal[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(SucursalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Sucursal', () => {
      const sucursal = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(sucursal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Sucursal', () => {
      const sucursal = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(sucursal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Sucursal', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Sucursal', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Sucursal', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSucursalToCollectionIfMissing', () => {
      it('should add a Sucursal to an empty array', () => {
        const sucursal: ISucursal = sampleWithRequiredData;
        expectedResult = service.addSucursalToCollectionIfMissing([], sucursal);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sucursal);
      });

      it('should not add a Sucursal to an array that contains it', () => {
        const sucursal: ISucursal = sampleWithRequiredData;
        const sucursalCollection: ISucursal[] = [
          {
            ...sucursal,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSucursalToCollectionIfMissing(sucursalCollection, sucursal);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Sucursal to an array that doesn't contain it", () => {
        const sucursal: ISucursal = sampleWithRequiredData;
        const sucursalCollection: ISucursal[] = [sampleWithPartialData];
        expectedResult = service.addSucursalToCollectionIfMissing(sucursalCollection, sucursal);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sucursal);
      });

      it('should add only unique Sucursal to an array', () => {
        const sucursalArray: ISucursal[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const sucursalCollection: ISucursal[] = [sampleWithRequiredData];
        expectedResult = service.addSucursalToCollectionIfMissing(sucursalCollection, ...sucursalArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sucursal: ISucursal = sampleWithRequiredData;
        const sucursal2: ISucursal = sampleWithPartialData;
        expectedResult = service.addSucursalToCollectionIfMissing([], sucursal, sucursal2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sucursal);
        expect(expectedResult).toContain(sucursal2);
      });

      it('should accept null and undefined values', () => {
        const sucursal: ISucursal = sampleWithRequiredData;
        expectedResult = service.addSucursalToCollectionIfMissing([], null, sucursal, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sucursal);
      });

      it('should return initial array if no Sucursal is added', () => {
        const sucursalCollection: ISucursal[] = [sampleWithRequiredData];
        expectedResult = service.addSucursalToCollectionIfMissing(sucursalCollection, undefined, null);
        expect(expectedResult).toEqual(sucursalCollection);
      });
    });

    describe('compareSucursal', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSucursal(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSucursal(entity1, entity2);
        const compareResult2 = service.compareSucursal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSucursal(entity1, entity2);
        const compareResult2 = service.compareSucursal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSucursal(entity1, entity2);
        const compareResult2 = service.compareSucursal(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
