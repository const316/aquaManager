import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAlumno, NewAlumno } from '../alumno.model';

export type PartialUpdateAlumno = Partial<IAlumno> & Pick<IAlumno, 'id'>;

type RestOf<T extends IAlumno | NewAlumno> = Omit<T, 'fechaNacimiento'> & {
  fechaNacimiento?: string | null;
};

export type RestAlumno = RestOf<IAlumno>;

export type NewRestAlumno = RestOf<NewAlumno>;

export type PartialUpdateRestAlumno = RestOf<PartialUpdateAlumno>;

export type EntityResponseType = HttpResponse<IAlumno>;
export type EntityArrayResponseType = HttpResponse<IAlumno[]>;

@Injectable({ providedIn: 'root' })
export class AlumnoService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/alumnos');

  create(alumno: NewAlumno): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(alumno);
    return this.http
      .post<RestAlumno>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(alumno: IAlumno): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(alumno);
    return this.http
      .put<RestAlumno>(`${this.resourceUrl}/${this.getAlumnoIdentifier(alumno)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(alumno: PartialUpdateAlumno): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(alumno);
    return this.http
      .patch<RestAlumno>(`${this.resourceUrl}/${this.getAlumnoIdentifier(alumno)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAlumno>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAlumno[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAlumnoIdentifier(alumno: Pick<IAlumno, 'id'>): number {
    return alumno.id;
  }

  compareAlumno(o1: Pick<IAlumno, 'id'> | null, o2: Pick<IAlumno, 'id'> | null): boolean {
    return o1 && o2 ? this.getAlumnoIdentifier(o1) === this.getAlumnoIdentifier(o2) : o1 === o2;
  }

  addAlumnoToCollectionIfMissing<Type extends Pick<IAlumno, 'id'>>(
    alumnoCollection: Type[],
    ...alumnosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const alumnos: Type[] = alumnosToCheck.filter(isPresent);
    if (alumnos.length > 0) {
      const alumnoCollectionIdentifiers = alumnoCollection.map(alumnoItem => this.getAlumnoIdentifier(alumnoItem));
      const alumnosToAdd = alumnos.filter(alumnoItem => {
        const alumnoIdentifier = this.getAlumnoIdentifier(alumnoItem);
        if (alumnoCollectionIdentifiers.includes(alumnoIdentifier)) {
          return false;
        }
        alumnoCollectionIdentifiers.push(alumnoIdentifier);
        return true;
      });
      return [...alumnosToAdd, ...alumnoCollection];
    }
    return alumnoCollection;
  }

  protected convertDateFromClient<T extends IAlumno | NewAlumno | PartialUpdateAlumno>(alumno: T): RestOf<T> {
    return {
      ...alumno,
      fechaNacimiento: alumno.fechaNacimiento?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restAlumno: RestAlumno): IAlumno {
    return {
      ...restAlumno,
      fechaNacimiento: restAlumno.fechaNacimiento ? dayjs(restAlumno.fechaNacimiento) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAlumno>): HttpResponse<IAlumno> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAlumno[]>): HttpResponse<IAlumno[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
