import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISucursal, NewSucursal } from '../sucursal.model';

export type PartialUpdateSucursal = Partial<ISucursal> & Pick<ISucursal, 'id'>;

export type EntityResponseType = HttpResponse<ISucursal>;
export type EntityArrayResponseType = HttpResponse<ISucursal[]>;

@Injectable({ providedIn: 'root' })
export class SucursalService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sucursals');

  create(sucursal: NewSucursal): Observable<EntityResponseType> {
    return this.http.post<ISucursal>(this.resourceUrl, sucursal, { observe: 'response' });
  }

  update(sucursal: ISucursal): Observable<EntityResponseType> {
    return this.http.put<ISucursal>(`${this.resourceUrl}/${this.getSucursalIdentifier(sucursal)}`, sucursal, { observe: 'response' });
  }

  partialUpdate(sucursal: PartialUpdateSucursal): Observable<EntityResponseType> {
    return this.http.patch<ISucursal>(`${this.resourceUrl}/${this.getSucursalIdentifier(sucursal)}`, sucursal, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISucursal>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISucursal[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSucursalIdentifier(sucursal: Pick<ISucursal, 'id'>): number {
    return sucursal.id;
  }

  compareSucursal(o1: Pick<ISucursal, 'id'> | null, o2: Pick<ISucursal, 'id'> | null): boolean {
    return o1 && o2 ? this.getSucursalIdentifier(o1) === this.getSucursalIdentifier(o2) : o1 === o2;
  }

  addSucursalToCollectionIfMissing<Type extends Pick<ISucursal, 'id'>>(
    sucursalCollection: Type[],
    ...sucursalsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const sucursals: Type[] = sucursalsToCheck.filter(isPresent);
    if (sucursals.length > 0) {
      const sucursalCollectionIdentifiers = sucursalCollection.map(sucursalItem => this.getSucursalIdentifier(sucursalItem));
      const sucursalsToAdd = sucursals.filter(sucursalItem => {
        const sucursalIdentifier = this.getSucursalIdentifier(sucursalItem);
        if (sucursalCollectionIdentifiers.includes(sucursalIdentifier)) {
          return false;
        }
        sucursalCollectionIdentifiers.push(sucursalIdentifier);
        return true;
      });
      return [...sucursalsToAdd, ...sucursalCollection];
    }
    return sucursalCollection;
  }
}
