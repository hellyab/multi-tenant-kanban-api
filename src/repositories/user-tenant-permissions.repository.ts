import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {UserTenantPermissions, UserTenantPermissionsRelations, UserTenants} from '../models';
import {PgdbDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';
import {UserTenantsRepository} from './user-tenants.repository';

export class UserTenantPermissionsRepository extends DefaultCrudRepository<
  UserTenantPermissions,
  typeof UserTenantPermissions.prototype.id,
  UserTenantPermissionsRelations
> {
  public readonly userTenant: BelongsToAccessor<
    UserTenants,
    typeof UserTenantPermissions.prototype.id
  >;
  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
    @repository.getter('UserTenantsRepository')
    utRepositoryGetter: Getter<UserTenantsRepository>,
  ) {
    super(UserTenantPermissions, dataSource);
    this.userTenant = this.createBelongsToAccessorFor(
      'user_tenant_id',
      utRepositoryGetter,
    );
  }
}
