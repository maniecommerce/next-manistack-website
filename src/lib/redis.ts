import Redis from "ioredis";

let redis: Redis;

declare global {
  // Prevent multiple instances during hot reload
  var _redis: Redis | undefined;
}

if (!global._redis) {
  global._redis = new Redis(process.env.REDIS_URL as string, {
    tls: {}, // Upstash SSL ke liye required
  });
}

redis = global._redis;

export default redis;
