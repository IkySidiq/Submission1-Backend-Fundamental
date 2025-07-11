const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async likeAlbum(userId, albumId) {
    const id = `like-${nanoid(16)}`;
    const checkQuery = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    const result = await this._pool.query(checkQuery);
    if (result.rowCount > 0) throw new InvariantError('Album sudah disukai');

    const query = {
      text: 'INSERT INTO user_album_likes (id, user_id, album_id) VALUES ($1, $2, $3)',
      values: [id, userId, albumId],
    };
    await this._pool.query(query);
    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async unlikeAlbum(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) throw new NotFoundError('Like tidak ditemukan');

    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`album-likes:${albumId}`);
      return {
        source: 'cache',
        likes: JSON.parse(result),
      };
    } catch {
      const query = {
        text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);
      const likes = parseInt(result.rows[0].count, 10);
      await this._cacheService.set(`album-likes:${albumId}`, JSON.stringify(likes));
      return {
        source: 'db',
        likes,
      };
    }
  }

  async isAlbumExist(albumId) {
    const query = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) throw new NotFoundError('Album tidak ditemukan');
  }
}

module.exports = AlbumLikesService;
