import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'multi_tenant_kanban', table: 'user_credentials'},
  },
})
export class UserCredentials extends Entity {
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
    type: 'number',
    required: true,
    scale: 0,
    postgresql: {
      columnName: 'user_id',
      dataType: 'integer',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
    },
  })
  userId: number;

  @property({
    type: 'string',
    required: true,
    length: 50,
    postgresql: {
      columnName: 'auth_provider',
      dataType: 'character varying',
      dataLength: 50,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  authProvider: string;

  @property({
    type: 'string',
    length: 100,
    postgresql: {
      columnName: 'auth_id',
      dataType: 'character varying',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  authId?: string;

  @property({
    type: 'string',
    length: 100,
    postgresql: {
      columnName: 'auth_token',
      dataType: 'character varying',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  authToken?: string;

  @property({
    type: 'string',
    length: 60,
    postgresql: {
      columnName: 'password',
      dataType: 'character varying',
      dataLength: 60,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  password?: string;

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

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UserCredentials>) {
    super(data);
  }
}

export interface UserCredentialsRelations {
  // describe navigational properties here
}

export type UserCredentialsWithRelations = UserCredentials &
  UserCredentialsRelations;
