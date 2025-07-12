const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;

    this._pool.query('SELECT current_database()').then(res => {
  console.log('[DEBUG] Connected to DB:', res.rows[0].current_database);
});
 console.log('[DEBUG] PG CONFIG:', process.env.PGDATABASE, process.env.PGUSER);

  }

  async addPlaylist({ name, owner }) {
    console.log(`NAMA ADALAH ${name}`);
    console.log(`OWNER ADALAH ${owner}`);
    const id = `playlist-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO playlists (id, name, owner, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, owner, createdAt, updatedAt],
    };
    console.log('[DEBUG] INSERT QUERY:', query);
    const result = await this._pool.query(query);
    console.log('[DEBUG] INSERT RESULT:', result.rows);
    
    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    console.log(`[DEBUG]  ${result.rows[0].id}`);
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    console.log('OWNER:', owner);
    const query = {
      text: `
        SELECT DISTINCT playlists.id, playlists.name, users.username
        FROM playlists
        JOIN users ON playlists.owner = users.id
        LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
        WHERE playlists.owner = $1 OR collaborations.user_id = $1
      `,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getPlaylistById(id) {
    const query = {
      text: `
        SELECT playlists.id, playlists.name, users.username
        FROM playlists
        JOIN users ON playlists.owner = users.id
        WHERE playlists.id = $1
      `,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  async deletePlaylistById(id) {
    const result = await this._pool.query(
      'DELETE FROM playlists WHERE id = $1 RETURNING id',
      [id]
    );

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(id, userId) {
    try {
      await this.verifyPlaylistOwner(id, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationService.verifyCollaborator(id, userId);
      } catch {
        throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
      }
    }
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `
      SELECT 
        pa.playlist_id, 
        ua.username, 
        s.title, 
        pa.action, 
        pa.time
      FROM playlist_song_activities pa
      JOIN users ua ON ua.id = pa.user_id
      JOIN songs s ON s.id = pa.song_id
      WHERE pa.playlist_id = $1
      ORDER BY pa.time ASC
    `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => ({
      playlistId: row.playlist_id,
      username: row.username,
      title: row.title, // 👈 tambahkan title
      action: row.action,
      time: row.time,
    }));
  }

}

module.exports = PlaylistsService;
