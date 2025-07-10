exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: { type: 'varchar(50)', primaryKey: true },
    playlist_id: { type: 'varchar(50)', notNull: true },
    song_id: { type: 'varchar(50)', notNull: true },
    user_id: { type: 'varchar(50)', notNull: true },
    action: {
      type: 'varchar(10)',
      notNull: true,
      check: "action IN ('add', 'delete')",
    },
    time: {
      type: 'timestamp with time zone',
      default: pgm.func('current_timestamp'),
      notNull: true,
    },
  });

  pgm.addConstraint(
    'playlist_song_activities',
    'fk_playlist_song_activities.playlist_id_playlists',
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE'
  );

  pgm.addConstraint(
    'playlist_song_activities',
    'fk_playlist_song_activities.song_id_songs',
    'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE'
  );

  pgm.addConstraint(
    'playlist_song_activities',
    'fk_playlist_song_activities.user_id_users',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities');
};
