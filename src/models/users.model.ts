import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'multi_tenant_kanban', table: 'users'},
  },
})
export class Users extends Entity {
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

  @property({
    type: 'string',
    required: true,
    length: 50,
    postgresql: {
      columnName: 'first_name',
      dataType: 'character varying',
      dataLength: 50,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  firstName: string;

  @property({
    type: 'string',
    length: 50,
    postgresql: {
      columnName: 'middle_name',
      dataType: 'character varying',
      dataLength: 50,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  middleName?: string;

  @property({
    type: 'string',
    length: 50,
    postgresql: {
      columnName: 'last_name',
      dataType: 'character varying',
      dataLength: 50,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  lastName?: string;

  @property({
    type: 'string',
    required: true,
    length: 150,
    postgresql: {
      columnName: 'username',
      dataType: 'character varying',
      dataLength: 150,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  username: string;

  @property({
    type: 'string',
    length: 150,
    postgresql: {
      columnName: 'email',
      dataType: 'character varying',
      dataLength: 150,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  email?: string;

  @property({
    type: 'string',
    length: 15,
    postgresql: {
      columnName: 'phone',
      dataType: 'character varying',
      dataLength: 15,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  phone?: string;

  @property({
    type: 'date',
    required: true,
    postgresql: {
      columnName: 'created_on',
      dataType: 'timestamp with time zone',
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
      dataType: 'timestamp with time zone',
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
    type: 'number',
    required: true,
    scale: 0,
    postgresql: {
      columnName: 'default_tenant',
      dataType: 'integer',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
    },
  })
  defaultTenant: number;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'last_login',
      dataType: 'timestamp with time zone',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  lastLogin?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {
  // describe navigational properties here
}

export type UsersWithRelations = Users & UsersRelations;
