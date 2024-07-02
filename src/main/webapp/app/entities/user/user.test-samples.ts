import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 1499,
  login: 'QjSvD@C\\[4rIYo',
};

export const sampleWithPartialData: IUser = {
  id: 22889,
  login: 'n',
};

export const sampleWithFullData: IUser = {
  id: 27953,
  login: 'XxI6@fZ\\voK6\\nyxt',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
