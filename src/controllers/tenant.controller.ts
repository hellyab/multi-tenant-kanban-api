import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, put, requestBody} from '@loopback/rest';
import {Tenant} from '../models';
import {TenantRepository} from '../repositories';

export class TenantController {
  constructor(
    @repository(TenantRepository)
    public tenantsRepository: TenantRepository,
  ) {}

  @post('/tenants', {
    responses: {
      '200': {
        description: 'Tenants model instance',
        content: {'application/json': {schema: getModelSchemaRef(Tenant)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tenant, {
            title: 'NewTenants',
            exclude: ['id'],
          }),
        },
      },
    })
    tenants: Omit<Tenant, 'id'>,
  ): Promise<Tenant> {
    return this.tenantsRepository.create(tenants);
  }

  @get('/tenants/count', {
    responses: {
      '200': {
        description: 'Tenants model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Tenant) where?: Where<Tenant>): Promise<Count> {
    return this.tenantsRepository.count(where);
  }

  @get('/tenants', {
    responses: {
      '200': {
        description: 'Array of Tenants model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Tenant, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Tenant) filter?: Filter<Tenant>): Promise<Tenant[]> {
    return this.tenantsRepository.find(filter);
  }

  @patch('/tenants', {
    responses: {
      '200': {
        description: 'Tenants PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tenant, {partial: true}),
        },
      },
    })
    tenants: Tenant,
    @param.where(Tenant) where?: Where<Tenant>,
  ): Promise<Count> {
    return this.tenantsRepository.updateAll(tenants, where);
  }

  @get('/tenants/{id}', {
    responses: {
      '200': {
        description: 'Tenants model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Tenant, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Tenant, {exclude: 'where'})
    filter?: FilterExcludingWhere<Tenant>,
  ): Promise<Tenant> {
    return this.tenantsRepository.findById(id, filter);
  }

  @patch('/tenants/{id}', {
    responses: {
      '204': {
        description: 'Tenants PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tenant, {partial: true}),
        },
      },
    })
    tenants: Tenant,
  ): Promise<void> {
    await this.tenantsRepository.updateById(id, tenants);
  }

  @put('/tenants/{id}', {
    responses: {
      '204': {
        description: 'Tenants PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tenants: Tenant,
  ): Promise<void> {
    await this.tenantsRepository.replaceById(id, tenants);
  }

  @del('/tenants/{id}', {
    responses: {
      '204': {
        description: 'Tenants DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tenantsRepository.deleteById(id);
  }
}
