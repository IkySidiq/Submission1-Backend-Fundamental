exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: { type: 'varchar(50)', primaryKey: true },
    title: { type: 'text', notNull: true },
    year: { type: 'integer', notNull: true },
    genre: { type: 'text' },
    performer: { type: 'text', notNull: true },
    duration: { type: 'integer' },
    album_id: {
      type: 'varchar(50)',
      references: 'albums',
      onDelete: 'CASCADE',
    },
    created_at: { type: 'timestamp', notNull: true },
    updated_at: { type: 'timestamp', notNull: true },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
