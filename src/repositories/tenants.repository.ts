import {DefaultCrudRepository} from '@loopback/repository';
import {Tenants, TenantsRelations} from '../models';
import {PgdbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TenantsRepository extends DefaultCrudRepository<
  Tenants,
  typeof Tenants.prototype.id,
  TenantsRelations
> {
  constructor(@inject('datasources.pgdb') dataSource: PgdbDataSource) {
    super(Tenants, dataSource);
  }
}
