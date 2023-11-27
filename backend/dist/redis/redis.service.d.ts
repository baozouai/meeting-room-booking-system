/// <reference types="node" />
type RedisCommandArgument = string | Buffer;
export declare class RedisService {
    private readonly redisClient;
    get(key: string): Promise<string>;
    set(key: string, value: number | string, ttl?: number): Promise<string>;
    del(keys: RedisCommandArgument | RedisCommandArgument[]): Promise<number>;
}
export {};
