/* eslint-disable prettier/prettier */

export enum Role {
  User = 'user',
  Admin = 'admin',
};

export interface JwtPayload {
  readonly sub: number;
  readonly type: Role;
};

export interface ValidatedUser {
  readonly id: number;
  readonly type: Role;
};

export interface validateEmail{
  readonly recipients: string;
  readonly subject:string;
  readonly html:string;
}

