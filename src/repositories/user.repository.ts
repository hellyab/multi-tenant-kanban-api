import {DefaultCrudRepository, repository} from '@loopback/repository';
import {User, UsersRelations} from '../models';
import {PgdbDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';
import {UserCredentials, UserCredentialsRepository} from '@loopback/authentication-jwt';

export type Credentials = {
  email: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UsersRelations
> {
  // public readonly userCredentials: HasOneRepositoryFactory<
  //   UserCredentials,
  //   typeof User.prototype.id
  // >;

  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<
      UserCredentialsRepository
    >,
  ) {
    super(User, dataSource);
    // this.userCredentials = this.createHasOneRepositoryFactoryFor(
    //   'userCredentials',
    //   userCredentialsRepositoryGetter,
    // );
    // this.registerInclusionResolver(
    //   'userCredentials',
    //   this.userCredentials.inclusionResolver,
    // );
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      const user = await this.findById(userId);
      return {
        getId(): string {
          return user.id;
        },
        getIdObject(): Object {
          return new Object(user.id);
        },
        toJSON(): Object {
          return JSON.stringify(user);
        },
        toObject(): Object {
          return Object(user);
        },
        id: user.id,
        email: user.email,
        password: user.password,
        userId: user.id,
      };
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
