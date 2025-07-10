exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint(
    'playlist_songs',
    'unique_playlist_songs_playlistid_songid',
    'UNIQUE(playlist_id, song_id)'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(
    'playlist_songs',
    'unique_playlist_songs_playlistid_songid'
  );
};
