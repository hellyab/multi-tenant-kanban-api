import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody} from '@loopback/rest';
import {Tenants, UserDto, Users, UserTenantPermissions, UserTenants} from '../models';
import {
  RolesRepository,
  TenantsRepository,
  UsersRepository,
  UserTenantPermissionsRepository,
  UserTenantsRepository,
} from '../repositories';

export class UserController {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
    @repository(TenantsRepository)
    public tenantsRepository: TenantsRepository,
    @repository(RolesRepository)
    public rolesRepository: RolesRepository,
    @repository(UserTenantsRepository)
    public utRepository: UserTenantsRepository,
    @repository(UserTenantPermissionsRepository)
    public utPermsRepository: UserTenantPermissionsRepository,
  ) {}

  @post('/users', {
    responses: {
      '200': {
        description: 'Users DTO instance',
        content: {'application/json': {schema: {'x-ts-type': UserDto}}},
      },
    },
  })
  async create(@requestBody() userObj: UserDto): Promise<UserDto> {
    // Look for tenant in DB
    let tenantExists = await this.tenantsRepository.findOne({
      where: {
        name: userObj.tenant.name,
        type: userObj.tenant.type,
      },
    });
    // if (tenantExists) {
    //   // Disallow addition of user into existing tenant
    //   throw new HttpErrors.BadRequest(`Tenant already exists.
    //   Please contact tenant admin to send you invite.`);
    // }
    const roleExists = await this.rolesRepository.findOne({
      where: {
        name: userObj.role,
      },
    });
    if (!roleExists) {
      throw new HttpErrors.BadRequest(`Role name is invalid.`);
    }

    // Create tenant first
    if (!tenantExists) {
      tenantExists = await this.tenantsRepository.create(
        new Tenants({
          name: userObj.tenant.name,
          type: userObj.tenant.type,
          status: 'active',
        }),
      );
    }
    const tenant = tenantExists;

    // Look for user in DB
    let userExists = await this.usersRepository.findOne({
      where: {
        username: userObj.username,
      },
    });
    if (!userExists) {
      // Create new user if does not exist
      const userModel = new Users({
        firstName: userObj.firstName,
        middleName: userObj.middleName,
        lastName: userObj.lastName,
        username: userObj.username,
        email: userObj.email,
        phone: userObj.phone,
        defaultTenant: tenant.id!,
      });
      userExists = await this.usersRepository.create(userModel);
    } else {
      // Map the new tenant with existing user
    }
    userObj.id = userExists.id;

    const userTenant = await this.utRepository.create(
      new UserTenants({
        roleId: roleExists.id,
        userId: userExists.id,
        tenantId: tenant.id,
        status: 'active',
      }),
    );
    userObj.tenant.id = tenant.id;

    if (userObj.permissions && userObj.permissions.length > 0) {
      const utPerms = userObj.permissions.map(perm => {
        return new UserTenantPermissions({
          permission: perm.permission,
          allowed: perm.allowed,
          userTenantId: userTenant.id,
        });
      });
      await this.utPermsRepository.createAll(utPerms);
    }
    return userObj;
  }

  @get('/users/count', {
    responses: {
      '200': {
        description: 'Users model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Users) where?: Where<Users>): Promise<Count> {
    return this.usersRepository.count(where);
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of Users model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Users, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Users) filter?: Filter<Users>): Promise<Users[]> {
    return this.usersRepository.find(filter);
  }

  @patch('/users', {
    responses: {
      '200': {
        description: 'Users PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {partial: true}),
        },
      },
    })
    users: Users,
    @param.where(Users) where?: Where<Users>,
  ): Promise<Count> {
    return this.usersRepository.updateAll(users, where);
  }

  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'Users model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Users, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Users, {exclude: 'where'})
    filter?: FilterExcludingWhere<Users>,
  ): Promise<Users> {
    return this.usersRepository.findById(id, filter);
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'Users PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {partial: true}),
        },
      },
    })
    users: Users,
  ): Promise<void> {
    await this.usersRepository.updateById(id, users);
  }

  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'Users PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() users: Users,
  ): Promise<void> {
    await this.usersRepository.replaceById(id, users);
  }

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'Users DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.usersRepository.deleteById(id);
  }
}
