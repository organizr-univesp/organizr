import { UserRole } from '@/modules/business/domain/user-role.entity';
import { SetMetadata } from '@nestjs/common';

export const rolesMetadataKey = 'roles';

export const Roles = (...roles: UserRole[]) =>
    SetMetadata(rolesMetadataKey, roles);
