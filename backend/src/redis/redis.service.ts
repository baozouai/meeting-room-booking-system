import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constant';
import { RedisClientType } from 'redis';

type RedisCommandArgument = string | Buffer;

@Injectable()
export class RedisService {
  @Inject(REDIS_CLIENT)
  private readonly redisClient: RedisClientType;

  get(key: string) {
    return this.redisClient.get(key);
  }

  set(key: string, value: number | string, ttl?: number) {
    return this.redisClient.set(key, value, {
      EX: ttl,
    });
  }

  del(keys: RedisCommandArgument | RedisCommandArgument[]) {
    return this.redisClient.del(keys);
  }
}
