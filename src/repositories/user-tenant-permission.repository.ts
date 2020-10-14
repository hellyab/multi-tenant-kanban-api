import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {UserTenant, UserTenantPermission, UserTenantPermissionsRelations} from '../models';
import {PgdbDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';
import {UserTenantRepository} from './user-tenant.repository';

export class UserTenantPermissionRepository extends DefaultCrudRepository<
  UserTenantPermission,
  typeof UserTenantPermission.prototype.id,
  UserTenantPermissionsRelations
> {
  public readonly userTenant: BelongsToAccessor<
    UserTenant,
    typeof UserTenantPermission.prototype.id
  >;
  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
    @repository.getter('UserTenantsRepository')
    utRepositoryGetter: Getter<UserTenantRepository>,
  ) {
    super(UserTenantPermission, dataSource);
    this.userTenant = this.createBelongsToAccessorFor(
      'user_tenant_id',
      utRepositoryGetter,
    );
  }
}
