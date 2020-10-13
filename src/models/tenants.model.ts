import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'multi_tenant_kanban', table: 'tenants'},
  },
})
export class Tenants extends Entity {
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
    length: 100,
    postgresql: {
      columnName: 'name',
      dataType: 'character varying',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    length: 50,
    postgresql: {
      columnName: 'type',
      dataType: 'character varying',
      dataLength: 50,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  type: string;

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
    type: 'string',
    length: 100,
    postgresql: {
      columnName: 'address1',
      dataType: 'character varying',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  address1?: string;

  @property({
    type: 'string',
    length: 100,
    postgresql: {
      columnName: 'address2',
      dataType: 'character varying',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  address2?: string;

  @property({
    type: 'string',
    length: 100,
    postgresql: {
      columnName: 'address3',
      dataType: 'character varying',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  address3?: string;

  @property({
    type: 'string',
    length: 100,
    postgresql: {
      columnName: 'address4',
      dataType: 'character varying',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  address4?: string;

  @property({
    type: 'string',
    length: 100,
    postgresql: {
      columnName: 'city',
      dataType: 'character varying',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  city?: string;

  @property({
    type: 'string',
    length: 100,
    postgresql: {
      columnName: 'state',
      dataType: 'character varying',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  state?: string;

  @property({
    type: 'string',
    length: 20,
    postgresql: {
      columnName: 'zip',
      dataType: 'character varying',
      dataLength: 20,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  zip?: string;

  @property({
    type: 'string',
    length: 50,
    postgresql: {
      columnName: 'country',
      dataType: 'character varying',
      dataLength: 50,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  country?: string;

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

  constructor(data?: Partial<Tenants>) {
    super(data);
  }
}

export interface TenantsRelations {
  // describe navigational properties here
}

export type TenantsWithRelations = Tenants & TenantsRelations;
