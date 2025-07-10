 

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: { type: 'varchar(50)', primaryKey: true },
    playlist_id: { type: 'varchar(50)', notNull: true },
    user_id: { type: 'varchar(50)', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  pgm.addConstraint(
    'collaborations',
    'fk_collaborations.playlist_id_playlists',
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE'
  );

  pgm.addConstraint(
    'collaborations',
    'fk_collaborations.user_id_users',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
  );

  pgm.addConstraint(
    'collaborations',
    'unique_collaborations_playlist_user',
    'UNIQUE(playlist_id, user_id)'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
