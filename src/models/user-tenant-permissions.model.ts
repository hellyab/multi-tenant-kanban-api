import {belongsTo, Entity, model, property} from '@loopback/repository';
import {UserTenants} from './user-tenants.model';

@model({
  settings: {
    idInjection: false,
    postgresql: {
      schema: 'multi_tenant_kanban',
      table: 'user_tenant_permissions',
    },
  },
})
export class UserTenantPermissions extends Entity {
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
    () => UserTenants,
    {keyFrom: 'user_tenant_id', name: 'user_tenant_id'},
    {
      name: 'user_tenant_id',
      required: true,
    },
  )
  userTenantId: number;

  @property({
    type: 'date',
    required: true,
    postgresql: {
      columnName: 'created_on',
      dataType: 'date',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  createdOn: string;

  @property({
    type: 'date',
    required: true,
    postgresql: {
      columnName: 'modified_on',
      dataType: 'date',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  modifiedOn: string;

  @property({
    type: 'number',
    scale: 0,
    postgresql: {
      columnName: 'created_by',
      dataType: 'integer',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'YES',
    },
  })
  createdBy?: number;

  @property({
    type: 'number',
    scale: 0,
    postgresql: {
      columnName: 'modified_by',
      dataType: 'integer',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'YES',
    },
  })
  modifiedBy?: number;

  @property({
    type: 'boolean',
    required: true,
    postgresql: {
      columnName: 'deleted',
      dataType: 'boolean',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  deleted: boolean;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'permission',
      dataType: 'text',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  permission: string;

  @property({
    type: 'boolean',
    required: true,
    postgresql: {
      columnName: 'allowed',
      dataType: 'boolean',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  allowed: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UserTenantPermissions>) {
    super(data);
  }
}

export interface UserTenantPermissionsRelations {
  // describe navigational properties here
}

export type UserTenantPermissionsWithRelations = UserTenantPermissions &
  UserTenantPermissionsRelations;
