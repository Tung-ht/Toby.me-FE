import axios from 'axios';
import { Decoder, array, nullable, object, string } from 'decoders';
import { loadUser } from '../components/App/App.slice';
import { store } from '../state/store';

export interface PublicUser {
  username: string;
  bio: string | null;
  image: string | null;
}

export interface User extends PublicUser {
  email: string;
  token: string;
  roles: string[];
}

export const userDecoder: Decoder<User> = object({
  email: string,
  token: string,
  username: string,
  bio: nullable(string),
  image: nullable(string),
  roles: array(string),
});

export interface UserSettings extends PublicUser {
  email: string;
  password: string | null;
}

export interface UpdateUserSettings extends PublicUser {
  email: string;
}

export interface UserForRegistration {
  username: string;
  email: string;
  password: string;
}

export interface RegistrationVerify {
  email: string;
  otp: string;
}

export enum ActionRegistration {
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

export function loadUserIntoApp(user: User) {
  localStorage.setItem('token', user.token);
  axios.defaults.headers.Authorization = `Bearer ${user.token}`;
  store.dispatch(loadUser(user));
}
