import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {SecurityBindings} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import {v4 as uuid} from 'uuid';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  SchemaObject,
} from '@loopback/rest';
import {Tenant, User, UserDto, UserTenant, UserTenantPermission} from '../models';
import {
  RoleRepository,
  TenantRepository,
  UserRepository,
  UserTenantPermissionRepository,
  UserTenantRepository,
} from '../repositories';
import {RefreshTokenServiceBindings, TokenServiceBindings, UserServiceBindings} from '../keys';
import {Credentials, MyUserService, TokenObject} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {authenticate, TokenService} from '@loopback/authentication';
import _ from 'lodash';
import {RefreshTokenService} from '../services';
// Describes the type of grant object taken in by method "refresh"
type RefreshGrant = {
  refreshToken: string;
};

// Describes the schema of grant object
const RefreshGrantSchema: SchemaObject = {
  type: 'object',
  required: ['refreshToken'],
  properties: {
    refreshToken: {
      type: 'string',
    },
  },
};

// Describes the request body of grant object
const RefreshGrantRequestBody = {
  description: 'Reissuing Acess Token',
  required: true,
  content: {
    'application/json': {schema: RefreshGrantSchema},
  },
};

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      // minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @repository(UserRepository)
    public usersRepository: UserRepository,
    @repository(TenantRepository)
    public tenantsRepository: TenantRepository,
    @repository(RoleRepository)
    public rolesRepository: RoleRepository,
    @repository(UserTenantRepository)
    public utRepository: UserTenantRepository,
    @repository(UserTenantPermissionRepository)
    public utPermsRepository: UserTenantPermissionRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(RefreshTokenServiceBindings.REFRESH_TOKEN_SERVICE)
    public refreshService: RefreshTokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserDto,
  ) {}

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<TokenObject> {
    // ensure the user exists, and the password is correct,
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    //NOTE: This method actually adds an entire user into the token
    const userProfile = this.userService.convertToUserProfile(user);
    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    const tokens = await this.refreshService.generateToken(userProfile, token);
    return tokens;
  }

  @post('/users/refresh', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  })
  async refresh(
    @requestBody(RefreshGrantRequestBody) refreshGrant: RefreshGrant,
  ): Promise<TokenObject> {
    return this.refreshService.refreshToken(refreshGrant.refreshToken);
  }

  @post('/users', {
    responses: {
      '200': {
        description: 'Users DTO instance',
        content: {'application/json': {schema: {'x-ts-type': UserDto}}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserDto, {
            title: 'NewUser',
          }),
        },
      },
    })
    userObj: UserDto,
  ): Promise<UserDto> {
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
        new Tenant({
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
      console.log(uuid());
      const userModel = new User({
        id: uuid(),
        firstName: userObj.firstName,
        middleName: userObj.middleName,
        lastName: userObj.lastName,
        username: userObj.username,
        email: userObj.email,
        phone: userObj.phone,
        password: await hash(userObj.password, await genSalt()),
        defaultTenant: tenant.id!,
      });

      userExists = await this.usersRepository.create(userModel);
    } else {
      // Map the new tenant with existing user
    }
    userObj.id = userExists.id;

    const userTenant = await this.utRepository.create(
      new UserTenant({
        roleId: roleExists.id,
        userId: userExists.id,
        tenantId: tenant.id,
        status: 'active',
      }),
    );
    userObj.tenant.id = tenant.id;

    if (userObj.permissions && userObj.permissions.length > 0) {
      const utPerms = userObj.permissions.map(perm => {
        return new UserTenantPermission({
          permission: perm.permission,
          allowed: perm.allowed,
          userTenantId: userTenant.id,
        });
      });
      await this.utPermsRepository.createAll(utPerms);
    }
    return new UserDto(_.omit(userObj, 'password'));
  }

  @authenticate('jwt')
  @get('/users/count', {
    responses: {
      '200': {
        description: 'Users model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.usersRepository.count(where);
  }

  @authenticate('jwt')
  @get('/users', {
    responses: {
      '200': {
        description: 'Array of Users model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.usersRepository.find(filter);
  }

  @authenticate('jwt')
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
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    users: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.usersRepository.updateAll(users, where);
  }

  @authenticate('jwt')
  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'Users model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'})
    filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.usersRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'Users PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    users: User,
  ): Promise<void> {
    await this.usersRepository.updateById(id, users);
  }

  @authenticate('jwt')
  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'Users PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() users: User,
  ): Promise<void> {
    await this.usersRepository.replaceById(id, users);
  }

  @authenticate('jwt')
  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'Users DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usersRepository.deleteById(id);
  }
}
