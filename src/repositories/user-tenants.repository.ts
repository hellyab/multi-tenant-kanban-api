import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {Roles, Tenants, Users, UserTenants, UserTenantsRelations} from '../models';
import {PgdbDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';
import {TenantsRepository} from './tenants.repository';
import {UsersRepository} from './users.repository';
import {RolesRepository} from './roles.repository';

export class UserTenantsRepository extends DefaultCrudRepository<
  UserTenants,
  typeof UserTenants.prototype.id,
  UserTenantsRelations
> {
  public readonly tenant: BelongsToAccessor<
    Tenants,
    typeof UserTenants.prototype.id
  >;
  public readonly user: BelongsToAccessor<
    Users,
    typeof UserTenants.prototype.id
  >;
  public readonly role: BelongsToAccessor<
    Roles,
    typeof UserTenants.prototype.id
  >;

  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
    @repository.getter('TenantsRepository')
    tenantsGetter: Getter<TenantsRepository>,
    @repository.getter('UsersRepository')
    usersGetter: Getter<UsersRepository>,
    @repository.getter('RolesRepository')
    rolesGetter: Getter<RolesRepository>,
  ) {
    super(UserTenants, dataSource);
    this.user = this.createBelongsToAccessorFor('user_id', usersGetter);
    this.tenant = this.createBelongsToAccessorFor('tenant_id', tenantsGetter);
    this.role = this.createBelongsToAccessorFor('role_id', rolesGetter);
  }
}
