import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '5455e177-06b0-4e96-948a-c11d5ba4901c',
};

export const sampleWithPartialData: IAuthority = {
  name: 'a2db2af6-0981-4cc7-91e1-055136739cc3',
};

export const sampleWithFullData: IAuthority = {
  name: 'd5f5b098-af3d-4286-a2be-e1fbfa44ef12',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
