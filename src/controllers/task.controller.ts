import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody} from '@loopback/rest';
import {Task} from '../models';
import {TaskRepository, UserRepository, UserTenantRepository} from '../repositories';
import {inject} from '@loopback/core';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {authenticate} from '@loopback/authentication';

export class TaskController {
  constructor(
    @repository(TaskRepository)
    public taskRepository: TaskRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserTenantRepository)
    public userTenantRepository: UserTenantRepository,
    @inject(SecurityBindings.USER)
    private user: UserProfile,
  ) {}

  @authenticate('jwt')
  @post('/tasks', {
    responses: {
      '200': {
        description: 'Task model instance',
        content: {'application/json': {schema: getModelSchemaRef(Task)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, {
            title: 'NewTask',
            exclude: ['id'],
          }),
        },
      },
    })
    task: Omit<Task, 'id'>,
  ): Promise<Task> {
    // const user = await this.userRepository.findById(this.user[securityId]);
    const userTenant = await this.userTenantRepository.findOne({
      where: {
        userId: this.user[securityId],
        tenantId: task.tenantId,
      },
    });
    if (!userTenant) {
      throw new HttpErrors.BadRequest(`user not in the given tenant`);
    }
    task.userId = this.user[securityId];
    return this.taskRepository.create(task);
  }

  @authenticate('jwt')
  @get('/tasks', {
    responses: {
      '200': {
        description: 'Array of Task model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Task, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Task) filter?: Filter<Task>): Promise<Task[]> {
    return this.taskRepository.find(filter);
  }

  @authenticate('jwt')
  @patch('/tasks', {
    responses: {
      '200': {
        description: 'Task PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(Task, {partial: true}),
          },
        },
      })
          task: Task,
      @param.where(Task) where?: Where<Task>,
  ): Promise<Count> {
    return this.taskRepository.updateAll(task, where);
  }

  @authenticate('jwt')
  @get('/tasks/{id}', {
    responses: {
      '200': {
        description: 'Task model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Task, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
      @param.path.string('id') id: string,
      @param.filter(Task, {exclude: 'where'}) filter?: FilterExcludingWhere<Task>,
  ): Promise<Task> {
    return this.taskRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/tasks/{id}', {
    responses: {
      '204': {
        description: 'Task PATCH success',
      },
    },
  })
  async updateById(
      @param.path.string('id') id: string,
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(Task, {partial: true}),
          },
        },
      })
          task: Task,
  ): Promise<void> {
    await this.taskRepository.updateById(id, task);
  }

  @authenticate('jwt')
  @put('/tasks/{id}', {
    responses: {
      '204': {
        description: 'Task PUT success',
      },
    },
  })
  async replaceById(
      @param.path.string('id') id: string,
      @requestBody() task: Task,
  ): Promise<void> {
    await this.taskRepository.replaceById(id, task);
  }

  @authenticate('jwt')
  @del('/tasks/{id}', {
    responses: {
      '204': {
        description: 'Task DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.taskRepository.deleteById(id);
  }
}
