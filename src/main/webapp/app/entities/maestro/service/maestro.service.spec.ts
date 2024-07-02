import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IMaestro } from '../maestro.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../maestro.test-samples';

import { MaestroService } from './maestro.service';

const requireRestSample: IMaestro = {
  ...sampleWithRequiredData,
};

describe('Maestro Service', () => {
  let service: MaestroService;
  let httpMock: HttpTestingController;
  let expectedResult: IMaestro | IMaestro[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(MaestroService);
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

    it('should create a Maestro', () => {
      const maestro = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(maestro).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Maestro', () => {
      const maestro = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(maestro).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Maestro', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Maestro', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Maestro', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMaestroToCollectionIfMissing', () => {
      it('should add a Maestro to an empty array', () => {
        const maestro: IMaestro = sampleWithRequiredData;
        expectedResult = service.addMaestroToCollectionIfMissing([], maestro);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(maestro);
      });

      it('should not add a Maestro to an array that contains it', () => {
        const maestro: IMaestro = sampleWithRequiredData;
        const maestroCollection: IMaestro[] = [
          {
            ...maestro,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMaestroToCollectionIfMissing(maestroCollection, maestro);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Maestro to an array that doesn't contain it", () => {
        const maestro: IMaestro = sampleWithRequiredData;
        const maestroCollection: IMaestro[] = [sampleWithPartialData];
        expectedResult = service.addMaestroToCollectionIfMissing(maestroCollection, maestro);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(maestro);
      });

      it('should add only unique Maestro to an array', () => {
        const maestroArray: IMaestro[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const maestroCollection: IMaestro[] = [sampleWithRequiredData];
        expectedResult = service.addMaestroToCollectionIfMissing(maestroCollection, ...maestroArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const maestro: IMaestro = sampleWithRequiredData;
        const maestro2: IMaestro = sampleWithPartialData;
        expectedResult = service.addMaestroToCollectionIfMissing([], maestro, maestro2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(maestro);
        expect(expectedResult).toContain(maestro2);
      });

      it('should accept null and undefined values', () => {
        const maestro: IMaestro = sampleWithRequiredData;
        expectedResult = service.addMaestroToCollectionIfMissing([], null, maestro, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(maestro);
      });

      it('should return initial array if no Maestro is added', () => {
        const maestroCollection: IMaestro[] = [sampleWithRequiredData];
        expectedResult = service.addMaestroToCollectionIfMissing(maestroCollection, undefined, null);
        expect(expectedResult).toEqual(maestroCollection);
      });
    });

    describe('compareMaestro', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMaestro(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMaestro(entity1, entity2);
        const compareResult2 = service.compareMaestro(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMaestro(entity1, entity2);
        const compareResult2 = service.compareMaestro(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMaestro(entity1, entity2);
        const compareResult2 = service.compareMaestro(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
