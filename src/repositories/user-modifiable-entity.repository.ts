import {DefaultCrudRepository} from '@loopback/repository';
import {UserModifiableEntity, UserModifiableEntityRelations} from '../models';
import {PgdbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserModifiableEntityRepository extends DefaultCrudRepository<
  UserModifiableEntity,
  typeof UserModifiableEntity.prototype.id,
  UserModifiableEntityRelations
> {
  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
  ) {
    super(UserModifiableEntity, dataSource);
  }
}
