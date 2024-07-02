import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMaestro, NewMaestro } from '../maestro.model';

export type PartialUpdateMaestro = Partial<IMaestro> & Pick<IMaestro, 'id'>;

export type EntityResponseType = HttpResponse<IMaestro>;
export type EntityArrayResponseType = HttpResponse<IMaestro[]>;

@Injectable({ providedIn: 'root' })
export class MaestroService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/maestros');

  create(maestro: NewMaestro): Observable<EntityResponseType> {
    return this.http.post<IMaestro>(this.resourceUrl, maestro, { observe: 'response' });
  }

  update(maestro: IMaestro): Observable<EntityResponseType> {
    return this.http.put<IMaestro>(`${this.resourceUrl}/${this.getMaestroIdentifier(maestro)}`, maestro, { observe: 'response' });
  }

  partialUpdate(maestro: PartialUpdateMaestro): Observable<EntityResponseType> {
    return this.http.patch<IMaestro>(`${this.resourceUrl}/${this.getMaestroIdentifier(maestro)}`, maestro, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMaestro>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMaestro[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMaestroIdentifier(maestro: Pick<IMaestro, 'id'>): number {
    return maestro.id;
  }

  compareMaestro(o1: Pick<IMaestro, 'id'> | null, o2: Pick<IMaestro, 'id'> | null): boolean {
    return o1 && o2 ? this.getMaestroIdentifier(o1) === this.getMaestroIdentifier(o2) : o1 === o2;
  }

  addMaestroToCollectionIfMissing<Type extends Pick<IMaestro, 'id'>>(
    maestroCollection: Type[],
    ...maestrosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const maestros: Type[] = maestrosToCheck.filter(isPresent);
    if (maestros.length > 0) {
      const maestroCollectionIdentifiers = maestroCollection.map(maestroItem => this.getMaestroIdentifier(maestroItem));
      const maestrosToAdd = maestros.filter(maestroItem => {
        const maestroIdentifier = this.getMaestroIdentifier(maestroItem);
        if (maestroCollectionIdentifiers.includes(maestroIdentifier)) {
          return false;
        }
        maestroCollectionIdentifiers.push(maestroIdentifier);
        return true;
      });
      return [...maestrosToAdd, ...maestroCollection];
    }
    return maestroCollection;
  }
}
