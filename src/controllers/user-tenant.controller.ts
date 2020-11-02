import {
    Count,
    CountSchema,
    Filter,
    FilterExcludingWhere,
    repository,
    Where,
} from '@loopback/repository';
import {
    post,
    param,
    get,
    getModelSchemaRef,
    patch,
    put,
    del,
    requestBody,
} from '@loopback/rest';
import {UserTenant} from '../models';
import {UserTenantRepository} from '../repositories';

export class UserTenantController {
    constructor(
        @repository(UserTenantRepository)
        public userTenantRepository: UserTenantRepository,
    ) {
    }

    @post('/user-tenants', {
        responses: {
            '200': {
                description: 'UserTenant model instance',
                content: {'application/json': {schema: getModelSchemaRef(UserTenant)}},
            },
        },
    })
    async create(
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(UserTenant, {
                        title: 'NewUserTenant',
                        exclude: ['id'],
                    }),
                },
            },
        })
            userTenant: Omit<UserTenant, 'id'>,
    ): Promise<UserTenant> {
        return this.userTenantRepository.create(userTenant);
    }

    @get('/user-tenants', {
        responses: {
            '200': {
                description: 'Array of UserTenant model instances',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: getModelSchemaRef(UserTenant, {includeRelations: true}),
                        },
                    },
                },
            },
        },
    })
    async find(
        @param.filter(UserTenant) filter?: Filter<UserTenant>,
    ): Promise<UserTenant[]> {
        return this.userTenantRepository.find(filter);
    }

    @patch('/user-tenants', {
        responses: {
            '200': {
                description: 'UserTenant PATCH success count',
                content: {'application/json': {schema: CountSchema}},
            },
        },
    })
    async updateAll(
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(UserTenant, {partial: true}),
                },
            },
        })
            userTenant: UserTenant,
        @param.where(UserTenant) where?: Where<UserTenant>,
    ): Promise<Count> {
        return this.userTenantRepository.updateAll(userTenant, where);
    }

    @get('/user-tenants/{id}', {
        responses: {
            '200': {
                description: 'UserTenant model instance',
                content: {
                    'application/json': {
                        schema: getModelSchemaRef(UserTenant, {includeRelations: true}),
                    },
                },
            },
        },
    })
    async findById(
        @param.path.number('id') id: number,
        @param.filter(UserTenant, {exclude: 'where'}) filter?: FilterExcludingWhere<UserTenant>
    ): Promise<UserTenant> {
        return this.userTenantRepository.findById(id, filter);
    }

    @patch('/user-tenants/{id}', {
        responses: {
            '204': {
                description: 'UserTenant PATCH success',
            },
        },
    })
    async updateById(
        @param.path.number('id') id: number,
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(UserTenant, {partial: true}),
                },
            },
        })
            userTenant: UserTenant,
    ): Promise<void> {
        await this.userTenantRepository.updateById(id, userTenant);
    }

    @put('/user-tenants/{id}', {
        responses: {
            '204': {
                description: 'UserTenant PUT success',
            },
        },
    })
    async replaceById(
        @param.path.number('id') id: number,
        @requestBody() userTenant: UserTenant,
    ): Promise<void> {
        await this.userTenantRepository.replaceById(id, userTenant);
    }

    @del('/user-tenants/{id}', {
        responses: {
            '204': {
                description: 'UserTenant DELETE success',
            },
        },
    })
    async deleteById(@param.path.number('id') id: number): Promise<void> {
        await this.userTenantRepository.deleteById(id);
    }
}
