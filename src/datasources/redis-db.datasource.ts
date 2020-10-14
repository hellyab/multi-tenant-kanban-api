import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'RedisDB',
  connector: 'kv-redis',
  url: '',
  host: 'redis-17954.c1.ap-southeast-1-1.ec2.cloud.redislabs.com',
  port: 17954,
  password: 'password',
  db: 0,
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
    super(dsConfig);
  }
}
