import { SetMetadata } from '@nestjs/common';

export enum UserRolesEnum {
  ATENDENTE = 'ATENDENTE',
  PRESIDENTE = 'PRESIDENTE',
  ADVOGADO = 'ADVOGADO'
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRolesEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
