import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, put, requestBody} from '@loopback/rest';
import {Role} from '../models';
import {RoleRepository} from '../repositories';

export class RoleController {
  constructor(
    @repository(RoleRepository)
    public rolesRepository: RoleRepository,
  ) {}

  @post('/roles', {
    responses: {
      '200': {
        description: 'Roles model instance',
        content: {'application/json': {schema: getModelSchemaRef(Role)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {
            title: 'NewRoles',
            exclude: ['id'],
          }),
        },
      },
    })
    roles: Omit<Role, 'id'>,
  ): Promise<Role> {
    return this.rolesRepository.create(roles);
  }

  @get('/roles/count', {
    responses: {
      '200': {
        description: 'Roles model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Role) where?: Where<Role>): Promise<Count> {
    return this.rolesRepository.count(where);
  }

  @get('/roles', {
    responses: {
      '200': {
        description: 'Array of Roles model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Role, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Role) filter?: Filter<Role>): Promise<Role[]> {
    return this.rolesRepository.find(filter);
  }

  @patch('/roles', {
    responses: {
      '200': {
        description: 'Roles PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {partial: true}),
        },
      },
    })
    roles: Role,
    @param.where(Role) where?: Where<Role>,
  ): Promise<Count> {
    return this.rolesRepository.updateAll(roles, where);
  }

  @get('/roles/{id}', {
    responses: {
      '200': {
        description: 'Roles model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Role, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Role, {exclude: 'where'})
    filter?: FilterExcludingWhere<Role>,
  ): Promise<Role> {
    return this.rolesRepository.findById(id, filter);
  }

  @patch('/roles/{id}', {
    responses: {
      '204': {
        description: 'Roles PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {partial: true}),
        },
      },
    })
    roles: Role,
  ): Promise<void> {
    await this.rolesRepository.updateById(id, roles);
  }

  @put('/roles/{id}', {
    responses: {
      '204': {
        description: 'Roles PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() roles: Role,
  ): Promise<void> {
    await this.rolesRepository.replaceById(id, roles);
  }

  @del('/roles/{id}', {
    responses: {
      '204': {
        description: 'Roles DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.rolesRepository.deleteById(id);
  }
}
