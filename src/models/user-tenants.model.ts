import {belongsTo, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity';
import {Roles} from './roles.model';
import {Users} from './users.model';
import {Tenants} from './tenants.model';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'multi_tenant_kanban', table: 'user_tenants'},
  },
})
export class UserTenants extends BaseEntity {
  @property({
    type: 'number',
    required: true,
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
    () => Users,
    {keyFrom: 'user_id', name: 'user_id'},
    {
      name: 'user_id',
      required: true,
    },
  )
  userId: number;

  @belongsTo(
    () => Tenants,
    {keyFrom: 'tenant_id', name: 'tenant_id'},
    {
      name: 'tenant_id',
      required: true,
    },
  )
  tenantId: number;

  @belongsTo(
    () => Roles,
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

  constructor(data?: Partial<UserTenants>) {
    super(data);
  }
}

export interface UserTenantsRelations {
  // describe navigational properties here
}

export type UserTenantsWithRelations = UserTenants & UserTenantsRelations;
