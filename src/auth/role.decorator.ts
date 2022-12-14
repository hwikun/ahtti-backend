import { UserRole } from './../user/entities/user.entity';
import { SetMetadata } from '@nestjs/common';

export type AllowedRols = keyof typeof UserRole | 'Any';

export const Role = (roles: AllowedRols[]) => SetMetadata('roles', roles);
