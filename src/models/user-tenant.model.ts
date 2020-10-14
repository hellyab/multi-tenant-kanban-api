import {belongsTo, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity';
import {Role} from './role.model';
import {User} from './user.model';
import {Tenant} from './tenant.model';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'multi_tenant_kanban', table: 'user_tenants'},
  },
})
export class UserTenant extends BaseEntity {
  @property({
    type: 'number',
    scale: 0,
    id: 1,
    postgresql: {
      columnName: 'id',
      dataType: 'integer',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
    },
  })
  id: number;

  @belongsTo(
    () => User,
    {keyFrom: 'user_id', name: 'user_id'},
    {
      name: 'user_id',
      required: true,
    },
  )
  userId: string;

  @belongsTo(
    () => Tenant,
    {keyFrom: 'tenant_id', name: 'tenant_id'},
    {
      name: 'tenant_id',
      required: true,
    },
  )
  tenantId: number;

  @belongsTo(
    () => Role,
    {keyFrom: 'role_id', name: 'role_id'},
    {
      name: 'role_id',
      required: true,
    },
  )
  roleId: number;

  @property({
    type: 'string',
    required: true,
    length: 50,
    postgresql: {
      columnName: 'status',
      dataType: 'character varying',
      dataLength: 50,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  status: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UserTenant>) {
    super(data);
  }
}

export interface UserTenantsRelations {
  // describe navigational properties here
}

export type UserTenantsWithRelations = UserTenant & UserTenantsRelations;
