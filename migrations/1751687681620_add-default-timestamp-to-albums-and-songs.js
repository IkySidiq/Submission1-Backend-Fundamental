exports.shorthands = undefined;

exports.up = (pgm) => {
  // albums
  pgm.alterColumn('albums', 'created_at', {
    default: pgm.func('current_timestamp'),
  });
  pgm.alterColumn('albums', 'updated_at', {
    default: pgm.func('current_timestamp'),
  });

  // songs
  pgm.alterColumn('songs', 'created_at', {
    default: pgm.func('current_timestamp'),
  });
  pgm.alterColumn('songs', 'updated_at', {
    default: pgm.func('current_timestamp'),
  });
};

exports.down = (pgm) => {
  // albums
  pgm.alterColumn('albums', 'created_at', {
    default: null,
  });
  pgm.alterColumn('albums', 'updated_at', {
    default: null,
  });

  // songs
  pgm.alterColumn('songs', 'created_at', {
    default: null,
  });
  pgm.alterColumn('songs', 'updated_at', {
    default: null,
  });
};
