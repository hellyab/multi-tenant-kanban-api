import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {Role, Tenant, User, UserTenant, UserTenantsRelations} from '../models';
import {PgdbDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';
import {TenantRepository} from './tenant.repository';
import {UserRepository} from './user.repository';
import {RoleRepository} from './role.repository';

export class UserTenantRepository extends DefaultCrudRepository<
  UserTenant,
  typeof UserTenant.prototype.id,
  UserTenantsRelations
> {
  public readonly tenant: BelongsToAccessor<
    Tenant,
    typeof UserTenant.prototype.id
  >;
  public readonly user: BelongsToAccessor<User, typeof UserTenant.prototype.id>;
  public readonly role: BelongsToAccessor<Role, typeof UserTenant.prototype.id>;

  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
    @repository.getter('TenantsRepository')
    tenantsGetter: Getter<TenantRepository>,
    @repository.getter('UsersRepository')
    usersGetter: Getter<UserRepository>,
    @repository.getter('RolesRepository')
    rolesGetter: Getter<RoleRepository>,
  ) {
    super(UserTenant, dataSource);
    this.user = this.createBelongsToAccessorFor('user_id', usersGetter);
    this.tenant = this.createBelongsToAccessorFor('tenant_id', tenantsGetter);
    this.role = this.createBelongsToAccessorFor('role_id', rolesGetter);
  }
}
