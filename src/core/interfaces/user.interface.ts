import {
  AddressInterface
} from './address.interface';
import {
  UserRole
} from '../enums';

export interface UserInterface {
  _id: string,
  email: string,
  password: string,
  address: AddressInterface,
  phoneNumber: string,
  role: UserRole
}
