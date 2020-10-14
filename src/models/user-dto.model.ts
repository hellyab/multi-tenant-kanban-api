import {model, property} from '@loopback/repository';
import {TenantDto} from './tenant-dto.model';
import {UserPermissionDto} from './user-permission-dto.model';
import {User} from '@loopback/authentication-jwt';

@model({settings: {}})
export class UserDto extends User {
  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
  })
  middleName?: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
  })
  phone?: string;

  @property({
    type: 'string',
    required: 'true',
  })
  role: string;

  @property({
    type: TenantDto,
    required: true,
  })
  tenant: TenantDto;

  @property.array(UserPermissionDto)
  permissions?: UserPermissionDto[];

  constructor(data?: Partial<UserDto>) {
    super(data);
  }
}
