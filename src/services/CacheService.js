const redis = require('redis');
 
class CacheService {
  constructor() {
    this._client = redis.createClient({ //TODO: membuat koneksi ke Redis Server menggunakan library redis
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });
    this._client.on('error', (error) => { //TODO: Dengan mendengarkan event "error", kamu bisa mencetak pesan error ke terminal. Ini sangat penting untuk debugging.
      console.error(error);
    });
    this._client.connect(); //TODO: Ini mengaktifkan koneksi ke Redis.
  }

  async set(key, value, expirationInSecond = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);
    if (result === null) {throw new Error('Cache tidak ditemukan');}
    return result;
  }

  delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;