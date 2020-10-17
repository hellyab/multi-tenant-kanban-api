import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'RedisDB',
  connector: 'kv-redis',
  host: 'REDIS_HOST',
  port: 'REDIS_PORT',
  password: 'REDIS_PASSWORD',
  db: 'REDIS_DB',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class RedisDbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'RedisDB';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.RedisDB', {optional: true})
    dsConfig: object = config,
  ) {
    Object.assign(dsConfig, {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DB,
    });
    super(dsConfig);
  }
}
