import {DefaultKeyValueRepository} from '@loopback/repository';
import {RefreshToken} from '../models';
import {RedisDbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class RefreshTokenRepository extends DefaultKeyValueRepository<
  RefreshToken
> {
  constructor(@inject('datasources.RedisDB') dataSource: RedisDbDataSource) {
    super(RefreshToken, dataSource);
  }
}
