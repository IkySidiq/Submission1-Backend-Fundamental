const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsFromPlaylist(playlistId) {
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name, users.username
             FROM playlists
             JOIN users ON users.id = playlists.owner
             WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rowCount) {
      throw new Error('Playlist tidak ditemukan');
    }

    const playlist = playlistResult.rows[0];

    const songsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer
             FROM songs
             JOIN playlist_songs ON songs.id = playlist_songs.song_id
             WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const songsResult = await this._pool.query(songsQuery);

    return {
      playlist: {
        id: playlist.id,
        name: playlist.name,
        songs: songsResult.rows,
      },
    };
  }
}

module.exports = PlaylistsService;
